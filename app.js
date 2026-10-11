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

  // ---------- プリセット音声マッピング ----------
  const PRESET_PREFIX_MAP = {
    "ITエンジニア・プログラミング": "it",
    "ビジネス・営業・職場": "biz",
    "海外旅行・一人旅・観光": "travel",
    "カフェ巡り・日常会話": "cafe",
    "筋トレ・フィットネス・健康": "fitness",
  };

  function getCustomAudioId(card) {
    if (!card) return null;
    if (card.audioId) return card.audioId;
    const prefix = PRESET_PREFIX_MAP[card.theme];
    if (prefix && card.patternId) {
      return `${prefix}-${card.patternId}`;
    }
    return null;
  }

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
          customCards: Array.isArray(raw.customCards) ? raw.customCards : [],
        };
      }
    } catch (e) { /* 破損データは無視して初期化 */ }
    return { settings: { ...DEFAULT_SETTINGS }, cards: {}, history: {}, customCards: [] };
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

    const customCount = (state.customCards || []).length;
    const startCustomBtn = $("#start-custom");
    if (startCustomBtn) {
      startCustomBtn.hidden = customCount === 0;
      const countEl = $("#custom-count");
      if (countEl) countEl.textContent = customCount;
    }

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
      case "custom": {
        const customList = (state.customCards || []).map((item) => ({
          id: item.id,
          pattern: window.PATTERNS.find((p) => p.id === item.patternId) || window.PATTERNS[0],
          ja: item.ja,
          en: item.en,
          isCustom: true,
          theme: item.theme || "カスタム",
          audioId: getCustomAudioId(item),
        }));
        return { title: `カスタム例文（${customList.length}問）`, queue: shuffle(customList) };
      }
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

    $("#card-pattern").textContent = s.showHint
      ? (card.isCustom ? `[${card.theme || "AI"}] ${card.pattern.en}` : card.pattern.en)
      : "";
    $("#card-ja").textContent = card.ja;
    $("#card-en").textContent = card.en;
    $("#card-note").textContent = card.isCustom
      ? `✨ AIカスタム（${card.theme || "オリジナル"}）| ${card.pattern.en}：${card.pattern.ja}`
      : `${card.pattern.en}：${card.pattern.ja}`;
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

  // iOS Safari用: 最初のタップ時にAudioオブジェクトとSpeechSynthesisの自動再生制限を解除
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
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0.01;
      speechSynthesis.speak(u);
    }
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

    // 1. 同梱のローカル高音質MP3（ベース120問 ＋ プリセット150問 = 計270問）を優先再生（完全無料・0円）
    const audioKey = card.audioId || getCustomAudioId(card) || card.id;
    const isBundled = (audioKey && !audioKey.startsWith("c_")) || card.audioId;

    if (isBundled) {
      const playedLocal = await tryPlayLocalAudio(audioKey);
      if (playedLocal) {
        badge.textContent = "✨ ネイティブ音声（0円・オフライン）";
        badge.className = "tts-badge";
        return;
      }
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
  $("#start-custom").addEventListener("click", () => startSession({ type: "custom" }));
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
    if (!confirm("学習記録とストリーク、作成したカスタム例文をすべて初期化します。よろしいですか？")) return;
    state = { settings: state.settings, cards: {}, history: {}, customCards: [] };
    save();
    dialog.close();
    stopSession();
    showView("home");
  });

  // ==========================================
  // 🤖 AI自分専用例文ジェネレーター
  // ==========================================
  const PRESET_EXAMPLES = {
    "ITエンジニア・プログラミング": {
      1: { en: "I'd say 80% of our codebase is written in TypeScript.", ja: "コードベースの8割くらいはTypeScriptかな。" },
      2: { en: "It depends on which cloud provider we choose.", ja: "どのクラウドを使うかによるかな。" },
      3: { en: "We discussed API endpoints, caching and stuff like that.", ja: "APIエンドポイントとかキャッシュとか、そういう話をしたよ。" },
      4: { en: "Just because the tests pass doesn't mean there are no bugs.", ja: "テストが通ったからといってバグがないとは限らない。" },
      5: { en: "A popular framework is not necessarily the best choice.", ja: "人気のフレームワークが必ずしもベストとは限らない。" },
      6: { en: "I have a brain that works best late at night.", ja: "私は深夜のほうが頭が働くタイプなんだ。" },
      7: { en: "When the build broke, I was like, \"Wait, who merged this?\"", ja: "ビルドが落ちたとき「え、誰がマージしたの？」って感じだった。" },
      8: { en: "I can't function without dual monitors when coding.", ja: "コーディング中はデュアルモニターがないと無理。" },
      9: { en: "I used to write monolithic apps, but now I build microservices.", ja: "昔はモノリスを書いてたけど、今はマイクロサービスを作ってる。" },
      10: { en: "I'm used to reviewing dozens of pull requests a day.", ja: "1日に何十件もプルリクをレビューするのには慣れてるよ。" },
      11: { en: "I can't wait to deploy the new release.", ja: "新しいリリースのデプロイが待ちきれない！" },
      12: { en: "I can't stand unhandled exceptions crashing the app.", ja: "未処理の例外でアプリが落ちるのは耐えられない。" },
      13: { en: "I don't feel like debugging this legacy code today.", ja: "今日はこのレガシーコードをデバッグする気分じゃないな。" },
      14: { en: "I can't help checking the server logs every hour.", ja: "1時間おきについサーバーログをチェックしてしまう。" },
      15: { en: "The query was so slow that the database timed out.", ja: "クエリが遅すぎてデータベースがタイムアウトした。" },
      16: { en: "I'm supposed to release the hotfix by five.", ja: "5時までに緊急パッチをリリースすることになってるんだ。" },
      17: { en: "How about we refactor this function tomorrow?", ja: "明日この関数をリファクタリングするのはどう？" },
      18: { en: "I'm willing to handle the server migration this weekend.", ja: "今週末のサーバー移行なら喜んで引き受けるよ。" },
      19: { en: "Let me know when you create the pull request.", ja: "プルリクを作ったら教えてね。" },
      20: { en: "Are you down for pair programming this afternoon?", ja: "今日の午後、ペアプロやらない？" },
      21: { en: "What I like about Git is the fast branching.", ja: "Gitの好きなところは、ブランチが素早く切れること。" },
      22: { en: "I ended up staying up late to fix the critical bug.", ja: "重大なバグを直すため、結局夜更かしすることになった。" },
      23: { en: "I found the new framework surprisingly easy to use.", ja: "新しいフレームワークは使ってみたら驚くほど簡単だった。" },
      24: { en: "It takes two hours to run the full test suite.", ja: "全テストを実行するのに2時間かかる。" },
      25: { en: "I gotta back up the database before the update.", ja: "アップデートの前にデータベースをバックアップしなきゃ。" },
      26: { en: "This error message is kind of confusing.", ja: "このエラーメッセージ、なんか分かりにくいな。" },
      27: { en: "What's your take on using AI code generators?", ja: "AIコード生成ツールを使うことについてどう思う？" },
      28: { en: "You want to use Vim for everything? I respect that.", ja: "何でもVimでやるの？それもアリだね。" },
      29: { en: "I'd rather use command-line tools than a GUI.", ja: "どちらかというとGUIよりコマンドラインツールを使いたいな。" },
      30: { en: "At the end of the day, clean and readable code matters most.", ja: "結局のところ、読みやすく綺麗なコードが一番大事だよ。" }
    },
    "ビジネス・営業・職場": {
      1: { en: "I'd say we'll reach our sales target by next week.", ja: "来週までには売上目標に届くくらいかな。" },
      2: { en: "It depends on the client's budget.", ja: "クライアントの予算によるかな。" },
      3: { en: "We discussed pricing, timelines and stuff like that.", ja: "価格やスケジュールとか、そういうことを話したよ。" },
      4: { en: "Just because they showed interest doesn't mean they'll sign.", ja: "興味を示したからといって契約してくれるとは限らない。" },
      5: { en: "Lowering the price is not necessarily good for business.", ja: "値下げが必ずしもビジネスにとって良いとは限らない。" },
      6: { en: "I have a brain that loves organizing spreadsheets.", ja: "私はスプレッドシートを整理するのが得意なタイプなんだ。" },
      7: { en: "When the deal closed, I was like, \"We finally did it!\"", ja: "成約したとき「ついにやった！」って感じだったよ。" },
      8: { en: "I can't function without checking my calendar first thing.", ja: "朝イチで予定表を確認しないと動けない。" },
      9: { en: "I used to work in the office, but now I work remotely.", ja: "昔は出社してたけど、今はリモートワークしてる。" },
      10: { en: "I'm used to pitching to enterprise clients.", ja: "大手企業に提案プレゼンするのには慣れてるよ。" },
      11: { en: "I can't wait for the quarterly bonus announcement.", ja: "四半期ボーナスの発表が待ちきれない！" },
      12: { en: "I can't stand meetings that could have been an email.", ja: "メールで済むような無駄な会議は本当に耐えられない。" },
      13: { en: "I don't feel like negotiating any more discounts today.", ja: "今日はこれ以上値引き交渉をする気分じゃないな。" },
      14: { en: "I can't help feeling nervous before the keynote presentation.", ja: "基調講演のプレゼン前は思わず緊張してしまう。" },
      15: { en: "The presentation was so convincing that they signed immediately.", ja: "プレゼンが素晴らしすぎて、彼らは即決でサインした。" },
      16: { en: "I'm supposed to submit the weekly report by Friday.", ja: "金曜日までに週報を提出することになってるんだ。" },
      17: { en: "How about we reschedule the meeting to Monday?", ja: "ミーティングを月曜日にリスケするのはどう？" },
      18: { en: "I'm willing to negotiate better payment terms.", ja: "より良い支払い条件を交渉する覚悟があります。" },
      19: { en: "Let me know when the client signs the contract.", ja: "クライアントが契約書にサインしたら教えてね。" },
      20: { en: "Are you down for lunch with the new team members?", ja: "新メンバーと一緒にランチ行かない？" },
      21: { en: "What I like about this company is the open communication.", ja: "この会社の好きなところは、率直に意見が言えるところ。" },
      22: { en: "I ended up leading the project after the manager left.", ja: "マネージャーが異動して、結局私がプロジェクトを率いることになった。" },
      23: { en: "I found the sales training very practical and helpful.", ja: "営業研修は受けてみたらとても実践的で役に立った。" },
      24: { en: "It takes about three months to close an enterprise deal.", ja: "大口契約を決めるには約3ヶ月かかる。" },
      25: { en: "I gotta prepare the slides for the board meeting.", ja: "役員会議のスライドを準備しなきゃ。" },
      26: { en: "That proposal is kind of risky.", ja: "その提案は、ちょっとリスクが高いね。" },
      27: { en: "What's your take on the competitor's new campaign?", ja: "競合他社の新しいキャンペーンについてどう思う？" },
      28: { en: "You decided to change careers? I respect that.", ja: "キャリアチェンジを決めたの？その決断を尊重するよ。" },
      29: { en: "I'd rather discuss this issue face-to-face.", ja: "できればこの件は対面で話し合いたいな。" },
      30: { en: "At the end of the day, customer satisfaction is what drives growth.", ja: "結局のところ、顧客満足度こそが成長の原動力だよ。" }
    },
    "海外旅行・一人旅・観光": {
      1: { en: "I'd say it takes about twenty minutes to reach the terminal.", ja: "ターミナルまでは大体20分くらいかな。" },
      2: { en: "It depends on the local weather forecast.", ja: "現地の天気予報によるかな。" },
      3: { en: "We checked out monuments, museums and stuff like that.", ja: "記念碑や美術館とか、そういうのを見て回ったよ。" },
      4: { en: "Just because a souvenir shop is crowded doesn't mean it's cheap.", ja: "お土産屋が混んでるからといって安いとは限らない。" },
      5: { en: "The top-rated tourist spot is not necessarily the most enjoyable.", ja: "評価1位の観光地が必ずしも一番楽しいとは限らない。" },
      6: { en: "I have a body that adjusts quickly to different time zones.", ja: "私は時差ボケにすぐ順応できる体質なんだ。" },
      7: { en: "When I saw the ocean view, I was like, \"This is paradise!\"", ja: "海の景色を見たとき「ここ天国じゃん！」って感じだった。" },
      8: { en: "I can't function without Google Maps in a foreign city.", ja: "見知らぬ海外の街ではGoogleマップがないと無理。" },
      9: { en: "I used to book packaged tours, but now I travel solo.", ja: "昔はツアー旅行を予約してたけど、今は一人旅をしてる。" },
      10: { en: "I'm used to staying in budget hostels.", ja: "格安ホステルに泊まるのには慣れてるよ。" },
      11: { en: "I can't wait to try authentic local street food.", ja: "本場の屋台メシを食べるのが待ち遠しい！" },
      12: { en: "I can't stand delayed flights without any announcement.", ja: "何のアナウンスもないフライト遅延は耐えられない。" },
      13: { en: "I don't feel like waking up early on vacation.", ja: "休暇中に早起きする気にはなれないな。" },
      14: { en: "I can't help buying postcards everywhere I go.", ja: "行く先々で思わず絵葉書を買ってしまうんだ。" },
      15: { en: "The sunset was so beautiful that everyone took pictures.", ja: "夕日が綺麗すぎてみんな写真を撮っていた。" },
      16: { en: "I'm supposed to check in two hours before the flight.", ja: "フライトの2時間前にチェックインすることになってる。" },
      17: { en: "How about we rent a scooter to explore the island?", ja: "島を回るのにスクーターを借りるのはどう？" },
      18: { en: "I'm willing to try local specialties even if they look weird.", ja: "見た目が変わっていても現地の郷土料理を試す気はあるよ。" },
      19: { en: "Let me know when the boarding gate opens.", ja: "搭乗口が開いたら教えてね。" },
      20: { en: "Are you down for a sunset cruise this evening?", ja: "夕方のサンセットクルーズに乗る？" },
      21: { en: "What I like about this city is the historic architecture.", ja: "この街の好きなところは、歴史ある建築物なんだ。" },
      22: { en: "I missed the train and ended up taking a night bus.", ja: "電車を逃して、結局夜行バスに乗ることになった。" },
      23: { en: "I found the local residents incredibly warm and helpful.", ja: "地元の人たちは接してみたらすごく温かくて親切だった。" },
      24: { en: "It takes four hours to hike to the mountain summit.", ja: "山頂まで登るのに4時間かかる。" },
      25: { en: "I gotta exchange some currency before the shops close.", ja: "店が閉まる前に現金を両替しなきゃ。" },
      26: { en: "The hotel room is kind of small, but comfortable.", ja: "ホテルの部屋はちょっと狭いけど、快適だよ。" },
      27: { en: "What's your take on visiting historical ruins versus modern cities?", ja: "歴史的な遺跡巡りと大都会観光、どっちがいいと思う？" },
      28: { en: "You traveled across Asia with just a backpack? I respect that.", ja: "バックパック1つでアジアを横断したの？それはすごいね。" },
      29: { en: "I'd rather travel off the beaten path.", ja: "どちらかというと王道ルートを外れて旅したいな。" },
      30: { en: "At the end of the day, traveling opens your mind.", ja: "結局のところ、旅は視野を広げてくれるものだよ。" }
    },
    "カフェ巡り・日常会話": {
      1: { en: "I'd say this cup of coffee costs around six dollars.", ja: "このコーヒーは6ドルくらいかな。" },
      2: { en: "It depends on what kind of beans they have today.", ja: "今日どんな豆があるかによるかな。" },
      3: { en: "We talked about podcasts, baking and stuff like that.", ja: "ポッドキャストやパン作りとか、そんな話をしたよ。" },
      4: { en: "Just because a cafe is aesthetic doesn't mean the coffee is good.", ja: "映えるカフェだからってコーヒーが美味しいとは限らない。" },
      5: { en: "The darkest roast is not necessarily the strongest in caffeine.", ja: "深煎りが必ずしもカフェインが一番強いとは限らない。" },
      6: { en: "I have a body that gets jittery from too much caffeine.", ja: "私はカフェインを摂りすぎると手が震えちゃう体質なんだ。" },
      7: { en: "When I tasted the pastry, I was like, \"This is out of this world!\"", ja: "その焼き菓子を食べたとき「これ異次元に美味しい！」って感じだった。" },
      8: { en: "I can't function without an iced latte around 3 p.m.", ja: "午後3時頃にアイスラテを飲まないとやってられない。" },
      9: { en: "I used to add syrup, but now I drink black coffee.", ja: "昔はシロップを入れてたけど、今はブラックで飲んでる。" },
      10: { en: "I'm used to studying in noisy coffee shops.", ja: "ガヤガヤしたカフェで勉強するのには慣れてるよ。" },
      11: { en: "I can't wait for their seasonal autumn drinks to come out.", ja: "秋の季節限定ドリンクが出るのが待ち遠しい！" },
      12: { en: "I can't stand places that charge extra for plant milk.", ja: "植物性ミルクに追加料金を取るお店は納得がいかない。" },
      13: { en: "I don't feel like drinking anything sweet right now.", ja: "今は甘いものを飲む気分じゃないな。" },
      14: { en: "I can't help ordering carrot cake whenever I see it.", ja: "キャロットケーキを見かけると、思わず頼んじゃうんだ。" },
      15: { en: "The aroma was so inviting that I walked straight inside.", ja: "香りが良すぎて、吸い寄せられるように店内に入っちゃった。" },
      16: { en: "I'm supposed to meet my friend here at two.", ja: "ここで2時に友達と待ち合わせすることになってる。" },
      17: { en: "How about we grab a table outside on the patio?", ja: "テラス席のテーブルを取るのはどう？" },
      18: { en: "I'm willing to wait in line for the freshly baked cinnamon rolls.", ja: "焼きたてのシナモンロールのためなら喜んで並ぶよ。" },
      19: { en: "Let me know when they call our order number.", ja: "番号が呼ばれたら教えてね。" },
      20: { en: "Are you down for coffee and a walk in the park?", ja: "コーヒー買って公園を散歩しない？" },
      21: { en: "What I like about this shop is the quiet jazz playlist.", ja: "この店の好きなところは、静かなジャズが流れているところ。" },
      22: { en: "We chatted so much that we ended up ordering a second round.", ja: "話が弾んで、結局2杯目を頼むことになった。" },
      23: { en: "I found oat milk surprisingly creamy with espresso.", ja: "オーツミルクはエスプレッソと合わせると驚くほどクリーミーだった。" },
      24: { en: "It takes about five minutes to make a pour-over coffee.", ja: "ハンドドリップを淹れるのには5分くらいかかる。" },
      25: { en: "I gotta finish this book before my battery dies.", ja: "充電が切れる前にこの本を読み終えなきゃ。" },
      26: { en: "This matcha latte is kind of sweet.", ja: "この抹茶ラテ、なんかちょっと甘いな。" },
      27: { en: "What's your take on cold brew versus regular iced coffee?", ja: "コールドブリューと普通のアイスコーヒー、どっちが好き？" },
      28: { en: "You roast your own green beans at home? I respect that.", ja: "家で生豆から焙煎してるの？本格的でいいね。" },
      29: { en: "I'd rather sit near the window with sunlight.", ja: "どちらかというと日の当たる窓際に座りたいな。" },
      30: { en: "At the end of the day, a good cup of coffee resets your mood.", ja: "結局のところ、美味しい1杯のコーヒーが気分を切り替えてくれる。" }
    },
    "筋トレ・フィットネス・健康": {
      1: { en: "I'd say I spend about an hour at the gym each time.", ja: "1回のジムでの滞在時間は1時間くらいかな。" },
      2: { en: "It depends on how much energy I have after work.", ja: "仕事終わりにどれだけ体力が残ってるかによるかな。" },
      3: { en: "We talked about protein, supplements and stuff like that.", ja: "プロテインとかサプリとか、そういう話をしたよ。" },
      4: { en: "Just because you sweat a lot doesn't mean you burned more fat.", ja: "たくさん汗をかいたからといって脂肪が多く燃えたとは限らない。" },
      5: { en: "Lifting heavier weights is not necessarily the best way to grow muscle.", ja: "重い重量を上げることが必ずしも筋肥大にベストとは限らない。" },
      6: { en: "I have a body that builds muscle relatively quickly.", ja: "私は比較的筋肉がつきやすい体質なんだ。" },
      7: { en: "When I hit a new personal record, I was like, \"Let's go!\"", ja: "自己ベストを更新したとき「よっしゃー！」って感じだった。" },
      8: { en: "I can't function without drinking a liter of water in the morning.", ja: "朝イチで水を1リットル飲まないと動けない。" },
      9: { en: "I used to skip leg days, but now I train them twice a week.", ja: "昔は脚トレをサボってたけど、今は週2回鍛えてる。" },
      10: { en: "I'm used to preparing high-protein meals in advance.", ja: "高タンパクな食事を作り置きするのには慣れてるよ。" },
      11: { en: "I can't wait for my rest day on Sunday.", ja: "日曜日の休息日が待ち遠しくて仕方ない！" },
      12: { en: "I can't stand people who don't wipe down the gym benches.", ja: "ジムのベンチを拭かない人には我慢できない。" },
      13: { en: "I don't feel like doing high-intensity cardio today.", ja: "今日はキツい有酸素運動をする気分じゃないな。" },
      14: { en: "I can't help checking my posture in every mirror.", ja: "鏡を見るたびに思わず姿勢をチェックしてしまう。" },
      15: { en: "The workout was so intense that my legs were shaking.", ja: "トレーニングが激しすぎて脚がプルプル震えていた。" },
      16: { en: "I'm supposed to hit my protein goal before sleeping.", ja: "寝る前にタンパク質の目標を達成することになってるんだ。" },
      17: { en: "How about we go for a light jog tomorrow morning?", ja: "明日の朝、軽くジョギングするのはどう？" },
      18: { en: "I'm willing to wake up early to beat the gym rush.", ja: "ジムの混雑を避けるためなら早起きする覚悟があるよ。" },
      19: { en: "Let me know when you finish using the squat rack.", ja: "スクワットラックを使い終わったら教えてね。" },
      20: { en: "Are you down for a workout session this weekend?", ja: "今週末、一緒にジムで筋トレしない？" },
      21: { en: "What I like about lifting weights is the mental clarity afterwards.", ja: "筋トレの好きなところは、終わった後の頭のスッキリ感。" },
      22: { en: "I planned a short run but ended up running ten kilometers.", ja: "軽く走るつもりが、結局10キロ走ることになった。" },
      23: { en: "I found stretching every night made my back pain disappear.", ja: "毎晩ストレッチをしてみたら腰痛が消えたんだ。" },
      24: { en: "It takes consistent effort over months to see visible progress.", ja: "目に見える変化を出すには数ヶ月の地道な継続が必要だ。" },
      25: { en: "I gotta drink my protein shake before it gets warm.", ja: "ぬるくなる前にプロテインを飲まなきゃ。" },
      26: { en: "My shoulder feels kind of sore today.", ja: "今日、肩がなんかちょっと痛むんだ。" },
      27: { en: "What's your take on doing intermittent fasting?", ja: "16時間プチ断食についてどう思う？" },
      28: { en: "You gave up alcohol completely for fitness? I respect that.", ja: "筋トレのために完全に禁酒したの？そのストイックさ尊敬するよ。" },
      29: { en: "I'd rather work out in the morning than in the evening.", ja: "どちらかというと夜より朝に運動したいな。" },
      30: { en: "At the end of the day, health is your greatest wealth.", ja: "結局のところ、健康こそが最大の財産だよ。" }
    }
  };

  function getScopePatternIds(scope) {
    if (scope === "part1") return [1, 2, 3, 4, 5];
    if (scope === "part2") return [6, 7, 8, 9, 10];
    if (scope === "part3") return [11, 12, 13, 14, 15];
    if (scope === "part4") return [16, 17, 18, 19, 20];
    if (scope === "part5") return [21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    return Array.from({ length: 30 }, (_, i) => i + 1);
  }

  function getPresetFallbackSentences(theme, targetIds) {
    let key = "ITエンジニア・プログラミング";
    const t = theme.toLowerCase();
    if (t.includes("ビジネス") || t.includes("営業") || t.includes("会社") || t.includes("仕事") || t.includes("ミーティング")) {
      key = "ビジネス・営業・職場";
    } else if (t.includes("旅行") || t.includes("観光") || t.includes("ホテル") || t.includes("空港") || t.includes("海外")) {
      key = "海外旅行・一人旅・観光";
    } else if (t.includes("カフェ") || t.includes("日常") || t.includes("友達") || t.includes("珈琲") || t.includes("パン")) {
      key = "カフェ巡り・日常会話";
    } else if (t.includes("筋トレ") || t.includes("健康") || t.includes("ジム") || t.includes("フィットネス") || t.includes("運動")) {
      key = "筋トレ・フィットネス・健康";
    } else if (PRESET_EXAMPLES[theme]) {
      key = theme;
    }
    const dict = PRESET_EXAMPLES[key];
    const prefix = PRESET_PREFIX_MAP[key] || "it";
    return targetIds.map((pid) => {
      const ex = dict[pid];
      return { patternId: pid, ja: ex.ja, en: ex.en, audioId: `${prefix}-${pid}`, theme: key };
    });
  }

  async function generateSentencesWithGemini(theme, targetIds, apiKey) {
    const targetPatterns = targetIds.map((id) => {
      const p = window.PATTERNS.find((x) => x.id === id);
      return `${id}: ${p.en} (${p.ja})`;
    }).join("\n");

    const prompt = `あなたはプロの英語ネイティブ講師です。以下のテーマに合わせて、指定された英語構文を使った瞬間英作文の練習用オリジナル例文を作成してください。

【テーマ・シチュエーション】
${theme}

【作成対象の構文リスト】
${targetPatterns}

【ルール】
- 各構文につき1つずつ、テーマ「${theme}」に沿った、ネイティブが普段の会話で実際に口にする極めて自然で実用的な例文を作成してください。
- 中学レベルの基礎単語を中心に、長すぎずテンポよく発話できる英文（en）にしてください。
- 日本語訳（ja）は、口語的でパッと英語が思い浮かぶ自然な日本語にしてください。
- 各構文の特徴的なキーワード（例: I'd say, It depends on, What I like about ~ is など）を必ず英文に含めてください。
- 出力は必ず以下の形式のJSON配列のみを返してください：
[
  {
    "patternId": 1,
    "ja": "日本語例文",
    "en": "English example sentence"
  }
]`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Geminiからデータを受信できませんでした。");

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      throw new Error("Geminiの応答を解析できませんでした。");
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("例文の形式が不正です。");
    }

    return parsed.map((item) => ({
      patternId: Number(item.patternId),
      ja: String(item.ja || "").trim(),
      en: String(item.en || "").trim(),
    })).filter((x) => x.patternId && x.ja && x.en);
  }

  // ---------- AIモーダル制御 ----------
  const aiModal = $("#ai-modal");
  const openAiBtn = $("#open-ai-modal");
  const closeAiBtn = $("#close-ai-modal");
  const themeInput = $("#ai-theme-input");
  const scopeSelect = $("#ai-scope-select");
  const aiKeyHint = $("#ai-key-hint");
  const generateBtn = $("#ai-generate-btn");
  const loadingEl = $("#ai-loading");
  const loadingText = $("#ai-loading-text");
  const previewEl = $("#ai-preview");
  const previewList = $("#ai-preview-list");
  const previewCount = $("#ai-preview-count");
  const previewTheme = $("#ai-preview-theme");
  const saveBtn = $("#ai-save-btn");
  const cancelBtn = $("#ai-cancel-btn");
  const chipButtons = document.querySelectorAll(".chip-group .chip");

  let currentGeneratedCards = [];
  let currentThemeName = "";

  function updateAiKeyHint() {
    const hasKey = !!state.settings.geminiApiKey;
    if (hasKey) {
      aiKeyHint.className = "ai-key-hint with-key";
      aiKeyHint.innerHTML = "✨ <strong>Gemini 2.5 Flash 連携中</strong>：あなたのテーマに合わせ、完全オリジナルの実践例文をリアルタイム自動生成します。";
    } else {
      aiKeyHint.className = "ai-key-hint no-key";
      aiKeyHint.innerHTML = "💡 <strong>0円・APIキー不要モード</strong>：上のプリセットから即座に生成できます。<br><small>完全オリジナルな自由テーマを無制限に生成したい場合は、⚙️設定で無料のGemini APIキーを登録できます。</small>";
    }
  }

  openAiBtn?.addEventListener("click", () => {
    updateAiKeyHint();
    loadingEl.hidden = true;
    previewEl.hidden = true;
    generateBtn.disabled = false;
    currentGeneratedCards = [];
    aiModal.showModal();
  });

  closeAiBtn?.addEventListener("click", () => {
    aiModal.close();
  });

  chipButtons.forEach((chip) => {
    chip.addEventListener("click", () => {
      chipButtons.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      themeInput.value = chip.dataset.preset;
    });
  });

  generateBtn?.addEventListener("click", async () => {
    const theme = (themeInput.value.trim() || "ITエンジニア・プログラミング");
    const scope = scopeSelect.value;
    const targetIds = getScopePatternIds(scope);
    const apiKey = state.settings.geminiApiKey;

    generateBtn.disabled = true;
    previewEl.hidden = true;
    loadingEl.hidden = false;
    currentThemeName = theme;

    try {
      if (apiKey) {
        loadingText.textContent = `Geminiが「${theme}」の例文を作成中...`;
        try {
          currentGeneratedCards = await generateSentencesWithGemini(theme, targetIds, apiKey);
        } catch (apiErr) {
          console.warn("Gemini generation failed, falling back to curated preset:", apiErr);
          alert(`Gemini APIエラー: ${apiErr.message}\n高品質なプリセット例文にフォールバックします。`);
          currentGeneratedCards = getPresetFallbackSentences(theme, targetIds);
        }
      } else {
        loadingText.textContent = `プリセットから「${theme}」の例文を展開中...`;
        // 自然な待ち時間を少し演出
        await new Promise((r) => setTimeout(r, 400));
        currentGeneratedCards = getPresetFallbackSentences(theme, targetIds);
      }

      // プレビュー描画
      previewList.innerHTML = "";
      currentGeneratedCards.forEach((card) => {
        const pat = window.PATTERNS.find((p) => p.id === card.patternId) || window.PATTERNS[0];
        const item = document.createElement("div");
        item.className = "preview-item";
        item.innerHTML = `
          <div class="preview-item-pattern">${pat.en} (${pat.ja})</div>
          <div class="preview-item-ja">${card.ja}</div>
          <div class="preview-item-en">${card.en}</div>
        `;
        previewList.appendChild(item);
      });

      previewCount.textContent = currentGeneratedCards.length;
      previewTheme.textContent = theme;
      loadingEl.hidden = true;
      previewEl.hidden = false;
    } catch (e) {
      alert(`生成に失敗しました: ${e.message}`);
      loadingEl.hidden = true;
    } finally {
      generateBtn.disabled = false;
    }
  });

  cancelBtn?.addEventListener("click", () => {
    previewEl.hidden = true;
    currentGeneratedCards = [];
  });

  saveBtn?.addEventListener("click", () => {
    if (!currentGeneratedCards.length) return;

    if (!Array.isArray(state.customCards)) {
      state.customCards = [];
    }

    const now = Date.now();
    currentGeneratedCards.forEach((card, idx) => {
      const audioId = card.audioId || getCustomAudioId({ theme: currentThemeName, patternId: card.patternId });
      state.customCards.push({
        id: `c_${now}_${idx}`,
        patternId: card.patternId,
        ja: card.ja,
        en: card.en,
        theme: currentThemeName,
        audioId: audioId,
        createdAt: new Date().toISOString(),
      });
    });

    save();
    aiModal.close();
    renderHome();

    // ユーザーに練習をすぐ促す
    if (confirm(`✨ ${currentGeneratedCards.length}問のオリジナル例文を追加しました！\n今すぐ練習を始めますか？`)) {
      startSession({ type: "custom" });
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !views.home.hidden) renderHome();
  });

  showView("home");
})();
