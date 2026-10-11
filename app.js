(() => {
  "use strict";

  const STORAGE_KEY = "shunkan-eisakubun-v1";
  const DB_NAME = "shunkan-eisakubun-audio";
  const DB_STORE = "cache";

  // Leitner式の復習間隔（日）。レベルが上がるほど間隔が空く。
  const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
  const MASTERED_LEVEL = 3;

  const DEFAULT_SETTINGS = {
    dailyGoal: 10,
    timerSec: 5,
    speechRate: 1,
    autoSpeak: true,
    showHint: true,
    typingMode: false,
    ttsEngine: "gemini", // "gemini" or "browser"
    geminiApiKey: "",
    geminiModel: "gemini-3.8-flash-tts",
    geminiVoice: "Kore", // Kore, Puck, Aoede, Fenrir, Charon
  };

  // ---------- データ ----------
  const CARDS = [];
  for (const p of window.PATTERNS) {
    p.examples.forEach((ex, i) => {
      CARDS.push({ id: `${p.id}-${i}`, pattern: p, ja: ex.ja, en: ex.en });
    });
  }
  const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

  // ---------- IndexedDB 音声キャッシュ ----------
  let dbPromise = null;
  function getDB() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          e.target.result.createObjectStore(DB_STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }
  async function getCachedAudio(key) {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readonly");
        const req = tx.objectStore(DB_STORE).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch { return null; }
  }
  async function setCachedAudio(key, blob) {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).put(blob, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch { return false; }
  }
  async function countCachedAudio() {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readonly");
        const req = tx.objectStore(DB_STORE).count();
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      });
    } catch { return 0; }
  }
  async function clearAudioCache() {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch { return false; }
  }

  // ---------- 日付ユーティリティ（ローカル時刻） ----------
  const pad = (n) => String(n).padStart(2, "0");
  const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const todayKey = () => toKey(new Date());
  const addDays = (k, n) => { const d = fromKey(k); d.setDate(d.getDate() + n); return toKey(d); };

  // ---------- 永続化 ----------
  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (raw && typeof raw === "object") {
        return {
          settings: { ...DEFAULT_SETTINGS, ...raw.settings },
          cards: raw.cards || {},
          history: raw.history || {},
        };
      }
    } catch (e) { /* 破損データは無視して初期化 */ }
    return { settings: { ...DEFAULT_SETTINGS }, cards: {}, history: {} };
  }
  let state = loadState();
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const cardState = (id) =>
    state.cards[id] || { level: 0, due: null, seen: 0, good: 0, wrong: 0 };

  // ---------- ストリーク ----------
  function dayMet(k) {
    const h = state.history[k];
    return !!h && h.answered >= (h.goal || state.settings.dailyGoal);
  }
  function currentStreak() {
    let k = todayKey();
    if (!dayMet(k)) k = addDays(k, -1); // 今日まだ未達でも昨日までの連続は維持
    let n = 0;
    while (dayMet(k)) { n++; k = addDays(k, -1); }
    return n;
  }
  function bestStreak() {
    const days = Object.keys(state.history).filter(dayMet).sort();
    let best = 0, run = 0, prev = null;
    for (const k of days) {
      run = prev && addDays(prev, 1) === k ? run + 1 : 1;
      best = Math.max(best, run);
      prev = k;
    }
    return best;
  }
  const todayAnswered = () => state.history[todayKey()]?.answered || 0;

  // ---------- DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const views = {
    home: $("#view-home"), practice: $("#view-practice"),
    result: $("#view-result"), list: $("#view-list"),
  };
  function showView(name) {
    for (const [k, el] of Object.entries(views)) el.hidden = k !== name;
    if (name === "home") renderHome();
    if (name === "list") renderList();
    window.scrollTo({ top: 0 });
  }
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-nav]");
    if (nav) { stopSession(); showView(nav.dataset.nav); }
  });

  // ---------- ホーム ----------
  function renderHeaderStreak() {
    const s = currentStreak();
    const badge = $("#header-streak");
    badge.textContent = `🔥 ${s}`;
    badge.classList.toggle("inactive", !dayMet(todayKey()));
  }

  function renderHome() {
    const goal = state.settings.dailyGoal;
    const done = todayAnswered();
    const streak = currentStreak();
    const metToday = dayMet(todayKey());

    $("#stat-streak").textContent = streak;
    $("#stat-best").textContent = bestStreak();
    $("#streak-message").textContent = metToday
      ? "今日の目標達成！また明日も続けよう"
      : streak > 0
        ? `あと${Math.max(goal - done, 0)}問で${streak + 1}日目に！`
        : `${goal}問解くとストリーク開始`;

    const mastered = CARDS.filter((c) => cardState(c.id).level >= MASTERED_LEVEL).length;
    $("#stat-mastered").textContent = mastered;
    $("#stat-total").textContent = `/${CARDS.length}`;

    $("#today-count").textContent = `${done} / ${goal}問`;
    const prog = $("#today-progress");
    prog.max = goal;
    prog.value = Math.min(done, goal);
    prog.classList.toggle("done", metToday);
    $("#start-daily").textContent = metToday ? "さらに練習する" : "今日の練習をはじめる";

    $("#weak-count").textContent = weakCards().length;

    const partBox = $("#part-buttons");
    partBox.replaceChildren(...window.PARTS.map((part) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn part-btn";
      const ids = CARDS.filter((c) => c.pattern.part === part.id);
      const m = ids.filter((c) => cardState(c.id).level >= MASTERED_LEVEL).length;
      b.innerHTML = `<span>${part.name}</span><small>${m}/${ids.length}</small>`;
      b.addEventListener("click", () => startSession({ type: "part", part: part.id }));
      return b;
    }));

    renderHeatmap();
    renderHeaderStreak();
  }

  function renderHeatmap() {
    const WEEKS = 18;
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - (WEEKS - 1) * 7); // 日曜はじまり
    const goal = state.settings.dailyGoal;
    const tKey = todayKey();
    const cells = [];
    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const k = toKey(d);
      const n = state.history[k]?.answered || 0;
      const g = state.history[k]?.goal || goal;
      const level = n === 0 ? 0 : n < g / 2 ? 1 : n < g ? 2 : n < g * 2 ? 3 : 4;
      const cell = document.createElement("i");
      cell.dataset.l = level;
      if (k === tKey) cell.classList.add("today");
      if (k > tKey) cell.classList.add("future");
      cell.title = `${k}: ${n}問`;
      cells.push(cell);
    }
    $("#heatmap").replaceChildren(...cells);
  }

  // ---------- 構文一覧 ----------
  function renderList() {
    const box = $("#pattern-list");
    box.replaceChildren(...window.PARTS.map((part) => {
      const block = document.createElement("section");
      block.className = "part-block";
      const h = document.createElement("h2");
      h.textContent = part.name;
      block.append(h);
      for (const p of window.PATTERNS.filter((x) => x.part === part.id)) {
        const ids = p.examples.map((_, i) => `${p.id}-${i}`);
        const m = ids.filter((id) => cardState(id).level >= MASTERED_LEVEL).length;
        const d = document.createElement("details");
        d.className = "pattern-item";
        d.name = "patterns";
        d.innerHTML = `
          <summary>
            <span class="pattern-num">${p.id}</span>
            <span><span class="pattern-en"></span><br><span class="pattern-ja"></span></span>
            <span class="mastery">習得 ${m}/${ids.length}</span>
          </summary>
          <div class="pattern-body">
            <p class="note"></p>
            <ul></ul>
            <button type="button" class="btn small primary">この構文を練習</button>
          </div>`;
        d.querySelector(".pattern-en").textContent = p.en;
        d.querySelector(".pattern-ja").textContent = p.ja;
        d.querySelector(".note").textContent = p.note;
        d.querySelector("ul").replaceChildren(...p.examples.map((ex) => {
          const li = document.createElement("li");
          li.textContent = ex.en;
          const s = document.createElement("span");
          s.textContent = ex.ja;
          li.append(s);
          return li;
        }));
        d.querySelector("button").addEventListener("click", () =>
          startSession({ type: "pattern", pattern: p.id }));
        block.append(d);
      }
      return block;
    }));
  }

  // ---------- 出題セット ----------
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const weakCards = () => CARDS.filter((c) => {
    const s = cardState(c.id);
    return s.seen > 0 && s.wrong > 0 && s.level <= 1;
  });

  function buildQueue(mode) {
    const goal = state.settings.dailyGoal;
    switch (mode.type) {
      case "daily": {
        const t = todayKey();
        const due = shuffle(CARDS.filter((c) => {
          const s = cardState(c.id);
          return s.seen > 0 && s.due && s.due <= t;
        })).sort((a, b) => cardState(a.id).level - cardState(b.id).level);
        const fresh = CARDS.filter((c) => cardState(c.id).seen === 0);
        let q = [...due, ...fresh].slice(0, goal);
        if (q.length < goal) {
          const rest = shuffle(CARDS.filter((c) => !q.includes(c)))
            .sort((a, b) => cardState(a.id).level - cardState(b.id).level);
          q = q.concat(rest.slice(0, goal - q.length));
        }
        return { title: "今日の練習", queue: q };
      }
      case "weak":
        return { title: "苦手な例文を復習", queue: shuffle(weakCards()).slice(0, 20) };
      case "random":
        return { title: "ランダム", queue: shuffle(CARDS).slice(0, goal) };
      case "part": {
        const part = window.PARTS.find((p) => p.id === mode.part);
        return { title: part.name, queue: shuffle(CARDS.filter((c) => c.pattern.part === mode.part)) };
      }
      case "pattern": {
        const p = window.PATTERNS.find((x) => x.id === mode.pattern);
        return { title: p.en, queue: shuffle(CARDS.filter((c) => c.pattern.id === mode.pattern)) };
      }
    }
  }

  // ---------- 練習セッション ----------
  let session = null;
  let timerId = null;

  function startSession(mode) {
    const { title, queue } = buildQueue(mode);
    if (!queue.length) {
      alert(mode.type === "weak" ? "苦手な例文はありません。この調子！" : "出題できる例文がありません。");
      return;
    }
    session = {
      mode, title, queue, index: 0, revealed: false,
      results: { again: 0, hard: 0, good: 0 },
      requeued: new Map(), streakBefore: currentStreak(), metBefore: dayMet(todayKey()),
    };
    $("#practice-title").textContent = title;
    showView("practice");
    showCard();
  }

  function stopSession() {
    clearTimeout(timerId);
    stopAudio();
    session = null;
  }

  function showCard() {
    const card = session.queue[session.index];
    const s = state.settings;
    session.revealed = false;

    $("#practice-counter").textContent = `${session.index + 1} / ${session.queue.length}`;
    const sp = $("#session-progress");
    sp.max = session.queue.length;
    sp.value = session.index;

    $("#card-pattern").textContent = s.showHint ? card.pattern.en : "";
    $("#card-ja").textContent = card.ja;
    $("#card-en").textContent = card.en;
    $("#card-note").textContent = `${card.pattern.en}：${card.pattern.ja}`;
    $("#answer").hidden = true;
    $("#reveal-actions").hidden = false;
    $("#grade-actions").hidden = true;
    $("#tts-source").textContent = "";
    $("#tts-source").className = "tts-badge";

    const form = $("#type-form");
    const input = $("#type-input");
    form.hidden = !s.typingMode;
    input.value = "";
    input.disabled = false;
    $("#type-result").hidden = true;
    if (s.typingMode) input.focus();

    // 制限時間バー
    clearTimeout(timerId);
    const timer = $("#timer");
    const bar = $("#timer-bar");
    bar.classList.remove("running");
    timer.hidden = !(s.timerSec > 0);
    if (s.timerSec > 0) {
      bar.style.setProperty("--duration", `${s.timerSec}s`);
      void bar.offsetWidth; // アニメーションを再始動
      bar.classList.add("running");
      if (!s.typingMode) timerId = setTimeout(reveal, s.timerSec * 1000);
    }
  }

  const normalize = (t) => t.toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ").trim();

  function reveal() {
    if (!session || session.revealed) return;
    session.revealed = true;
    clearTimeout(timerId);
    $("#timer-bar").classList.remove("running");

    const card = session.queue[session.index];
    if (state.settings.typingMode) {
      const input = $("#type-input");
      input.disabled = true;
      const typed = normalize(input.value);
      const answer = normalize(card.en);
      const res = $("#type-result");
      res.hidden = false;
      if (!typed) {
        res.textContent = "（未入力）";
        res.className = "type-result ng";
      } else if (typed === answer) {
        res.textContent = "✓ 完全一致！";
        res.className = "type-result ok";
      } else {
        const aw = answer.split(" ");
        const tw = new Set(typed.split(" "));
        const hit = aw.filter((w) => tw.has(w)).length;
        res.textContent = `あなたの回答: ${input.value}（一致率 ${Math.round((hit / aw.length) * 100)}%）`;
        res.className = "type-result ng";
      }
    }

    $("#answer").hidden = false;
    $("#reveal-actions").hidden = true;
    $("#grade-actions").hidden = false;
    if (state.settings.autoSpeak) speakCard(card);
  }

  function grade(result) {
    if (!session || !session.revealed) return;
    const card = session.queue[session.index];
    const t = todayKey();
    const s = { ...cardState(card.id) };

    s.seen++;
    if (result === "again") {
      s.level = 0;
      s.wrong++;
      s.due = t;
      const n = session.requeued.get(card.id) || 0;
      if (n < 2) {
        session.requeued.set(card.id, n + 1);
        const pos = Math.min(session.index + 4, session.queue.length);
        session.queue.splice(pos, 0, card);
      }
    } else if (result === "hard") {
      s.level = Math.max(1, s.level);
      s.due = addDays(t, 1);
    } else {
      s.level = Math.min(s.level + 1, INTERVALS.length - 1);
      s.good++;
      s.due = addDays(t, INTERVALS[s.level]);
    }
    state.cards[card.id] = s;

    const h = state.history[t] || { answered: 0, good: 0, goal: state.settings.dailyGoal };
    h.answered++;
    if (result === "good") h.good++;
    h.goal = state.settings.dailyGoal;
    state.history[t] = h;
    save();
    session.results[result]++;
    renderHeaderStreak();

    session.index++;
    if (session.index >= session.queue.length) finishSession();
    else showCard();
  }

  function finishSession() {
    const r = session.results;
    const total = r.again + r.hard + r.good;
    const rate = total ? Math.round((r.good / total) * 100) : 0;
    $("#result-summary").textContent =
      `${total}問中 ◯${r.good}　△${r.hard}　✕${r.again}（正答率 ${rate}%）`;

    const met = dayMet(todayKey());
    const streak = currentStreak();
    let msg;
    if (met && !session.metBefore) {
      msg = `🔥 今日の目標達成！ ${streak}日連続！`;
      $("#result-emoji").textContent = "🔥";
    } else if (met) {
      msg = `🔥 ${streak}日連続キープ中`;
      $("#result-emoji").textContent = rate >= 80 ? "🎉" : "💪";
    } else {
      msg = `今日の目標まであと${state.settings.dailyGoal - todayAnswered()}問`;
      $("#result-emoji").textContent = "💪";
    }
    $("#result-streak").textContent = msg;

    const mode = session.mode;
    $("#result-again").onclick = () => startSession(mode);
    stopSession();
    showView("result");
  }

  // ---------- 音声フォーマット変換（PCM/WAV） ----------
  function base64ToBlob(base64, mimeType = "audio/wav") {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

    // PCM生データの場合はWAVコンテナ（44バイトRIFFヘッダー）を付与
    if (mimeType.includes("pcm") || mimeType.includes("raw") || !mimeType.includes("audio/")) {
      const rateMatch = mimeType.match(/rate=(\d+)/);
      const rate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
      return pcmToWavBlob(bytes, rate);
    }
    return new Blob([bytes], { type: mimeType });
  }

  function pcmToWavBlob(pcmData, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeStr(36, "data");
    view.setUint32(40, dataSize, true);
    new Uint8Array(buffer, 44).set(pcmData);
    return new Blob([buffer], { type: "audio/wav" });
  }

  // ---------- Gemini 3.8 TTS API呼び出し ----------
  async function generateGeminiSpeech(text, apiKey, model = "gemini-3.8-flash-tts", voice = "Kore") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: "natural, friendly, conversational native American English"
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice
              }
            }
          }
        }
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const inline = part?.inlineData;
    if (!inline || !inline.data) {
      throw new Error("APIから音声データが返されませんでした");
    }
    return base64ToBlob(inline.data, inline.mimeType || "audio/wav");
  }

  // ---------- 音声再生エンジン ----------
  let currentAudio = null;
  let browserVoice = null;

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function playBlob(blob) {
    stopAudio();
    const url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);
    currentAudio.onended = () => { URL.revokeObjectURL(url); currentAudio = null; };
    currentAudio.onerror = () => { URL.revokeObjectURL(url); currentAudio = null; };
    return currentAudio.play();
  }

  function pickBrowserVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    const prefer = ["Samantha", "Google US English", "Alex", "Microsoft Aria", "Microsoft Jenny"];
    browserVoice = prefer.map((n) => voices.find((v) => v.name.includes(n))).find(Boolean)
      || voices.find((v) => v.lang === "en-US") || voices[0] || null;
  }
  if ("speechSynthesis" in window) {
    pickBrowserVoice();
    speechSynthesis.addEventListener?.("voiceschanged", pickBrowserVoice);
  }

  function speakBrowser(text) {
    if (!("speechSynthesis" in window)) return;
    stopAudio();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (browserVoice) u.voice = browserVoice;
    u.rate = Number(state.settings.speechRate) || 1;
    speechSynthesis.speak(u);
  }

  // iOS Safari用: 最初のタップ時にAudioオブジェクトの自動再生制限を解除
  let audioUnlocked = false;
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    const dummy = new Audio("audio/1-0.mp3");
    dummy.volume = 0.01;
    dummy.play().then(() => {
      dummy.pause();
      dummy.currentTime = 0;
    }).catch(() => {});
  }
  document.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
  document.addEventListener("click", unlockAudio, { once: true });

  function tryPlayLocalAudio(cardId) {
    return new Promise((resolve) => {
      stopAudio();
      const audio = new Audio(`audio/${cardId}.mp3`);
      let done = false;
      audio.onplay = () => {
        if (!done) { done = true; currentAudio = audio; resolve(true); }
      };
      audio.onerror = () => {
        if (!done) { done = true; resolve(false); }
      };
      audio.play().then(() => {
        if (!done) { done = true; currentAudio = audio; resolve(true); }
      }).catch(() => {
        if (!done) { done = true; resolve(false); }
      });
    });
  }

  // カード専用の再生（ローカル同梱音声 → キャッシュ → Gemini API → ブラウザ音声）
  async function speakCard(card) {
    const s = state.settings;
    const badge = $("#tts-source");

    // 1. 同梱のローカル高音質MP3（120問分）を優先再生（完全無料・0円）
    const playedLocal = await tryPlayLocalAudio(card.id);
    if (playedLocal) {
      badge.textContent = "✨ ネイティブ音声（0円・オフライン）";
      badge.className = "tts-badge";
      return;
    }

    // 2. ブラウザ標準設定の場合
    if (s.ttsEngine === "browser") {
      badge.textContent = "ブラウザ標準";
      badge.className = "tts-badge fallback";
      speakBrowser(card.en);
      return;
    }

    // 3. Gemini 3.8 TTS 設定の場合
    const cacheKey = `${card.id}_${s.geminiModel}_${s.geminiVoice}`;
    const cached = await getCachedAudio(cacheKey);

    if (cached) {
      badge.textContent = `✨ Gemini 3.8 (${s.geminiVoice})`;
      badge.className = "tts-badge";
      playBlob(cached);
      return;
    }

    // APIキーがない場合はブラウザ音声にフォールバックし、案内を表示
    if (!s.geminiApiKey) {
      badge.textContent = "ブラウザ音声（⚙️でAPIキーを設定）";
      badge.className = "tts-badge fallback";
      speakBrowser(card.en);
      return;
    }

    // APIから新規生成
    badge.textContent = "✨ Gemini 3.8 生成中...";
    badge.className = "tts-badge loading";

    try {
      const blob = await generateGeminiSpeech(card.en, s.geminiApiKey, s.geminiModel, s.geminiVoice);
      await setCachedAudio(cacheKey, blob);
      badge.textContent = `✨ Gemini 3.8 (${s.geminiVoice})`;
      badge.className = "tts-badge";
      playBlob(blob);
    } catch (err) {
      console.warn("Gemini TTS エラー:", err);
      badge.textContent = "ブラウザ音声（Geminiエラー）";
      badge.className = "tts-badge fallback";
      speakBrowser(card.en);
    }
  }

  // ---------- イベント ----------
  $("#start-daily").addEventListener("click", () => startSession({ type: "daily" }));
  $("#start-weak").addEventListener("click", () => startSession({ type: "weak" }));
  $("#start-random").addEventListener("click", () => startSession({ type: "random" }));
  $("#reveal-btn").addEventListener("click", reveal);
  $("#speak-btn").addEventListener("click", () => session && speakCard(session.queue[session.index]));
  $("#quit-practice").addEventListener("click", () => { stopSession(); showView("home"); });
  $("#grade-actions").addEventListener("click", (e) => {
    const b = e.target.closest("[data-grade]");
    if (b) grade(b.dataset.grade);
  });
  $("#type-form").addEventListener("submit", (e) => { e.preventDefault(); reveal(); });

  document.addEventListener("keydown", (e) => {
    if (!session || views.practice.hidden || $("#settings-dialog").open) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const typing = e.target.matches("input:not(:disabled)");
    if (typing) return;
    if ((e.key === " " || e.key === "Enter") && e.target.closest("button")) return;
    if (!session.revealed && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      reveal();
    } else if (session.revealed) {
      if (e.key === "1") grade("again");
      else if (e.key === "2") grade("hard");
      else if (e.key === "3" || e.key === " " || e.key === "Enter") { e.preventDefault(); grade("good"); }
      else if (e.key.toLowerCase() === "r") speakCard(session.queue[session.index]);
    }
  });

  // ---------- 設定モーダル ----------
  const dialog = $("#settings-dialog");
  const form = $("#settings-form");
  const ttsSelect = $("#tts-engine-select");
  const geminiSub = $("#gemini-subfields");
  const browserSub = $("#browser-subfields");
  const keyInput = $("#gemini-api-key");
  const toggleKeyBtn = $("#toggle-key-visibility");
  const testTtsBtn = $("#test-tts-btn");
  const testStatus = $("#test-tts-status");
  const cacheCountEl = $("#cache-count");
  const clearCacheBtn = $("#clear-cache-btn");

  function updateTtsFieldsVisibility() {
    const isGemini = ttsSelect.value === "gemini";
    geminiSub.hidden = !isGemini;
    browserSub.hidden = isGemini;
  }
  ttsSelect.addEventListener("change", updateTtsFieldsVisibility);

  toggleKeyBtn.addEventListener("click", () => {
    const isPw = keyInput.type === "password";
    keyInput.type = isPw ? "text" : "password";
    toggleKeyBtn.textContent = isPw ? "隠す" : "表示";
  });

  testTtsBtn.addEventListener("click", async () => {
    const key = keyInput.value.trim();
    if (!key) {
      testStatus.textContent = "APIキーを入力してください";
      testStatus.className = "status-msg error";
      keyInput.focus();
      return;
    }
    testStatus.textContent = "生成中...";
    testStatus.className = "status-msg";
    testTtsBtn.disabled = true;
    try {
      const model = form.geminiModel.value;
      const voice = form.geminiVoice.value;
      const sample = "I'd say eighty percent of the time I'm working from home.";
      const blob = await generateGeminiSpeech(sample, key, model, voice);
      playBlob(blob);
      testStatus.textContent = "✓ 再生成功！";
      testStatus.className = "status-msg success";
    } catch (e) {
      testStatus.textContent = `✕ エラー: ${e.message}`;
      testStatus.className = "status-msg error";
    } finally {
      testTtsBtn.disabled = false;
    }
  });

  async function updateCacheCount() {
    const n = await countCachedAudio();
    cacheCountEl.textContent = `キャッシュ: ${n}件`;
  }

  clearCacheBtn.addEventListener("click", async () => {
    if (!confirm("キャッシュされた音声データを消去しますか？")) return;
    await clearAudioCache();
    await updateCacheCount();
  });

  $("#open-settings").addEventListener("click", async () => {
    const s = state.settings;
    form.dailyGoal.value = s.dailyGoal;
    form.timerSec.value = s.timerSec;
    form.speechRate.value = s.speechRate;
    form.autoSpeak.checked = s.autoSpeak;
    form.showHint.checked = s.showHint;
    form.typingMode.checked = s.typingMode;
    form.ttsEngine.value = s.ttsEngine;
    form.geminiApiKey.value = s.geminiApiKey;
    form.geminiModel.value = s.geminiModel;
    form.geminiVoice.value = s.geminiVoice;
    testStatus.textContent = "";
    updateTtsFieldsVisibility();
    await updateCacheCount();
    dialog.returnValue = "";
    dialog.showModal();
  });

  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "save") return;
    state.settings = {
      dailyGoal: Math.max(1, Math.min(100, parseInt(form.dailyGoal.value, 10) || 10)),
      timerSec: Math.max(0, Math.min(30, parseInt(form.timerSec.value, 10) || 0)),
      speechRate: Number(form.speechRate.value) || 1,
      autoSpeak: form.autoSpeak.checked,
      showHint: form.showHint.checked,
      typingMode: form.typingMode.checked,
      ttsEngine: form.ttsEngine.value,
      geminiApiKey: form.geminiApiKey.value.trim(),
      geminiModel: form.geminiModel.value,
      geminiVoice: form.geminiVoice.value,
    };
    const h = state.history[todayKey()];
    if (h) h.goal = state.settings.dailyGoal;
    save();
    if (!views.home.hidden) renderHome();
    renderHeaderStreak();
  });

  $("#reset-data").addEventListener("click", () => {
    if (!confirm("学習記録とストリークをすべて削除します。よろしいですか？")) return;
    state = { settings: state.settings, cards: {}, history: {} };
    save();
    dialog.close();
    stopSession();
    showView("home");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !views.home.hidden) renderHome();
  });

  showView("home");
})();
