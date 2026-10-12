(() => {
  "use strict";

  const STORAGE_KEY = "shunkan-eisakubun-v1";
  const DB_NAME = "shunkan-eisakubun-audio";
  const DB_STORE = "cache";

  // 2-Tone Pop UI Vector Icon Helper
  function uiIcon(name, extraClass = "") {
    return `<svg class="ui-icon ${extraClass}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  }

  function renderBadgeIcon(iconName, extraClass = "") {
    const iconMap = {
      "🌱": "sparkle",
      "🔥": "flame",
      "⚡": "bolt",
      "⚡️": "bolt",
      "👑": "trophy",
      "🎯": "target",
      "🏃‍♂️": "trending-up",
      "⚔️": "bolt",
      "🏆": "trophy",
      "💡": "lightbulb",
      "🌟": "sparkle",
      "💎": "trophy",
      "🌌": "sparkle",
      "🤖": "robot",
      "🌅": "sparkle",
      "🌙": "timer",
      "🎧": "headphones",
      "📻": "speaker"
    };
    const key = iconMap[iconName] || (typeof iconName === "string" && iconName.startsWith("icon-") ? iconName.slice(5) : null);
    if (key) {
      return uiIcon(key, extraClass);
    }
    return iconName;
  }

  function triggerHaptic(type = "light") {
    if (!navigator.vibrate) return;
    try {
      if (type === "light") navigator.vibrate(10);
      else if (type === "medium") navigator.vibrate(20);
      else if (type === "success") navigator.vibrate([12, 35, 18]);
      else if (type === "warning") navigator.vibrate([18, 40, 18]);
    } catch {}
  }

  // Leitner式の復習間隔（日）。レベルが上がるほど間隔が空く。
  const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
  const MASTERED_LEVEL = 3;

  const DEFAULT_SETTINGS = {
    dailyGoal: 10,
    timerSec: 5,
    speechRate: 1.15,
    autoSpeak: true,
    showHint: true,
    typingMode: false,
    ttsEngine: "bundled", // "bundled", "gemini", or "browser"
    geminiApiKey: "",
    geminiModel: "gemini-3.8-flash-tts",
    geminiVoice: "Kore", // Kore, Puck, Aoede, Fenrir, Charon
    geminiAccent: "us", // us, uk, in, au, global
  };

  // ---------- データ ----------
  const CONV_CARDS = [];
  for (const p of window.PATTERNS) {
    p.examples.forEach((ex, i) => {
      CONV_CARDS.push({ id: `${p.id}-${i}`, course: "conversation", pattern: p, ja: ex.ja, en: ex.en });
    });
  }
  const GRIT_CARDS = [];
  for (const p of (window.GRIT_PATTERNS || [])) {
    p.examples.forEach((ex, i) => {
      GRIT_CARDS.push({ id: `grit-${p.id}-${i}`, course: "grit", pattern: p, ja: ex.ja, en: ex.en, tag: ex.tag });
    });
  }
  const ALL_CARDS = [...CONV_CARDS, ...GRIT_CARDS];
  const CARD_BY_ID = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]));
  const CARDS = [];

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

  // ---------- アクセント定義 ----------
  const ACCENT_LIST = ["us", "uk", "in", "au"];
  const ACCENT_LABELS = {
    us: { flag: "🇺🇸", name: "米語", label: "アメリカ英語" },
    uk: { flag: "🇬🇧", name: "英語", label: "イギリス英語" },
    in: { flag: "🇮🇳", name: "印語", label: "インド英語" },
    au: { flag: "🇦🇺", name: "豪語", label: "オーストラリア英語" },
  };
  const ACCENT_STYLE_PROMPTS = {
    us: "natural, authentic native General American English with distinct American rhoticity, flap 't', and smooth conversational American connected speech at a brisk, natural conversational native pace (fluent, linked, not slow or overly enunciated)",
    uk: "authentic, distinctly British English with crisp Received Pronunciation (RP), clear non-rhotic pronunciation, sharp consonants, and characteristic refined British intonation at a brisk, natural conversational native pace",
    in: "deep, strong, and unmistakably authentic native Indian English accent. Prominent Indian phonetics: distinct retroflex 't' and 'd' consonants with curled tongue, dental stops, syllable-timed cadence, characteristic melodic musical pitch inflection, light tapped 'r', crisp unaspirated consonants, rich and natural Indian subcontinent speaker pronunciation at a brisk, natural conversational pace",
    au: "authentic, distinctly Australian English with broad Aussie vowels and diphthongs, characteristic vocal warmth, and friendly rising intonation at phrase endings at a brisk, natural conversational native pace",
  };

  function getEffectiveAccent(cardOrId, settingAccent = "us") {
    if (settingAccent !== "global") return settingAccent || "us";
    const idStr = typeof cardOrId === "object" && cardOrId ? cardOrId.id : String(cardOrId || "");
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash * 31 + idStr.charCodeAt(i)) >>> 0;
    }
    return ACCENT_LIST[hash % ACCENT_LIST.length];
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
  async function findCachedAudio(cardId, isJa = false, preferredModel = "", preferredVoice = "", preferredAccent = "") {
    if (!cardId) return null;
    try {
      // 1. 指定モデル・ボイス・アクセントの完全一致キーを直接取得（最速）
      if (preferredModel && preferredVoice) {
        if (isJa) {
          const exactKey = `ja_${cardId}_${preferredModel}_${preferredVoice}`;
          const exactBlob = await getCachedAudio(exactKey);
          if (exactBlob) return { blob: exactBlob, key: exactKey };
        } else {
          if (preferredAccent) {
            const exactKey = `${cardId}_${preferredModel}_${preferredVoice}_${preferredAccent}`;
            const exactBlob = await getCachedAudio(exactKey);
            if (exactBlob) return { blob: exactBlob, key: exactKey };
          }
          // 旧キー（アクセント指定なし）も探索（preferredAccentが"us"なら互換ヒット）
          if (!preferredAccent || preferredAccent === "us") {
            const oldKey = `${cardId}_${preferredModel}_${preferredVoice}`;
            const oldBlob = await getCachedAudio(oldKey);
            if (oldBlob) return { blob: oldBlob, key: oldKey };
          }
        }
      }

      // 2. カーソル走査でプレフィックス一致を探索（モデルやボイスが違っても確実にキャッシュから再生）
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readonly");
        const store = tx.objectStore(DB_STORE);
        const prefix = isJa ? `ja_${cardId}_` : `${cardId}_`;
        const req = store.openCursor();
        let fallbackCandidate = null;

        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (!cursor) {
            // 指定アクセントがありUS以外の場合は旧米語キャッシュにフォールバックさせず、新規生成を促す
            if (preferredAccent && preferredAccent !== "us") {
              resolve(null);
            } else {
              resolve(fallbackCandidate);
            }
            return;
          }
          const k = String(cursor.key);
          if (isJa) {
            if (k.startsWith(prefix)) {
              resolve({ blob: cursor.value, key: k });
              return;
            }
          } else {
            if (!k.startsWith("ja_") && k.startsWith(prefix)) {
              // もし指定アクセントがあればアクセント一致を最優先
              if (preferredAccent && k.endsWith(`_${preferredAccent}`)) {
                resolve({ blob: cursor.value, key: k });
                return;
              }
              // preferredAccentが米語または未指定の場合のみ、他アクセント接尾辞（_uk, _in, _au）を持たない旧キャッシュを候補とする
              const hasNonUsAccent = ["uk", "in", "au"].some((a) => k.endsWith(`_${a}`));
              if ((!preferredAccent || preferredAccent === "us") && !hasNonUsAccent && !fallbackCandidate) {
                fallbackCandidate = { blob: cursor.value, key: k };
              }
            }
          }
          cursor.continue();
        };
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

  function blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result;
        const b64 = typeof res === "string" ? res.split(",")[1] || "" : "";
        resolve(b64);
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  }

  async function getAllCachedAudio() {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readonly");
        const store = tx.objectStore(DB_STORE);
        const list = [];
        const req = store.openCursor();
        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            list.push({ key: String(cursor.key), blob: cursor.value });
            cursor.continue();
          } else {
            resolve(list);
          }
        };
        req.onerror = () => resolve([]);
      });
    } catch { return []; }
  }

  async function restoreAudioCacheItems(items) {
    if (!Array.isArray(items) || items.length === 0) return 0;
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readwrite");
        const store = tx.objectStore(DB_STORE);
        let count = 0;
        for (const item of items) {
          if (item && item.key && item.data) {
            const blob = base64ToBlob(item.data, item.mime || "audio/wav");
            store.put(blob, item.key);
            count++;
          }
        }
        tx.oncomplete = () => resolve(count);
        tx.onerror = () => resolve(count);
      });
    } catch { return 0; }
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
        const settings = { ...DEFAULT_SETTINGS, ...raw.settings };
        if (settings.geminiApiKey && settings.ttsEngine === "bundled" && raw.settings?.ttsEngine === "gemini") {
          settings.ttsEngine = "gemini";
        }
        if (!settings.geminiApiKey && settings.ttsEngine === "gemini") {
          settings.ttsEngine = "bundled";
        }
        if (raw.settings && (raw.settings.speechRate === 1 || raw.settings.speechRate === "1" || !raw.settings.speechRate)) {
          settings.speechRate = 1.15;
        }
        return {
          activeCourse: (raw.activeCourse === "grit" ? "grit" : "conversation"),
          settings,
          cards: raw.cards || {},
          history: raw.history || {},
          customCards: Array.isArray(raw.customCards) ? raw.customCards : [],
          achievements: raw.achievements || {},
          listeningCount: typeof raw.listeningCount === "number" ? raw.listeningCount : 0,
          streakShields: typeof raw.streakShields === "number" ? raw.streakShields : 1, // 初期ギフト1個
          shieldUsedDates: Array.isArray(raw.shieldUsedDates) ? raw.shieldUsedDates : [],
          shieldAwardedMilestones: Array.isArray(raw.shieldAwardedMilestones) ? raw.shieldAwardedMilestones : [],
        };
      }
    } catch (e) { /* 破損データは無視して初期化 */ }
    return {
      activeCourse: "conversation",
      settings: { ...DEFAULT_SETTINGS },
      cards: {},
      history: {},
      customCards: [],
      achievements: {},
      listeningCount: 0,
      streakShields: 1,
      shieldUsedDates: [],
      shieldAwardedMilestones: [],
    };
  }
  let state = loadState();
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  // 🔒 iOS Safari ITP / Android 自動削除対策（ストレージ永続化要請）
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then((persisted) => {
      if (persisted) console.log("Storage persistence enabled.");
    }).catch(() => {});
  }

  function showToast(msg) {
    let t = $("#app-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "app-toast";
      t.className = "app-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.remove("show");
    void t.offsetWidth;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.classList.remove("show");
    }, 3800);
  }

  const getActiveCourse = () => state.activeCourse || "conversation";
  const getActiveParts = () => (getActiveCourse() === "grit" ? (window.GRIT_PARTS || []) : window.PARTS);
  const getActivePatterns = () => (getActiveCourse() === "grit" ? (window.GRIT_PATTERNS || []) : window.PATTERNS);

  function syncActiveCourseCards() {
    CARDS.length = 0;
    if (getActiveCourse() === "grit") {
      CARDS.push(...GRIT_CARDS);
    } else {
      CARDS.push(...CONV_CARDS);
    }
  }
  syncActiveCourseCards();

  function updateBrandSub() {
    const brandSub = $("#brand-sub");
    if (brandSub) {
      brandSub.textContent = getActiveCourse() === "grit" ? "GRIT 30" : `口語 ${window.PATTERNS.length}`;
    }
  }

  function updateCourseSwitchUI() {
    const course = getActiveCourse();
    $$(".course-tab-btn, .listening-course-pill").forEach((btn) => {
      const active = btn.dataset.course === course;
      btn.classList.toggle("active", active);
      if (btn.hasAttribute("aria-selected")) {
        btn.setAttribute("aria-selected", active ? "true" : "false");
      }
    });
    const convTabSub = $("#conv-tab-sub");
    if (convTabSub) convTabSub.textContent = `実戦フレーズ・${CONV_CARDS.length}問`;
    const convListeningPill = $('#listening-course-bar .listening-course-pill[data-course="conversation"] span');
    if (convListeningPill) convListeningPill.innerHTML = `${uiIcon("speech", "icon-sm")} 口語編 (${CONV_CARDS.length}問)`;
  }

  function switchCourse(courseName) {
    if (state.activeCourse === courseName) return;
    state.activeCourse = courseName;
    save();
    syncActiveCourseCards();
    updateBrandSub();
    updateCourseSwitchUI();
    stopSession();
    if (listening && listening.active) {
      loadListeningQueue(listening.range || "all");
      renderListeningView();
    }
    renderHome();
    renderList();
    if (views.report && !views.report.hidden) {
      renderReport();
    }
  }

  const cardState = (id) =>
    state.cards[id] || { level: 0, due: null, seen: 0, good: 0, wrong: 0 };

  // ---------- ストリーク ----------
  function dayMet(k) {
    if (Array.isArray(state.shieldUsedDates) && state.shieldUsedDates.includes(k)) return true;
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

  // 🛡️ ストリーク保護シールド判定
  function checkStreakShield() {
    const tKey = todayKey();
    const yKey = addDays(tKey, -1);
    const byKey = addDays(tKey, -2);

    if (!Array.isArray(state.shieldUsedDates)) state.shieldUsedDates = [];

    // 「昨日が未達成」かつ「一昨日が達成されていた」かつ「シールド残数 > 0」かつ「昨日がまだ保護されていない」
    if (!dayMet(yKey) && dayMet(byKey) && (state.streakShields || 0) > 0 && !state.shieldUsedDates.includes(yKey)) {
      state.streakShields = Math.max(0, state.streakShields - 1);
      state.shieldUsedDates.push(yKey);
      save();
      setTimeout(() => {
        showToast(`🛡️ ストリーク保護が発動しました！ 昨日の記録を守りました（残りシールド: ${state.streakShields}/3）`);
      }, 700);
      return true;
    }
    return false;
  }

  // 🎁 7日連続ごとのシールド獲得判定
  function checkShieldReward() {
    const s = currentStreak();
    if (s < 7) return;
    if (!Array.isArray(state.shieldAwardedMilestones)) state.shieldAwardedMilestones = [];
    const milestone = Math.floor(s / 7) * 7;
    if (milestone >= 7 && !state.shieldAwardedMilestones.includes(milestone)) {
      state.shieldAwardedMilestones.push(milestone);
      const prev = state.streakShields || 0;
      if (prev < 3) {
        state.streakShields = Math.min(3, prev + 1);
        save();
        setTimeout(() => {
          showToast(`🛡️ ${milestone}日連続達成！ ストリーク保護シールドを+1個獲得（現在: ${state.streakShields}/3）`);
        }, 1200);
      } else {
        save();
      }
    }
  }
  const todayAnswered = () => state.history[todayKey()]?.answered || 0;

  // ---------- DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const views = {
    home: $("#view-home"), practice: $("#view-practice"),
    result: $("#view-result"), list: $("#view-list"),
    report: $("#view-report"),
    listening: $("#view-listening"),
  };
  function updateNavIndicator() {
    const bNav = $("#bottom-nav");
    if (!bNav || bNav.hidden) return;
    const activeTab = bNav.querySelector(".nav-tab.active");
    const indicator = $("#nav-indicator");
    if (indicator) {
      if (activeTab) {
        const navRect = bNav.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        if (tabRect.width > 0) {
          const left = tabRect.left - navRect.left;
          indicator.style.width = `${tabRect.width}px`;
          indicator.style.transform = `translateX(${left}px)`;
          indicator.style.opacity = "1";
          return;
        }
      }
      indicator.style.opacity = "0";
    }
  }
  window.addEventListener("resize", updateNavIndicator);

  function showView(name) {
    if (name !== "listening" && typeof stopListening === "function" && listening && listening.active) {
      stopListening();
    }
    for (const [k, el] of Object.entries(views)) if (el) el.hidden = k !== name;

    const bNav = $("#bottom-nav");
    if (bNav) {
      bNav.hidden = (name === "practice");
      const tabs = bNav.querySelectorAll(".nav-tab");
      tabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.nav === name);
      });
      requestAnimationFrame(updateNavIndicator);
      setTimeout(updateNavIndicator, 60);
    }

    if (name === "home") renderHome();
    if (name === "list") renderList();
    if (name === "report") renderReport();
    if (name === "listening") renderListeningView();
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
    badge.innerHTML = `${uiIcon("flame")} <span>${s}</span>`;
    badge.classList.toggle("inactive", !dayMet(todayKey()));
  }

  function renderHome() {
    const goal = state.settings.dailyGoal;
    const done = todayAnswered();
    const streak = currentStreak();
    const metToday = dayMet(todayKey());

    $("#stat-streak").textContent = streak;
    $("#stat-best").textContent = bestStreak();
    const shieldCountVal = $("#shield-count-val");
    if (shieldCountVal) shieldCountVal.textContent = state.streakShields ?? 1;
    const modalShieldCount = $("#modal-shield-count");
    if (modalShieldCount) modalShieldCount.textContent = state.streakShields ?? 1;
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
    partBox.replaceChildren(...getActiveParts().map((part) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn part-btn";
      const ids = CARDS.filter((c) => c.pattern.part === part.id);
      const m = ids.filter((c) => cardState(c.id).level >= MASTERED_LEVEL).length;
      b.innerHTML = `<span>${part.name}</span><small>${m}/${ids.length}</small>`;
      b.addEventListener("click", () => startSession({ type: "part", part: part.id }));
      return b;
    }));

    renderBadgeGrid();
    renderCalendar();
    renderHeaderStreak();
    updateBrandSub();
    updateCourseSwitchUI();
  }

  // ---------- 学習カレンダー（月間カレンダー） ----------
  let calCurrentDate = new Date();
  let calSelectedKey = null;

  function renderCalendar() {
    const year = calCurrentDate.getFullYear();
    const month = calCurrentDate.getMonth(); // 0-indexed
    const titleEl = $("#cal-month-title");
    if (titleEl) {
      titleEl.textContent = `${year}年 ${month + 1}月`;
    }

    const tKey = todayKey();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    // 月曜始まり (0: 月, 1: 火, ..., 6: 日)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const prevMonthDays = new Date(year, month, 0).getDate();

    let completedCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const k = `${year}-${pad(month + 1)}-${pad(d)}`;
      if (dayMet(k)) completedCount++;
    }
    const statEl = $("#cal-month-stat");
    if (statEl) {
      statEl.textContent = `今月 ${completedCount}日達成`;
    }

    const grid = $("#calendar-grid");
    if (!grid) return;

    const cells = [];

    // 前月の日付埋め
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const cell = document.createElement("div");
      cell.className = "cal-day other-month";
      cell.setAttribute("aria-hidden", "true");
      cell.innerHTML = `<span class="cal-day-num">${dayNum}</span>`;
      cells.push(cell);
    }

    // 当月の日付
    for (let d = 1; d <= daysInMonth; d++) {
      const k = `${year}-${pad(month + 1)}-${pad(d)}`;
      const h = state.history[k];
      const ans = h?.answered || 0;
      const met = dayMet(k);
      const isToday = k === tKey;
      const isFuture = k > tKey;

      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cal-day";
      cell.setAttribute("role", "gridcell");
      cell.dataset.date = k;

      const isShielded = Array.isArray(state.shieldUsedDates) && state.shieldUsedDates.includes(k);
      if (isToday) cell.classList.add("today");
      if (isFuture) cell.classList.add("future");
      if (isShielded) {
        cell.classList.add("status-shielded");
      } else if (met) {
        cell.classList.add("status-completed");
      } else if (ans > 0) {
        cell.classList.add("status-partial");
      }
      if (calSelectedKey === k) {
        cell.classList.add("selected");
      }

      cell.innerHTML = `<span class="cal-day-num">${d}</span>`;
      cell.setAttribute("aria-label", `${month + 1}月${d}日: ${ans}問解答${isShielded ? " (ストリーク保護発動)" : met ? " (目標達成)" : ""}`);

      cell.addEventListener("click", () => {
        calSelectedKey = k;
        grid.querySelectorAll(".cal-day").forEach((c) => c.classList.remove("selected"));
        cell.classList.add("selected");

        const footerText = $("#cal-footer-text");
        if (footerText) {
          if (isFuture) {
            footerText.textContent = `${month + 1}月${d}日: まだ学習していません`;
          } else {
            const statusLabel = isShielded ? " (🛡️ ストリーク保護発動)" : met ? " (目標達成！ 🎉)" : ans > 0 ? " (あと少し！)" : " (学習記録なし)";
            footerText.textContent = `${month + 1}月${d}日: ${ans}問解答${statusLabel}`;
          }
        }
      });

      cells.push(cell);
    }

    // 翌月の日付埋め（7の倍数になるまで）
    const totalRendered = cells.length;
    const remaining = (7 - (totalRendered % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const cell = document.createElement("div");
      cell.className = "cal-day other-month";
      cell.setAttribute("aria-hidden", "true");
      cell.innerHTML = `<span class="cal-day-num">${d}</span>`;
      cells.push(cell);
    }

    grid.replaceChildren(...cells);
  }
  const renderHeatmap = renderCalendar;

  $("#cal-prev")?.addEventListener("click", () => {
    calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
    calSelectedKey = null;
    renderCalendar();
  });
  $("#cal-next")?.addEventListener("click", () => {
    calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
    calSelectedKey = null;
    renderCalendar();
  });

  // ---------- 構文一覧 ----------
  function renderList() {
    const box = $("#pattern-list");
    const isGrit = getActiveCourse() === "grit";
    box.replaceChildren(...getActiveParts().map((part) => {
      const block = document.createElement("section");
      block.className = "part-block";
      const h = document.createElement("h2");
      h.textContent = part.name;
      block.append(h);
      for (const p of getActivePatterns().filter((x) => x.part === part.id)) {
        const ids = p.examples.map((_, i) => (isGrit ? `grit-${p.id}-${i}` : `${p.id}-${i}`));
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
          if (ex.tag) {
            const tagSpan = document.createElement("span");
            tagSpan.style.cssText = "font-size:.72rem; font-weight:700; color:var(--accent); background:color-mix(in srgb, var(--accent) 12%, transparent); padding:2px 7px; border-radius:5px; margin-right:6px; display:inline-block;";
            tagSpan.textContent = ex.tag;
            li.append(tagSpan);
          }
          const enSpan = document.createElement("span");
          enSpan.textContent = ex.en;
          li.append(enSpan);
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
    updateCourseSwitchUI();
  }

  // ---------- 弱点分析レポート ----------
  function computePatternStats() {
    const stats = [];
    const isGrit = getActiveCourse() === "grit";
    for (const p of getActivePatterns()) {
      const cardIds = p.examples.map((_, i) => (isGrit ? `grit-${p.id}-${i}` : `${p.id}-${i}`));
      let seen = 0;
      let wrong = 0;
      let good = 0;
      let mastered = 0;

      for (const cid of cardIds) {
        const cs = cardState(cid);
        seen += (cs.seen || 0);
        wrong += (cs.wrong || 0);
        good += (cs.good || 0);
        if (cs.level >= MASTERED_LEVEL) mastered++;
      }

      const customMatches = !isGrit ? (state.customCards || []).filter((c) => c.patternId === p.id) : [];
      for (const cc of customMatches) {
        const cs = cardState(cc.id);
        seen += (cs.seen || 0);
        wrong += (cs.wrong || 0);
        good += (cs.good || 0);
        if (cs.level >= MASTERED_LEVEL) mastered++;
      }

      const totalAttempts = good + wrong;
      const acc = totalAttempts > 0 ? Math.round((good / totalAttempts) * 100) : (seen > 0 ? 100 : null);
      const isWeak = wrong > 0 || (seen > 0 && acc !== null && acc < 70);
      const weakScore = wrong * 12 + (acc !== null ? (100 - acc) : 0);

      stats.push({
        pattern: p,
        seen,
        wrong,
        good,
        mastered,
        totalCards: cardIds.length + customMatches.length,
        accuracy: acc,
        isWeak,
        weakScore,
      });
    }
    return stats;
  }

  function renderReport() {
    const patternStats = computePatternStats();
    let totalAttempts = 0;
    let totalGood = 0;
    let totalWrong = 0;
    let masteredPatterns = 0;
    let weakCount = 0;

    for (const ps of patternStats) {
      totalGood += ps.good;
      totalWrong += ps.wrong;
      totalAttempts += (ps.good + ps.wrong);
      if (ps.mastered >= 2) masteredPatterns++;
      if (ps.isWeak) weakCount++;
    }

    const overallAcc = totalAttempts > 0 ? Math.round((totalGood / totalAttempts) * 100) : null;
    $("#rep-accuracy").textContent = overallAcc !== null ? `${overallAcc}%` : "--%";
    $("#rep-mastered").innerHTML = `${masteredPatterns}<small>/30</small>`;
    $("#rep-weak-count").textContent = weakCount;
    const totalAnsweredAll = Object.values(state.history || {}).reduce((a, b) => a + (b.answered || 0), 0);
    $("#rep-total-answered").textContent = totalAnsweredAll;

    // AI/コーチのアドバイス生成
    const coachEl = $("#rep-coach-text");
    const sortedWeak = [...patternStats].filter((p) => p.isWeak || p.wrong > 0).sort((a, b) => b.weakScore - a.weakScore);

    if (totalAnsweredAll < 5) {
      coachEl.innerHTML = "🌱 まだ解答データが少なめです。まずは今日の練習メニューから10〜20問解いて、あなたの英語の強み・弱点を分析しましょう！";
    } else if (sortedWeak.length === 0) {
      coachEl.innerHTML = "🌟 <strong>パーフェクトな状態です！</strong> 目立った弱点構文はなく、全構文で安定した英語発話ができています。設定から制限時間を短くして、瞬発力をさらに磨きましょう！";
    } else {
      const worst = sortedWeak[0];
      const worstPartObj = getActiveParts().find((pt) => pt.id === worst.pattern.part);
      coachEl.innerHTML = `⚠️ 現在最もミスが出やすいのは <strong>${worstPartObj ? worstPartObj.name : ''}</strong> の <strong>「${worst.pattern.en}」</strong>（ミス ${worst.wrong}回）です。<br>「${worst.pattern.note || ''}」を意識して、下の特訓ボタンからピンポイントで復習しましょう！`;
    }

    // 弱点ランキング
    const rankingBox = $("#rep-ranking-list");
    if (sortedWeak.length === 0) {
      rankingBox.innerHTML = `
        <div class="empty-state" style="padding: 24px; text-align: center; color: var(--good);">
          <p style="font-size: 1.5rem; margin-bottom: 6px;">🎉</p>
          <strong>現在要注意な苦手構文はありません！</strong>
          <p style="font-size: .85rem; color: var(--muted); margin-top: 4px;">全構文で高い正答率を維持しています。</p>
        </div>
      `;
    } else {
      const topWeak = sortedWeak.slice(0, 5);
      rankingBox.replaceChildren(...topWeak.map((ps, idx) => {
        const item = document.createElement("div");
        item.className = `ranking-item ${idx === 0 ? 'worst-1' : ''}`;
        const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-other';
        const rankText = idx < 3 ? `ワースト ${idx + 1}位` : `${idx + 1}位`;
        const accText = ps.accuracy !== null ? `正答率 ${ps.accuracy}%` : `未正解`;
        const accClass = ps.accuracy !== null && ps.accuracy >= 70 ? 'good' : (ps.accuracy !== null && ps.accuracy >= 50 ? 'moderate' : '');

        item.innerHTML = `
          <div class="ranking-item-header">
            <span class="ranking-rank-pill ${rankClass}">${rankText}</span>
            <span class="ranking-rate-badge ${accClass}">${accText}</span>
          </div>
          <h3 class="ranking-title">#${ps.pattern.id} ${ps.pattern.en}</h3>
          <p class="ranking-ja">${ps.pattern.ja}</p>
          <div class="ranking-bar"><div class="ranking-bar-fill ${accClass}" style="width: ${ps.accuracy !== null ? ps.accuracy : 0}%"></div></div>
          <div class="ranking-item-footer">
            <span class="ranking-mistake-count">✕ ミス ${ps.wrong}回 / 解答 ${ps.seen}回</span>
            <button type="button" class="btn small primary">この構文を練習</button>
          </div>
        `;
        item.querySelector("button").addEventListener("click", () => {
          startSession({ type: "pattern", pattern: ps.pattern.id });
        });
        return item;
      }));
    }

    // Part別習得状況
    const partBox = $("#rep-part-list");
    partBox.replaceChildren(...getActiveParts().map((part) => {
      const partPats = patternStats.filter((ps) => ps.pattern.part === part.id);
      let seen = 0, wrong = 0, good = 0, mastered = 0, totalCards = 0;
      for (const ps of partPats) {
        seen += ps.seen;
        wrong += ps.wrong;
        good += ps.good;
        mastered += ps.mastered;
        totalCards += ps.totalCards;
      }
      const attempts = good + wrong;
      const acc = attempts > 0 ? Math.round((good / attempts) * 100) : (seen > 0 ? 100 : null);
      const masteryRate = totalCards > 0 ? Math.round((mastered / totalCards) * 100) : 0;

      const item = document.createElement("div");
      item.className = "part-rep-item";
      item.innerHTML = `
        <div class="part-rep-head">
          <span class="part-rep-title">${part.name}</span>
          <span class="part-rep-acc">${acc !== null ? `正答率 ${acc}%` : `未着手`}</span>
        </div>
        <div class="part-rep-bar"><div class="part-rep-bar-fill" style="width: ${masteryRate}%"></div></div>
        <div class="part-rep-footer">
          <span class="part-rep-sub">習得: ${mastered}/${totalCards}問 (${masteryRate}%)</span>
          <button type="button" class="btn small ghost">練習する</button>
        </div>
      `;
      item.querySelector("button").addEventListener("click", () => {
        startSession({ type: "part", part: part.id });
      });
      return item;
    }));

    // 全30構文マトリックス
    const matrixBox = $("#rep-all-matrix");
    matrixBox.replaceChildren(...patternStats.map((ps) => {
      const item = document.createElement("div");
      item.className = "matrix-item";
      const accColor = ps.accuracy === null ? 'var(--muted)' : ps.accuracy >= 75 ? 'var(--good)' : (ps.accuracy >= 50 ? '#f59e0b' : 'var(--again)');
      item.innerHTML = `
        <div>
          <span class="matrix-pnum">#${ps.pattern.id}</span>
          <span class="matrix-acc" style="color: ${accColor}">${ps.accuracy !== null ? `${ps.accuracy}%` : '-'}</span>
        </div>
        <span class="matrix-ja">${ps.pattern.en}</span>
      `;
      item.title = `${ps.pattern.en} (${ps.pattern.ja}) - 正答率: ${ps.accuracy !== null ? ps.accuracy + '%' : '未解答'}`;
      item.addEventListener("click", () => {
        startSession({ type: "pattern", pattern: ps.pattern.id });
      });
      return item;
    }));

    // 弱点集中特訓ボタン
    const drillBtn = $("#start-weak-drill");
    if (drillBtn) {
      drillBtn.onclick = () => {
        const targetWeak = sortedWeak.length > 0 ? sortedWeak.slice(0, 5).map((p) => p.pattern.id) : [1, 2, 3];
        startSession({ type: "weak_drill", patternIds: targetWeak });
      };
    }
  }
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
        const part = getActiveParts().find((p) => p.id === mode.part);
        return { title: part ? part.name : "パート練習", queue: shuffle(CARDS.filter((c) => c.pattern.part === mode.part)) };
      }
      case "pattern": {
        const p = getActivePatterns().find((x) => x.id === mode.pattern);
        return { title: p ? `型${p.id}: ${p.en}` : "構文練習", queue: shuffle(CARDS.filter((c) => c.pattern.id === mode.pattern)) };
      }
      case "weak_drill": {
        const targetIds = new Set(mode.patternIds || []);
        let pool = CARDS.filter((c) => targetIds.has(c.pattern.id));
        if (!pool.length) pool = weakCards();
        if (!pool.length) pool = CARDS;
        const sorted = shuffle(pool).sort((a, b) => {
          const sa = cardState(a.id);
          const sb = cardState(b.id);
          return (sb.wrong - sa.wrong) || (sa.level - sb.level);
        });
        return { title: "⚡️ 弱点集中特訓", queue: sorted.slice(0, 10) };
      }
      case "rally": {
        const presets = (window.RALLY_PRESETS || []).map((r) => ({
          ...r,
          pattern: r.pattern || window.PATTERNS.find((p) => p.id === (r.mission && r.mission.targetPatternId)) || window.PATTERNS[0],
        }));
        const customs = (state.customRallies || []).map((r) => ({
          ...r,
          isRally: true,
          pattern: r.pattern || window.PATTERNS.find((p) => p.id === (r.mission && r.mission.targetPatternId)) || window.PATTERNS[0],
        }));
        const combined = [...presets, ...customs];
        const selected = shuffle(combined).slice(0, 10);
        return { title: "🥊 シチュエーション即答ラリー", queue: selected };
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

    const fc = $("#flashcard");
    if (fc) {
      fc.classList.remove("revealed");
      fc.style.transition = "none";
      fc.style.transform = "";
      fc.style.opacity = "";
      fc.classList.remove("card-enter");
      void fc.offsetWidth;
      fc.classList.add("card-enter");
      const gb = $("#swipe-badge-good");
      const ab = $("#swipe-badge-again");
      const hb = $("#swipe-badge-hard");
      if (gb) gb.style.opacity = "0";
      if (ab) ab.style.opacity = "0";
      if (hb) hb.style.opacity = "0";
    }

    $("#practice-counter").textContent = `${session.index + 1} / ${session.queue.length}`;
    const sp = $("#session-progress");
    sp.max = session.queue.length;
    sp.value = session.index;

    const normalView = $("#normal-card-view");
    const rallyView = $("#rally-card-view");
    const normalAnswerView = $("#normal-answer-view");
    const rallyAnswerView = $("#rally-answer-view");

    if (card.isRally) {
      if (fc) fc.classList.add("is-rally");
      if (normalView) normalView.hidden = true;
      if (rallyView) rallyView.hidden = false;
      if (normalAnswerView) normalAnswerView.hidden = true;
      if (rallyAnswerView) rallyAnswerView.hidden = true;

      const avatarEl = $("#rally-partner-avatar");
      const nameEl = $("#rally-partner-name");
      const contextEl = $("#rally-partner-context");
      const partnerEnEl = $("#rally-partner-en");
      const partnerJaEl = $("#rally-partner-ja");
      const promptEl = $("#rally-mission-prompt");
      const hintEl = $("#rally-mission-hint");

      if (avatarEl) avatarEl.textContent = (card.partner && card.partner.avatar) || "🧑‍💼";
      if (nameEl) nameEl.textContent = (card.partner && card.partner.name) || "Partner";
      if (contextEl) contextEl.textContent = (card.partner && card.partner.context) || (card.category || "英会話ラリー");
      if (partnerEnEl) partnerEnEl.textContent = (card.partner && card.partner.en) || "";
      if (partnerJaEl) partnerJaEl.textContent = (card.partner && card.partner.ja) || "";
      if (promptEl) promptEl.textContent = (card.mission && card.mission.prompt) || card.ja;
      if (hintEl) {
        hintEl.textContent = (card.mission && card.mission.hint) ? `💡 ${card.mission.hint}` : "";
        hintEl.hidden = !(card.mission && card.mission.hint);
      }

      // 相手のセリフ音声ボタン（高音質・自然な会話音声）
      const partnerAudioBtn = $("#rally-partner-audio-btn");
      if (partnerAudioBtn) {
        partnerAudioBtn.onclick = (e) => {
          e.stopPropagation();
          speakRallyPartner(card);
        };
      }

      // 自動再生がONなら相手の英語セリフを自然な音声で自動読み上げ
      if (s.autoSpeak && card.partner && card.partner.en) {
        speakRallyPartner(card);
      }
    } else {
      if (fc) fc.classList.remove("is-rally");
      if (normalView) normalView.hidden = false;
      if (rallyView) rallyView.hidden = true;
      if (normalAnswerView) normalAnswerView.hidden = false;
      if (rallyAnswerView) rallyAnswerView.hidden = true;

      $("#card-pattern").textContent = s.showHint
        ? (card.isCustom ? `[${card.theme || "AI"}] ${card.pattern.en}` : (card.tag ? `[${card.tag}] ${card.pattern.en}` : card.pattern.en))
        : "";
      $("#card-ja").textContent = card.ja;
      $("#card-en").textContent = card.en;
      $("#card-note").textContent = card.isCustom
        ? `✨ AIカスタム（${card.theme || "オリジナル"}）| ${card.pattern.en}：${card.pattern.ja}`
        : (card.tag ? `🎓 TED・GRIT [${card.tag}] | ${card.pattern.en}：${card.pattern.ja}` : `${card.pattern.en}：${card.pattern.ja}`);
    }

    $("#answer").hidden = true;
    $("#reveal-actions").hidden = false;
    const gc = $("#grade-container") || $("#grade-actions");
    if (gc) gc.hidden = true;
    $("#tts-source").textContent = "";
    $("#tts-source").className = "tts-badge";
    const nuanceEl = $("#card-nuance-text");
    const altsListEl = $("#card-alts-list");
    if (nuanceEl) nuanceEl.textContent = "";
    if (altsListEl) altsListEl.replaceChildren();

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

  // 💡 ネイティブニュアンス取得
  function getCardNuance(card) {
    if (!card) return "";
    if (window.PATTERN_NUANCES && card.pattern && window.PATTERN_NUANCES[card.pattern.id]) {
      return window.PATTERN_NUANCES[card.pattern.id];
    }
    if (card.pattern && card.pattern.note) {
      return card.pattern.note;
    }
    return "日常会話でネイティブが頻繁に使う自然な定型表現です。";
  }

  // 💬 自然な言い換え・別解の自動生成ルール
  function generateNaturalAlternatives(enText) {
    if (!enText) return [];
    const alts = new Set();
    const pairs = [
      [/\bI'd say\b/gi, "I would say"],
      [/\bI would say\b/gi, "I'd say"],
      [/\bI'm\b/gi, "I am"],
      [/\bI am\b/gi, "I'm"],
      [/\bit's\b/gi, "it is"],
      [/\bit is\b/gi, "it's"],
      [/\bhe's\b/gi, "he is"],
      [/\bhe is\b/gi, "he's"],
      [/\bshe's\b/gi, "she is"],
      [/\bshe is\b/gi, "she's"],
      [/\bthat's\b/gi, "that is"],
      [/\bthat is\b/gi, "that's"],
      [/\bthere's\b/gi, "there is"],
      [/\bthere is\b/gi, "there's"],
      [/\bwe're\b/gi, "we are"],
      [/\bwe are\b/gi, "we're"],
      [/\byou're\b/gi, "you are"],
      [/\byou are\b/gi, "you're"],
      [/\bthey're\b/gi, "they are"],
      [/\bthey are\b/gi, "they're"],
      [/\bdon't\b/gi, "do not"],
      [/\bdo not\b/gi, "don't"],
      [/\bdoesn't\b/gi, "does not"],
      [/\bdoes not\b/gi, "doesn't"],
      [/\bcan't\b/gi, "cannot"],
      [/\bcannot\b/gi, "can't"],
      [/\bwon't\b/gi, "will not"],
      [/\bwill not\b/gi, "won't"],
      [/\bisn't\b/gi, "is not"],
      [/\bis not\b/gi, "isn't"],
      [/\baren't\b/gi, "are not"],
      [/\bare not\b/gi, "aren't"],
      [/\baround\b/gi, "about"],
      [/\babout\b/gi, "around"],
      [/\bgonna\b/gi, "going to"],
      [/\bgoing to\b/gi, "gonna"],
      [/\bwanna\b/gi, "want to"],
      [/\bwant to\b/gi, "wanna"],
      [/\bgotta\b/gi, "got to"],
      [/\bgot to\b/gi, "gotta"],
      [/\byeah\b/gi, "yes"],
      [/\b80%\b/g, "80 percent"],
      [/\b10-minute\b/gi, "10 minute"]
    ];

    for (const [regex, expanded] of pairs) {
      if (regex.test(enText)) {
        const swapped = enText.replace(regex, (match) => {
          const isCap = match[0] === match[0].toUpperCase();
          return isCap ? (expanded[0].toUpperCase() + expanded.slice(1)) : expanded.toLowerCase();
        });
        if (swapped !== enText) alts.add(swapped);
      }
    }
    return [...alts];
  }

  function getCardAlts(card) {
    if (!card) return [];
    const list = [];
    if (window.CARD_ALTERNATIVES && window.CARD_ALTERNATIVES[card.id]) {
      list.push(...window.CARD_ALTERNATIVES[card.id]);
    }
    const auto = generateNaturalAlternatives(card.en);
    for (const a of auto) {
      if (!list.includes(a) && a.toLowerCase().trim() !== card.en.toLowerCase().trim()) {
        list.push(a);
      }
    }
    return list;
  }

  function reveal() {
    if (!session || session.revealed) return;
    session.revealed = true;
    clearTimeout(timerId);
    $("#timer-bar").classList.remove("running");
    const fc = $("#flashcard");
    if (fc) fc.classList.add("revealed");

    const card = session.queue[session.index];
    const nuance = getCardNuance(card);
    const alts = getCardAlts(card);

    const normalAnswerView = $("#normal-answer-view");
    const rallyAnswerView = $("#rally-answer-view");

    if (card.isRally) {
      if (normalAnswerView) normalAnswerView.hidden = true;
      if (rallyAnswerView) rallyAnswerView.hidden = false;

      const patternTag = $("#rally-pattern-tag");
      const userEn = $("#rally-user-en");
      const userJa = $("#rally-user-ja");
      const tipsText = $("#rally-tips-text");
      const rallyAltsBlock = $("#rally-alts-block");
      const rallyAltsList = $("#rally-alts-list");

      if (patternTag) {
        patternTag.textContent = card.pattern ? `型${card.pattern.id}: ${card.pattern.en}` : (card.mission && card.mission.targetPatternId ? `型${card.mission.targetPatternId}` : "実戦型");
      }
      if (userEn) userEn.textContent = card.en;
      if (userJa) userJa.textContent = card.ja;
      if (tipsText) tipsText.textContent = card.replyTips || "実戦で相手の意図を汲み取りながら自然に返す大人のフレーズです。";

      const rallyAlts = card.alternatives || [];
      if (rallyAltsBlock && rallyAltsList) {
        if (rallyAlts.length > 0) {
          rallyAltsBlock.hidden = false;
          rallyAltsList.replaceChildren(...rallyAlts.map((alt) => {
            const li = document.createElement("li");
            li.className = "card-alt-item";
            li.textContent = alt;
            return li;
          }));
        } else {
          rallyAltsBlock.hidden = true;
        }
      }

      const rallySpeakBtn = $("#rally-speak-btn");
      if (rallySpeakBtn) {
        rallySpeakBtn.onclick = (e) => {
          e.stopPropagation();
          speakCard(card);
        };
      }
    } else {
      if (normalAnswerView) normalAnswerView.hidden = false;
      if (rallyAnswerView) rallyAnswerView.hidden = true;

      // 💡 ネイティブニュアンス解説
      const nuanceEl = $("#card-nuance-text");
      const nuanceBlock = $("#card-nuance-block");
      if (nuanceEl && nuanceBlock) {
        nuanceEl.textContent = nuance;
        nuanceBlock.hidden = !nuance;
      }

      // 💬 自然な別解・言い換え
      const altsBlock = $("#card-alts-block");
      const altsListEl = $("#card-alts-list");
      if (altsBlock && altsListEl) {
        if (alts.length > 0) {
          altsBlock.hidden = false;
          altsListEl.replaceChildren(...alts.slice(0, 3).map((alt) => {
            const li = document.createElement("li");
            li.className = "card-alt-item";
            li.textContent = alt;
            return li;
          }));
        } else {
          altsBlock.hidden = true;
        }
      }

      if (state.settings.typingMode) {
        const input = $("#type-input");
        input.disabled = true;
        const typed = normalize(input.value);
        const answer = normalize(card.en);
        const normalizedAlts = alts.map(normalize);
        const res = $("#type-result");
        res.hidden = false;
        if (!typed) {
          res.textContent = "（未入力）";
          res.className = "type-result ng";
        } else if (typed === answer) {
          res.textContent = "✓ 完全一致！";
          res.className = "type-result ok";
        } else if (normalizedAlts.includes(typed)) {
          res.textContent = "✓ 正解！（自然な別解表現と一致）";
          res.className = "type-result ok";
        } else {
          const aw = answer.split(" ");
          const tw = new Set(typed.split(" "));
          const hit = aw.filter((w) => tw.has(w)).length;
          res.textContent = `あなたの回答: ${input.value}（一致率 ${Math.round((hit / aw.length) * 100)}%）`;
          res.className = "type-result ng";
        }
      }
    }

    $("#answer").hidden = false;
    $("#reveal-actions").hidden = true;
    const gc = $("#grade-container") || $("#grade-actions");
    if (gc) gc.hidden = false;
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
      msg = `${uiIcon("flame")} 今日の目標達成！ ${streak}日連続！`;
      $("#result-emoji").innerHTML = uiIcon("party", "icon-xl");
    } else if (met) {
      msg = `${uiIcon("flame")} ${streak}日連続キープ中`;
      $("#result-emoji").innerHTML = rate >= 80 ? uiIcon("party", "icon-xl") : uiIcon("trophy", "icon-xl");
    } else {
      msg = `今日の目標まであと${state.settings.dailyGoal - todayAnswered()}問`;
      $("#result-emoji").innerHTML = uiIcon("target", "icon-xl");
    }
    $("#result-streak").innerHTML = msg;

    const mode = session.mode;
    $("#result-again").onclick = () => startSession(mode);

    // 🏆 実績アンロック判定
    if (!state.achievements) state.achievements = {};
    if (total >= 10 && r.again === 0 && r.hard === 0) {
      state.achievements.perfect_round = { unlockedAt: new Date().toISOString() };
    }
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) {
      state.achievements.early_bird = { unlockedAt: new Date().toISOString() };
    } else if (hour >= 22 || hour < 4) {
      state.achievements.night_owl = { unlockedAt: new Date().toISOString() };
    }
    save();
    checkShieldReward();

    if (rate === 100 && total >= 10) {
      launchConfetti(2500);
    }
    checkAchievements(true);

    stopSession();
    showView("result");
  }

  // 📢 結果シェア（X / Web Share API）
  function shareResult() {
    const streak = currentStreak();
    const courseName = getActiveCourse() === "grit" ? "TED・知的思考GRIT編" : "日常・口語編";
    const summaryText = $("#result-summary")?.textContent || "今日の学習完了！";
    const text = `【瞬間パターントレーニング】\n今日の練習を完了！🔥 連続${streak}日目達成（${courseName}）\n${summaryText}\n#瞬間パターントレーニング #英語学習 #英会話`;
    const url = window.location.href.split("#")[0];

    if (navigator.share) {
      navigator.share({ title: "瞬間パターントレーニング", text, url }).catch(() => {});
    } else {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    }
  }
  $("#result-share-btn")?.addEventListener("click", shareResult);

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
  async function generateGeminiSpeech(text, apiKey, model = "gemini-3.8-flash-tts", voice = "Kore", lang = "en", accent = "us") {
    const callApi = async (targetModel) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const stylePrompt = lang === "ja"
        ? "natural, clear, polite and warm Japanese narration by a native speaker with authentic standard Tokyo intonation"
        : (ACCENT_STYLE_PROMPTS[accent] || ACCENT_STYLE_PROMPTS.us);

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
                    style: stylePrompt
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
    };

    try {
      return await callApi(model);
    } catch (err) {
      // 1日あたりのモデル上限（limit: 100/day）に達した場合、別モデル（flash-lite-tts）の枠へ自動フォールバック！
      if (model === "gemini-3.8-flash-tts" && (err.message.includes("per_model_per_day") || err.message.includes("limit: 100") || err.message.includes("quota") || err.message.includes("429"))) {
        console.warn("gemini-3.8-flash-tts quota exhausted, auto-trying gemini-3.8-flash-lite-tts...");
        return await callApi("gemini-3.8-flash-lite-tts");
      }
      throw err;
    }
  }

  // ---------- 音声再生エンジン ----------
  let currentAudio = null;
  let browserVoice = null;
  let browserJaVoice = null;

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  async function playBlob(blob, rate = null) {
    stopAudio();
    if (!blob) return false;
    try {
      const safeBlob = (blob instanceof Blob && blob.type) ? blob : new Blob([blob], { type: "audio/wav" });
      const url = URL.createObjectURL(safeBlob);
      const audio = new Audio();
      currentAudio = audio;
      audio.src = url;
      const speed = Number(rate != null ? rate : state.settings.speechRate) || 1.15;
      audio.playbackRate = speed;
      audio.defaultPlaybackRate = speed;
      audio.onplay = () => { audio.playbackRate = speed; };
      audio.load();
      audio.playbackRate = speed;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (currentAudio === audio) currentAudio = null;
      };
      audio.onerror = (e) => {
        console.warn("playBlob audio error:", e, audio.error);
        URL.revokeObjectURL(url);
        if (currentAudio === audio) currentAudio = null;
      };
      await audio.play();
      return true;
    } catch (err) {
      console.warn("playBlob play() rejected:", err);
      return false;
    }
  }

  function pickBrowserVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices();
    const enVoices = voices.filter((v) => v.lang.startsWith("en"));
    // 自然で高音質なEnhanced/Natural/Siri音声を最優先
    const preferEn = [
      "Ava (Enhanced)", "Ava (Premium)", "Samantha (Enhanced)", "Samantha (Premium)",
      "Siri", "Allison (Enhanced)", "Zoe (Enhanced)", "Tom (Enhanced)",
      "Microsoft Jenny Online (Natural)", "Microsoft Aria Online (Natural)", "Microsoft Guy Online (Natural)",
      "Google US English", "Karen", "Daniel", "Samantha", "Alex"
    ];
    browserVoice = preferEn.map((n) => enVoices.find((v) => v.name.includes(n))).find(Boolean)
      || enVoices.find((v) => v.lang === "en-US") || enVoices[0] || null;

    const jaVoices = voices.filter((v) => v.lang.startsWith("ja"));
    const preferJa = ["Kyoko (Enhanced)", "Otoya (Enhanced)", "Microsoft Nanami Online (Natural)", "Google 日本語", "Kyoko", "Otoya"];
    browserJaVoice = preferJa.map((n) => jaVoices.find((v) => v.name.includes(n))).find(Boolean)
      || jaVoices.find((v) => v.lang.startsWith("ja")) || null;
  }
  if ("speechSynthesis" in window) {
    pickBrowserVoice();
    speechSynthesis.addEventListener?.("voiceschanged", pickBrowserVoice);
  }

  function speakBrowser(text, rate = null) {
    if (!("speechSynthesis" in window)) return;
    stopAudio();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (browserVoice) u.voice = browserVoice;
    u.rate = Number(rate != null ? rate : state.settings.speechRate) || 1.15;
    speechSynthesis.speak(u);
  }

  // 🥊 ラリー会話相手のセリフ専用再生（自然な人間速度・Gemini TTSまたは高品質ブラウザ音声）
  async function speakRallyPartner(card) {
    if (!card || !card.partner || !card.partner.en) return;
    const text = card.partner.en;
    const s = state.settings;

    // 1. Gemini APIキーがある場合は、Gemini 3.8 Flash TTS（人間そのままのスタジオ生声）で再生
    if (s.geminiApiKey) {
      try {
        const cacheKey = `rally_partner_${card.id || text.slice(0, 24)}`;
        let cached = await getCachedAudio(cacheKey);
        if (!cached) {
          const femaleNames = ["Chloe", "Sophia", "Emma", "Rachel", "Jessica", "Hannah", "Lisa", "Sarah", "Grace", "Mia"];
          const isFemale = femaleNames.some((n) => (card.partner.name || "").includes(n));
          const voice = isFemale ? "Kore" : "Fenrir";
          cached = await generateGeminiSpeech(text, s.geminiApiKey, "gemini-3.8-flash-tts", voice, "en", "us");
          await setCachedAudio(cacheKey, cached);
        }
        if (cached) {
          playBlob(cached);
          return;
        }
      } catch (err) {
        console.warn("Rally partner Gemini TTS fallback:", err);
      }
    }

    // 2. ブラウザ標準音声（最高音質ボイス・人間らしい等速 1.0 でクリアに再生）
    if ("speechSynthesis" in window) {
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      if (browserVoice) u.voice = browserVoice;
      u.rate = 1.0; // 人間らしく等速でクリアに発音
      u.pitch = 1.0;
      speechSynthesis.speak(u);
    }
  }

  async function speakJapanesePromise(cardOrText, rate = 1.0) {
    let card = null;
    let text = "";
    if (typeof cardOrText === "object" && cardOrText !== null) {
      card = cardOrText;
      text = card.ja;
    } else {
      text = String(cardOrText || "");
      card = ALL_CARDS.find((c) => c.ja === text) || null;
    }

    const s = state.settings;
    const badge = $("#listening-ja-source");
    const cardId = card ? card.id : null;
    const audioKey = card ? (card.audioId || getCustomAudioId(card) || card.id) : null;

    // 1. Gemini TTS（IndexedDBキャッシュを最優先再生。APIキー未入力でもオフラインでも再生可能）
    if (s.ttsEngine !== "browser") {
      let cachedItem = null;
      if (cardId) {
        cachedItem = await findCachedAudio(cardId, true, s.geminiModel, s.geminiVoice);
      }
      if (!cachedItem && text) {
        const textKey = `ja_${text}_${s.geminiModel}_${s.geminiVoice}`;
        const blob = await getCachedAudio(textKey);
        if (blob) cachedItem = { blob, key: textKey };
      }

      if (cachedItem && cachedItem.blob) {
        const voiceLabel = cachedItem.key.split("_").pop() || s.geminiVoice || "Gemini 3.8";
        if (badge) badge.textContent = `✨ Gemini 3.8 日本語 (${voiceLabel})`;
        const ok = await playBlobPromise(cachedItem.blob, rate);
        if (ok) return true;
      }

      // キャッシュ未生成でGemini APIキーがある場合は生成
      if (s.geminiApiKey) {
        try {
          if (badge) badge.textContent = "✨ Gemini 3.8 生成中...";
          const blob = await generateGeminiSpeech(text, s.geminiApiKey, s.geminiModel, s.geminiVoice, "ja");
          const cacheKey = `ja_${cardId || text}_${s.geminiModel}_${s.geminiVoice}`;
          await setCachedAudio(cacheKey, blob);
          if (badge) badge.textContent = `✨ Gemini 3.8 日本語 (${s.geminiVoice})`;
          const ok = await playBlobPromise(blob, rate);
          if (ok) return true;
        } catch (e) {
          console.warn("Gemini Ja TTS fallback to bundled audio:", e);
        }
      }
    }

    // 2. 同梱のローカル高音質日本語音声（Nanami）
    if (audioKey) {
      if (badge) badge.textContent = "✨ 自然な日本語音声（同梱）";
      const ok = await playAudioUrlPromise(`audio/${audioKey}_ja.mp3`, rate);
      if (ok) return true;
    }

    // 3. ブラウザ音声フォールバック
    if (badge) badge.textContent = "ブラウザ音声";
    return speakJapaneseBrowserPromise(text, rate);
  }

  function speakJapaneseBrowserPromise(text, rate = 1.0) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) { resolve(); return; }
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      if (browserJaVoice) u.voice = browserJaVoice;
      u.rate = rate;
      let finished = false;
      const safety = setTimeout(() => {
        if (!finished) { finished = true; resolve(); }
      }, Math.max(3000, text.length * 400));

      u.onend = () => {
        if (!finished) { finished = true; clearTimeout(safety); resolve(); }
      };
      u.onerror = () => {
        if (!finished) { finished = true; clearTimeout(safety); resolve(); }
      };
      speechSynthesis.speak(u);
    });
  }

  function playAudioUrlPromise(url, rate = null) {
    return new Promise((resolve) => {
      stopAudio();
      const audio = new Audio(url);
      currentAudio = audio;
      const speed = Number(rate != null ? rate : state.settings.speechRate) || 1.15;
      audio.playbackRate = speed;
      audio.defaultPlaybackRate = speed;
      audio.onplay = () => { audio.playbackRate = speed; };
      let finished = false;
      const done = (result) => {
        if (!finished) {
          finished = true;
          if (currentAudio === audio) currentAudio = null;
          resolve(result);
        }
      };
      audio.onended = () => done(true);
      audio.onerror = () => done(false);
      audio.play().catch(() => done(false));
    });
  }

  function playBlobPromise(blob, rate = null) {
    return new Promise((resolve) => {
      stopAudio();
      if (!blob) { resolve(false); return; }
      try {
        const safeBlob = (blob instanceof Blob && blob.type) ? blob : new Blob([blob], { type: "audio/wav" });
        const url = URL.createObjectURL(safeBlob);
        const audio = new Audio();
        currentAudio = audio;
        audio.src = url;
        const speed = Number(rate != null ? rate : state.settings.speechRate) || 1.15;
        audio.playbackRate = speed;
        audio.defaultPlaybackRate = speed;
        audio.onplay = () => { audio.playbackRate = speed; };
        let finished = false;
        const done = (result) => {
          if (!finished) {
            finished = true;
            URL.revokeObjectURL(url);
            if (currentAudio === audio) currentAudio = null;
            resolve(result);
          }
        };
        audio.onended = () => done(true);
        audio.onerror = (e) => {
          console.warn("playBlobPromise audio error:", e, audio.error);
          done(false);
        };
        audio.load();
        audio.playbackRate = speed;
        audio.play().catch((err) => {
          console.warn("playBlobPromise audio.play() catch:", err);
          done(false);
        });
      } catch (e) {
        console.warn("playBlobPromise exception:", e);
        resolve(false);
      }
    });
  }

  function speakBrowserPromise(text, rate = null) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) { resolve(); return; }
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      if (browserVoice) u.voice = browserVoice;
      u.rate = Number(rate != null ? rate : state.settings.speechRate) || 1.15;
      let finished = false;
      const safety = setTimeout(() => {
        if (!finished) { finished = true; resolve(); }
      }, Math.max(3000, text.length * 400));

      u.onend = () => {
        if (!finished) { finished = true; clearTimeout(safety); resolve(); }
      };
      u.onerror = () => {
        if (!finished) { finished = true; clearTimeout(safety); resolve(); }
      };
      speechSynthesis.speak(u);
    });
  }

  async function playEnglishCardPromise(card, rate = 1) {
    const s = state.settings;
    const badge = $("#listening-tts-source");
    const audioKey = card.audioId || getCustomAudioId(card) || card.id;

    // 1. Gemini 音声（IndexedDBキャッシュを最優先再生。APIキー未入力でもオフラインでも再生可能）
    if (s.ttsEngine !== "browser") {
      const effectiveAccent = getEffectiveAccent(card, s.geminiAccent || "us");
      const accentInfo = ACCENT_LABELS[effectiveAccent] || ACCENT_LABELS.us;
      const cachedItem = await findCachedAudio(card.id, false, s.geminiModel, s.geminiVoice, effectiveAccent);
      if (cachedItem && cachedItem.blob) {
        const parts = cachedItem.key.split("_");
        const voiceLabel = parts[2] || s.geminiVoice || "Gemini 3.8";
        if (badge) badge.textContent = `✨ Gemini 3.8 (${voiceLabel}・${accentInfo.flag} ${accentInfo.name})`;
        const ok = await playBlobPromise(cachedItem.blob, rate);
        if (ok) return;
      }

      // キャッシュ未生成でAPIキーがある場合は生成
      if (s.geminiApiKey) {
        try {
          if (badge) badge.textContent = `✨ Gemini 3.8 (${accentInfo.flag} ${accentInfo.name}生成中...)`;
          const blob = await generateGeminiSpeech(card.en, s.geminiApiKey, s.geminiModel, s.geminiVoice, "en", effectiveAccent);
          const cacheKey = `${card.id}_${s.geminiModel}_${s.geminiVoice}_${effectiveAccent}`;
          await setCachedAudio(cacheKey, blob);
          if (badge) badge.textContent = `✨ Gemini 3.8 (${s.geminiVoice}・${accentInfo.flag} ${accentInfo.name})`;
          const ok = await playBlobPromise(blob, rate);
          if (ok) return;
        } catch (err) {
          console.warn("Gemini English TTS error, fallback to bundled audio:", err);
          const msg = String(err.message || err);
          const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("ResourceExhausted");
          if (badge) badge.textContent = `⚠️ ${isQuota ? "API制限(429)" : "Geminiエラー"} → 同梱音声`;
        }
      }
    }

    // 2. 同梱のリアル口語ネイティブ音声（Brian）
    const isBundled = (audioKey && !audioKey.startsWith("c_")) || card.audioId;
    if (isBundled) {
      if (badge && !badge.textContent.startsWith("⚠️")) {
        badge.textContent = "✨ リアル口語ネイティブ（崩し・同梱）";
      }
      const ok = await playAudioUrlPromise(`audio/${audioKey}.mp3`, rate);
      if (ok) return;
    }

    // 3. ブラウザ標準音声
    if (badge && !badge.textContent.startsWith("⚠️")) badge.textContent = "ブラウザ音声";
    await speakBrowserPromise(card.en, rate);
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

  function tryPlayLocalAudio(cardId, rate = null) {
    return new Promise((resolve) => {
      stopAudio();
      const audio = new Audio(`audio/${cardId}.mp3`);
      const speed = Number(rate != null ? rate : state.settings.speechRate) || 1.15;
      audio.playbackRate = speed;
      audio.defaultPlaybackRate = speed;
      let done = false;
      audio.onplay = () => {
        audio.playbackRate = speed;
        if (!done) { done = true; currentAudio = audio; resolve(true); }
      };
      audio.onerror = () => {
        if (!done) { done = true; resolve(false); }
      };
      audio.play().then(() => {
        audio.playbackRate = speed;
        if (!done) { done = true; currentAudio = audio; resolve(true); }
      }).catch(() => {
        if (!done) { done = true; resolve(false); }
      });
    });
  }

  let lastTtsError = "";
  $("#tts-source")?.addEventListener("click", () => {
    if (lastTtsError) {
      alert(`【Gemini API エラー詳細】\n${lastTtsError}\n\n💡 解決のヒント:\n① 「請求階層: Tier 1・前払い」の場合、古いAPIキーが無料枠のまま固定されるGoogleの仕様があります。AI Studioでキーを一度新規作成して差し替えてみてください。\n② 前払いクレジット残高が残っているかご確認ください。`);
    }
  });
  $("#listening-tts-source")?.addEventListener("click", () => {
    if (lastTtsError) {
      alert(`【Gemini API エラー詳細】\n${lastTtsError}\n\n💡 解決のヒント:\n① 「請求階層: Tier 1・前払い」の場合、古いAPIキーが無料枠のまま固定されるGoogleの仕様があります。AI Studioでキーを一度新規作成して差し替えてみてください。\n② 前払いクレジット残高が残っているかご確認ください。`);
    }
  });

  // カード専用の再生（キャッシュ → Gemini API → ローカル同梱音声 → ブラウザ音声）
  async function speakCard(card) {
    const s = state.settings;
    const rate = Number(s.speechRate) || 1.15;
    const badge = $("#tts-source");

    // 1. ブラウザ標準設定の場合
    if (s.ttsEngine === "browser") {
      badge.textContent = "ブラウザ標準";
      badge.className = "tts-badge fallback";
      speakBrowser(card.en, rate);
      return;
    }

    const effectiveAccent = getEffectiveAccent(card, s.geminiAccent || "us");
    const accentInfo = ACCENT_LABELS[effectiveAccent] || ACCENT_LABELS.us;

    // 2. まず IndexedDB に保存された Gemini キャッシュ音声があるか確認（APIキー未入力・オフラインでも再生可能！）
    const cachedItem = await findCachedAudio(card.id, false, s.geminiModel, s.geminiVoice, effectiveAccent);
    if (cachedItem && cachedItem.blob) {
      const parts = cachedItem.key.split("_");
      const voiceLabel = parts[2] || s.geminiVoice || "Gemini 3.8";
      badge.textContent = `✨ Gemini 3.8 (${voiceLabel}・${accentInfo.flag} ${accentInfo.name})`;
      badge.className = "tts-badge";
      badge.style.cursor = "default";
      const played = await playBlob(cachedItem.blob, rate);
      if (played) return;
    }

    // 3. キャッシュがなく、Gemini APIキーが設定されている場合はリアルタイム生成
    let geminiFailReason = null;
    if (s.ttsEngine !== "browser" && s.geminiApiKey) {
      badge.textContent = `✨ Gemini 3.8 (${accentInfo.flag} ${accentInfo.name}生成中...)`;
      badge.className = "tts-badge loading";
      badge.style.cursor = "default";

      try {
        const blob = await generateGeminiSpeech(card.en, s.geminiApiKey, s.geminiModel, s.geminiVoice, "en", effectiveAccent);
        const cacheKey = `${card.id}_${s.geminiModel}_${s.geminiVoice}_${effectiveAccent}`;
        await setCachedAudio(cacheKey, blob);
        badge.textContent = `✨ Gemini 3.8 (${s.geminiVoice}・${accentInfo.flag} ${accentInfo.name})`;
        badge.className = "tts-badge";
        badge.style.cursor = "default";
        lastTtsError = "";
        const played = await playBlob(blob, rate);
        if (played) return;
      } catch (err) {
        console.warn("Gemini TTS エラー, 同梱音声へフォールバック:", err);
        const msg = String(err.message || err);
        lastTtsError = msg;
        if (msg.includes("per_model_per_day") || msg.includes("limit: 100")) {
          geminiFailReason = "本日の上限(100件/日)到達";
        } else if (msg.includes("free_tier_requests") || msg.includes("limit: 10")) {
          geminiFailReason = "無料枠扱い(キー再作成で解消)";
        } else if (msg.includes("429") || msg.includes("quota") || msg.includes("ResourceExhausted")) {
          geminiFailReason = "API制限/残高(429)";
        } else {
          geminiFailReason = "APIエラー";
        }
      }
    } else if (s.ttsEngine === "gemini" && !s.geminiApiKey) {
      geminiFailReason = "APIキー未設定";
    }

    // 4. 同梱のローカル高音質MP3（オフライン・0円・フォールバック）
    const audioKey = card.audioId || getCustomAudioId(card) || card.id;
    const isBundled = (audioKey && !audioKey.startsWith("c_")) || card.audioId;

    if (isBundled) {
      const playedLocal = await tryPlayLocalAudio(audioKey, rate);
      if (playedLocal) {
        if (geminiFailReason) {
          badge.textContent = `⚠️ ${geminiFailReason} → 同梱音声 (タップで詳細)`;
          badge.className = "tts-badge fallback";
          badge.title = lastTtsError || geminiFailReason;
          badge.style.cursor = "pointer";
        } else {
          badge.textContent = "✨ リアル口語ネイティブ（崩し・同梱）";
          badge.className = "tts-badge";
          badge.style.cursor = "default";
        }
        return;
      }
    }

    // 5. ブラウザ音声に最終フォールバック
    if (geminiFailReason) {
      badge.textContent = `⚠️ ${geminiFailReason} → ブラウザ音声 (タップで詳細)`;
      badge.title = lastTtsError || geminiFailReason;
      badge.style.cursor = "pointer";
    } else {
      badge.textContent = "ブラウザ標準";
      badge.style.cursor = "default";
    }
    badge.className = "tts-badge fallback";
    speakBrowser(card.en, rate);
  }

  // ---------- 実績・バッジシステム ----------
  const BADGES = [
    // 継続・ストリーク
    {
      id: "streak_1",
      tier: "bronze",
      icon: "🌱",
      name: "第一歩",
      desc: "初めて今日の学習目標を達成する",
      check: (ctx) => ctx.currentStreak >= 1 || ctx.bestStreak >= 1 || ctx.metToday,
      progress: (ctx) => ({ current: Math.min((ctx.currentStreak || (ctx.metToday ? 1 : 0)), 1), target: 1, text: `${Math.min((ctx.currentStreak || (ctx.metToday ? 1 : 0)), 1)} / 1日` })
    },
    {
      id: "streak_3",
      tier: "silver",
      icon: "🔥",
      name: "三日坊主卒業",
      desc: "3日間連続で学習目標を達成する",
      check: (ctx) => ctx.currentStreak >= 3 || ctx.bestStreak >= 3,
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.currentStreak, ctx.bestStreak), 3), target: 3, text: `${Math.min(Math.max(ctx.currentStreak, ctx.bestStreak), 3)} / 3日` })
    },
    {
      id: "streak_7",
      tier: "gold",
      icon: "⚡",
      name: "習慣化マスター",
      desc: "7日間連続で学習を継続する（1週間達成！）",
      check: (ctx) => ctx.currentStreak >= 7 || ctx.bestStreak >= 7,
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.currentStreak, ctx.bestStreak), 7), target: 7, text: `${Math.min(Math.max(ctx.currentStreak, ctx.bestStreak), 7)} / 7日` })
    },
    {
      id: "streak_30",
      tier: "diamond",
      icon: "👑",
      name: "鉄の意志",
      desc: "30日間連続で学習を継続する（1ヶ月達成！）",
      check: (ctx) => ctx.currentStreak >= 30 || ctx.bestStreak >= 30,
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.currentStreak, ctx.bestStreak), 30), target: 30, text: `${Math.min(Math.max(ctx.currentStreak, ctx.bestStreak), 30)} / 30日` })
    },

    // 練習量
    {
      id: "count_10",
      tier: "bronze",
      icon: "🎯",
      name: "ウォーミングアップ",
      desc: "累計10問の瞬間パターントレーニングを解答する",
      check: (ctx) => ctx.totalAnswered >= 10,
      progress: (ctx) => ({ current: Math.min(ctx.totalAnswered, 10), target: 10, text: `${Math.min(ctx.totalAnswered, 10)} / 10問` })
    },
    {
      id: "count_50",
      tier: "silver",
      icon: "🏃‍♂️",
      name: "実践ランナー",
      desc: "累計50問の瞬間パターントレーニングを解答する",
      check: (ctx) => ctx.totalAnswered >= 50,
      progress: (ctx) => ({ current: Math.min(ctx.totalAnswered, 50), target: 50, text: `${Math.min(ctx.totalAnswered, 50)} / 50問` })
    },
    {
      id: "count_100",
      tier: "gold",
      icon: "⚔️",
      name: "百問錬磨",
      desc: "累計100問の瞬間パターントレーニングを解答する",
      check: (ctx) => ctx.totalAnswered >= 100,
      progress: (ctx) => ({ current: Math.min(ctx.totalAnswered, 100), target: 100, text: `${Math.min(ctx.totalAnswered, 100)} / 100問` })
    },
    {
      id: "count_300",
      tier: "diamond",
      icon: "🏆",
      name: "パターントレーニングマスター",
      desc: "累計300問の瞬間パターントレーニングを解答する",
      check: (ctx) => ctx.totalAnswered >= 300,
      progress: (ctx) => ({ current: Math.min(ctx.totalAnswered, 300), target: 300, text: `${Math.min(ctx.totalAnswered, 300)} / 300問` })
    },

    // 習得度・定着
    {
      id: "master_1",
      tier: "bronze",
      icon: "💡",
      name: "ひらめき",
      desc: "初めて1つの例文をマスター（Level 3到達）する",
      check: (ctx) => ctx.masteredCount >= 1,
      progress: (ctx) => ({ current: Math.min(ctx.masteredCount, 1), target: 1, text: `${Math.min(ctx.masteredCount, 1)} / 1問` })
    },
    {
      id: "master_10",
      tier: "silver",
      icon: "🌟",
      name: "フレーズ名人",
      desc: "10個の例文をマスター（Level 3到達）する",
      check: (ctx) => ctx.masteredCount >= 10,
      progress: (ctx) => ({ current: Math.min(ctx.masteredCount, 10), target: 10, text: `${Math.min(ctx.masteredCount, 10)} / 10問` })
    },
    {
      id: "master_30",
      tier: "gold",
      icon: "💎",
      name: "30構文コンプリート",
      desc: "30個の例文をマスターする",
      check: (ctx) => ctx.masteredCount >= 30,
      progress: (ctx) => ({ current: Math.min(ctx.masteredCount, 30), target: 30, text: `${Math.min(ctx.masteredCount, 30)} / 30問` })
    },
    {
      id: "all_master",
      tier: "diamond",
      icon: "🌌",
      name: "全問制覇",
      desc: "全120問の例文をマスターする",
      check: (ctx) => ctx.masteredCount >= 120,
      progress: (ctx) => ({ current: Math.min(ctx.masteredCount, 120), target: 120, text: `${Math.min(ctx.masteredCount, 120)} / 120問` })
    },

    // 特殊・チャレンジ
    {
      id: "ai_creator",
      tier: "silver",
      icon: "🤖",
      name: "AIクリエイター",
      desc: "自分専用のAI例文を生成してアプリに追加する",
      check: (ctx) => ctx.customCount >= 1,
      progress: (ctx) => ({ current: Math.min(ctx.customCount, 1), target: 1, text: `${Math.min(ctx.customCount, 1)} / 1問` })
    },
    {
      id: "perfect_round",
      tier: "gold",
      icon: "🎯",
      name: "パーフェクト",
      desc: "1セッション（10問以上）で全問「言えた（◯）」を達成する",
      check: (ctx) => !!ctx.hadPerfectRound,
      progress: (ctx) => ({ current: ctx.hadPerfectRound ? 1 : 0, target: 1, text: ctx.hadPerfectRound ? "達成済" : "未達成" })
    },
    {
      id: "early_bird",
      tier: "silver",
      icon: "🌅",
      name: "朝活イングリッシュ",
      desc: "朝（早朝5時〜9時）に学習セッションを完了する",
      check: (ctx) => !!ctx.hadEarlyBird,
      progress: (ctx) => ({ current: ctx.hadEarlyBird ? 1 : 0, target: 1, text: ctx.hadEarlyBird ? "達成済" : "未達成" })
    },
    {
      id: "night_owl",
      tier: "silver",
      icon: "🌙",
      name: "夜更かしの特訓",
      desc: "夜遅く（22時〜翌4時）に学習セッションを完了する",
      check: (ctx) => !!ctx.hadNightOwl,
      progress: (ctx) => ({ current: ctx.hadNightOwl ? 1 : 0, target: 1, text: ctx.hadNightOwl ? "達成済" : "未達成" })
    },
    {
      id: "ear_listener",
      tier: "bronze",
      icon: "🎧",
      name: "耳トレデビュー",
      desc: "ハンズフリー聞き流しモードで累計10問を耳トレする",
      check: (ctx) => (ctx.listeningCount || 0) >= 10,
      progress: (ctx) => ({ current: Math.min(ctx.listeningCount || 0, 10), target: 10, text: `${Math.min(ctx.listeningCount || 0, 10)} / 10問` })
    },
    {
      id: "ear_master",
      tier: "gold",
      icon: "📻",
      name: "リスニングの鬼",
      desc: "ハンズフリー聞き流しモードで累計50問を耳トレする",
      check: (ctx) => (ctx.listeningCount || 0) >= 50,
      progress: (ctx) => ({ current: Math.min(ctx.listeningCount || 0, 50), target: 50, text: `${Math.min(ctx.listeningCount || 0, 50)} / 50問` })
    }
  ];

  function launchConfetti(durationMs = 3000) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = $("#confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#f97316", "#eab308"];
    const pieces = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: width * (0.15 + Math.random() * 0.7),
        y: height * 0.35 + (Math.random() * 60 - 30),
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.35 ? "rect" : "circle"
      });
    }

    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let alive = 0;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rotation += p.rSpeed;

        if (elapsed > durationMs - 1000) {
          p.opacity = Math.max(0, (durationMs - elapsed) / 1000);
        }

        if (p.y < height && p.opacity > 0) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive > 0 && elapsed < durationMs) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    requestAnimationFrame(frame);
  }

  const achievementQueue = [];
  let isShowingAchievement = false;

  function getAchievementContext() {
    let total = 0;
    for (const d of Object.values(state.history || {})) total += (d.answered || 0);

    const mastered = CARDS.filter((c) => cardState(c.id).level >= MASTERED_LEVEL).length;
    const now = new Date();
    const hour = now.getHours();

    return {
      currentStreak: currentStreak(),
      bestStreak: bestStreak(),
      metToday: dayMet(todayKey()),
      totalAnswered: total,
      masteredCount: mastered,
      customCount: (state.customCards || []).length,
      hour: hour,
      listeningCount: state.listeningCount || 0,
      hadEarlyBird: state.achievements?.early_bird || false,
      hadNightOwl: state.achievements?.night_owl || false,
      hadPerfectRound: state.achievements?.perfect_round || false,
    };
  }

  function checkAchievements(notify = true) {
    if (!state.achievements) state.achievements = {};
    const ctx = getAchievementContext();
    const newlyUnlocked = [];

    for (const b of BADGES) {
      if (!state.achievements[b.id]) {
        if (b.check(ctx)) {
          state.achievements[b.id] = { unlockedAt: new Date().toISOString() };
          newlyUnlocked.push(b);
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      save();
      renderBadgeGrid();
      if (notify) {
        achievementQueue.push(...newlyUnlocked);
        showNextAchievementModal();
      }
    }
  }

  function showNextAchievementModal() {
    if (isShowingAchievement || achievementQueue.length === 0) return;
    isShowingAchievement = true;

    const b = achievementQueue.shift();
    const modal = $("#achievement-dialog");
    $("#ach-icon").innerHTML = renderBadgeIcon(b.icon, "icon-xl");
    $("#ach-title").textContent = b.name;
    $("#ach-desc").textContent = b.desc;

    if (navigator.vibrate) {
      try { navigator.vibrate([100, 50, 100]); } catch {}
    }

    launchConfetti(3500);
    modal.showModal();

    $("#ach-close-btn").onclick = () => {
      modal.close();
      isShowingAchievement = false;
      if (achievementQueue.length > 0) {
        setTimeout(showNextAchievementModal, 300);
      }
    };
  }

  function renderBadgeGrid() {
    const grid = $("#badge-grid");
    if (!grid) return;
    const unlockedCount = Object.keys(state.achievements || {}).length;
    $("#badge-unlocked-summary").textContent = `${unlockedCount} / ${BADGES.length} 獲得`;

    grid.replaceChildren(...BADGES.map((b) => {
      const isUnlocked = !!(state.achievements && state.achievements[b.id]);
      const item = document.createElement("div");
      item.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'} tier-${b.tier}`;
      item.innerHTML = `
        <div class="badge-icon-box">${renderBadgeIcon(b.icon)}</div>
        <span class="badge-name">${b.name}</span>
      `;
      item.addEventListener("click", () => openBadgeDetailModal(b));
      return item;
    }));
  }

  function openBadgeDetailModal(b) {
    const dialog = $("#badge-detail-dialog");
    const isUnlocked = !!(state.achievements && state.achievements[b.id]);
    const ctx = getAchievementContext();
    const prog = b.progress(ctx);

    $("#badge-detail-icon").innerHTML = renderBadgeIcon(b.icon, "icon-lg");
    const tierTag = $("#badge-detail-tier");
    tierTag.textContent = b.tier.toUpperCase();
    tierTag.className = `badge-tier-tag tier-${b.tier}`;

    $("#badge-detail-name").textContent = b.name;
    $("#badge-detail-desc").textContent = b.desc;
    $("#badge-detail-progress-text").textContent = prog.text;

    const fill = $("#badge-detail-fill");
    const pct = Math.min(100, Math.round((prog.current / prog.target) * 100));
    fill.style.width = `${pct}%`;
    fill.classList.toggle("complete", isUnlocked || pct >= 100);

    const statusEl = $("#badge-detail-status");
    if (isUnlocked) {
      const dateStr = new Date(state.achievements[b.id].unlockedAt).toLocaleDateString("ja-JP");
      statusEl.textContent = `✓ 獲得済み (${dateStr})`;
      statusEl.className = "badge-detail-status unlocked";
    } else {
      statusEl.textContent = `未達成 🔒（達成度: ${pct}%）`;
      statusEl.className = "badge-detail-status";
    }

    dialog.showModal();
    $("#close-badge-detail").onclick = () => dialog.close();
  }

  // ---------- スワイプ操作（Tinder / Anki風 カードめくり＆採点） ----------
  function initSwipeCard() {
    const card = $("#flashcard");
    if (!card) return;

    const goodBadge = $("#swipe-badge-good");
    const againBadge = $("#swipe-badge-again");
    const hardBadge = $("#swipe-badge-hard");

    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let hasMoved = false;
    let buzzedThreshold = null;

    function resetBadges() {
      if (goodBadge) goodBadge.style.opacity = "0";
      if (againBadge) againBadge.style.opacity = "0";
      if (hardBadge) hardBadge.style.opacity = "0";
    }

    function resetCardPosition(animate = true) {
      resetBadges();
      if (!animate) {
        card.style.transition = "none";
        card.style.transform = "";
        card.style.opacity = "";
        return;
      }
      card.style.transition = "transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.2s ease";
      card.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
      card.style.opacity = "1";
    }

    card.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, input, textarea, a, kbd, label")) return;
      if (!session) return;

      isPointerDown = true;
      hasMoved = false;
      buzzedThreshold = null;
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();

      try { card.setPointerCapture(e.pointerId); } catch {}
      card.style.touchAction = "none";
      card.style.transition = "none";
      card.classList.remove("card-enter");
    });

    card.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        hasMoved = true;
        card.classList.add("swiping");
      }

      if (session && session.revealed) {
        const rot = Math.min(Math.max(dx * 0.07, -16), 16);
        card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`;

        if (dx > 15 && Math.abs(dx) >= Math.abs(dy) * 0.7) {
          const progress = Math.min(1, (dx - 15) / 60);
          if (goodBadge) goodBadge.style.opacity = String(progress);
          if (againBadge) againBadge.style.opacity = "0";
          if (hardBadge) hardBadge.style.opacity = "0";
          if (progress >= 1 && buzzedThreshold !== "good") {
            buzzedThreshold = "good";
            triggerHaptic("light");
          }
        } else if (dx < -15 && Math.abs(dx) >= Math.abs(dy) * 0.7) {
          const progress = Math.min(1, (-dx - 15) / 60);
          if (againBadge) againBadge.style.opacity = String(progress);
          if (goodBadge) goodBadge.style.opacity = "0";
          if (hardBadge) hardBadge.style.opacity = "0";
          if (progress >= 1 && buzzedThreshold !== "again") {
            buzzedThreshold = "again";
            triggerHaptic("light");
          }
        } else if (dy < -20 && Math.abs(dy) > Math.abs(dx)) {
          const progress = Math.min(1, (-dy - 20) / 55);
          if (hardBadge) hardBadge.style.opacity = String(progress);
          if (goodBadge) goodBadge.style.opacity = "0";
          if (againBadge) againBadge.style.opacity = "0";
          if (progress >= 1 && buzzedThreshold !== "hard") {
            buzzedThreshold = "hard";
            triggerHaptic("light");
          }
        } else {
          resetBadges();
          buzzedThreshold = null;
        }
      } else {
        card.style.transform = `translate3d(${dx * 0.22}px, ${dy * 0.22}px, 0) rotate(${dx * 0.02}deg)`;
      }
    });

    const handlePointerEnd = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      card.classList.remove("swiping");
      card.style.touchAction = "pan-y";
      try { card.releasePointerCapture(e.pointerId); } catch {}

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dt = Date.now() - startTime;
      const dist = Math.hypot(dx, dy);

      if (!hasMoved || (dist < 10 && dt < 350)) {
        if (!session.revealed) {
          triggerHaptic("light");
          reveal();
        }
        resetCardPosition(true);
        return;
      }

      if (!session.revealed) {
        if (dy < -35 || Math.abs(dx) > 40) {
          triggerHaptic("light");
          reveal();
        }
        resetCardPosition(true);
        return;
      }

      const isFlick = dt < 240;
      const triggerRight = dx > 70 || (isFlick && dx > 35);
      const triggerLeft = dx < -70 || (isFlick && dx < -35);
      const triggerUp = (dy < -65 || (isFlick && dy < -35)) && Math.abs(dy) > Math.abs(dx) * 0.7;

      if (triggerRight) {
        card.style.transition = "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease";
        card.style.transform = `translate3d(120vw, ${dy}px, 0) rotate(22deg)`;
        card.style.opacity = "0";
        triggerHaptic("success");
        setTimeout(() => grade("good"), 180);
      } else if (triggerLeft) {
        card.style.transition = "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease";
        card.style.transform = `translate3d(-120vw, ${dy}px, 0) rotate(-22deg)`;
        card.style.opacity = "0";
        triggerHaptic("warning");
        setTimeout(() => grade("again"), 180);
      } else if (triggerUp) {
        card.style.transition = "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease";
        card.style.transform = `translate3d(${dx}px, -120vh, 0) rotate(0deg)`;
        card.style.opacity = "0";
        triggerHaptic("medium");
        setTimeout(() => grade("hard"), 180);
      } else {
        resetCardPosition(true);
      }
    };

    card.addEventListener("pointerup", handlePointerEnd);
    card.addEventListener("pointercancel", handlePointerEnd);
  }

  // ---------- イベント ----------
  $("#start-daily").addEventListener("click", () => startSession({ type: "daily" }));
  $("#start-rally-btn")?.addEventListener("click", () => startSession({ type: "rally" }));
  $("#start-weak").addEventListener("click", () => startSession({ type: "weak" }));
  $("#start-random").addEventListener("click", () => startSession({ type: "random" }));
  $("#start-custom").addEventListener("click", () => startSession({ type: "custom" }));
  $("#reveal-btn").addEventListener("click", () => { triggerHaptic("light"); reveal(); });
  $("#speak-btn").addEventListener("click", () => session && speakCard(session.queue[session.index]));
  $("#quit-practice").addEventListener("click", () => { stopSession(); showView("home"); });
  $("#grade-actions").addEventListener("click", (e) => {
    const b = e.target.closest("[data-grade]");
    if (b) {
      triggerHaptic("light");
      grade(b.dataset.grade);
    }
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
  const keyInput = $("#gemini-api-key");
  const toggleKeyBtn = $("#toggle-key-visibility");
  const testTtsBtn = $("#test-tts-btn");
  const testStatus = $("#test-tts-status");
  const cacheCountEl = $("#cache-count");
  const clearCacheBtn = $("#clear-cache-btn");
  const speechRateInput = $("#speech-rate-input");
  const speechRateVal = $("#speech-rate-val");

  function updateSpeechRateDisplay(rate) {
    const num = Number(rate) || 1.15;
    if (speechRateVal) speechRateVal.textContent = `${num.toFixed(2)}x`;
    $$("#speech-speed-presets .btn-toggle").forEach((btn) => {
      btn.classList.toggle("active", Math.abs(Number(btn.dataset.speed) - num) < 0.03);
    });
  }

  speechRateInput?.addEventListener("input", () => {
    const spd = Number(speechRateInput.value) || 1.15;
    updateSpeechRateDisplay(spd);
    state.settings.speechRate = spd;
    save();
  });

  $("#speech-speed-presets")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-toggle");
    if (!btn) return;
    const spd = Number(btn.dataset.speed) || 1.15;
    if (speechRateInput) speechRateInput.value = spd;
    updateSpeechRateDisplay(spd);
    state.settings.speechRate = spd;
    save();
  });

  function updateTtsFieldsVisibility() {
    const isGemini = ttsSelect.value === "gemini";
    if (geminiSub) geminiSub.hidden = !isGemini;
  }
  ttsSelect.addEventListener("change", updateTtsFieldsVisibility);

  toggleKeyBtn.addEventListener("click", () => {
    const isPw = keyInput.type === "password";
    keyInput.type = isPw ? "text" : "password";
    toggleKeyBtn.textContent = isPw ? "隠す" : "表示";
  });

  const testTtsJaBtn = $("#test-tts-ja-btn");
  const batchCacheBtn = $("#batch-cache-btn");
  const batchCacheScope = $("#batch-cache-scope");
  const batchCacheProgress = $("#batch-cache-progress");
  let batchCacheAborted = false;

  function updateBatchCacheBtnText() {
    if (!batchCacheScope || !batchCacheBtn) return;
    const val = batchCacheScope.value;
    if (val === "all") batchCacheBtn.textContent = `全${ALL_CARDS.length}問 一括生成を開始`;
    else if (val === "conv") batchCacheBtn.textContent = `口語編(${CONV_CARDS.length}問) 一括生成を開始`;
    else batchCacheBtn.textContent = `GRIT編(${GRIT_CARDS.length}問) 一括生成を開始`;
  }
  batchCacheScope?.addEventListener("change", updateBatchCacheBtnText);

  testTtsBtn.addEventListener("click", async () => {
    const key = keyInput.value.trim();
    if (!key) {
      testStatus.textContent = "APIキーを入力してください";
      testStatus.className = "status-msg error";
      keyInput.focus();
      return;
    }
    const model = form.geminiModel.value;
    const voice = form.geminiVoice.value;
    const accent = form.geminiAccent?.value || "us";
    const testAccent = accent === "global" ? "uk" : accent;
    const accentInfo = ACCENT_LABELS[testAccent] || ACCENT_LABELS.us;
    testStatus.textContent = `${accentInfo.flag} ${accentInfo.label}生成中...`;
    testStatus.className = "status-msg";
    testTtsBtn.disabled = true;
    try {
      const sample = testAccent === "uk"
        ? "Would you care for a cup of tea? I'd rather stay at home."
        : (testAccent === "in"
          ? "We will discuss this in today's meeting. Please do the needful."
          : (testAccent === "au"
            ? "Good day! Let's catch up over coffee this afternoon."
            : "I'd say eighty percent of the time I'm working from home."));
      const blob = await generateGeminiSpeech(sample, key, model, voice, "en", testAccent);
      playBlob(blob);
      testStatus.textContent = `✓ ${accentInfo.flag} ${accentInfo.label}再生成功！`;
      testStatus.className = "status-msg success";
    } catch (e) {
      if (e.message.includes("free_tier_requests") || e.message.includes("limit: 10")) {
        testStatus.textContent = `✕ Google無料枠上限（1日10件）扱いになっています。課金連携済みの場合はAI StudioでAPIキーを新しく「再作成」して差し替えると即座に反映されます。`;
      } else if (e.message.includes("Quota exceeded") || e.message.includes("429") || e.message.includes("ResourceExhausted")) {
        testStatus.textContent = `✕ API制限(429): ${e.message}（前払い残高や新しいAPIキーの作成をお試しください）`;
      } else {
        testStatus.textContent = `✕ エラー: ${e.message}`;
      }
      testStatus.className = "status-msg error";
    } finally {
      testTtsBtn.disabled = false;
    }
  });

  testTtsJaBtn?.addEventListener("click", async () => {
    const key = keyInput.value.trim();
    if (!key) {
      testStatus.textContent = "APIキーを入力してください";
      testStatus.className = "status-msg error";
      keyInput.focus();
      return;
    }
    testStatus.textContent = "🇯🇵 日本語生成中...";
    testStatus.className = "status-msg";
    testTtsJaBtn.disabled = true;
    try {
      const model = form.geminiModel.value;
      const voice = form.geminiVoice.value;
      const sample = "私の直感では、大半の人は在宅勤務を好むと思います。";
      const blob = await generateGeminiSpeech(sample, key, model, voice, "ja");
      playBlob(blob);
      testStatus.textContent = "✓ 日本語再生成功！";
      testStatus.className = "status-msg success";
    } catch (e) {
      if (e.message.includes("Quota exceeded") || e.message.includes("quota") || e.message.includes("limit: 10")) {
        testStatus.textContent = "✕ Google無料枠上限（1日10件）に達しました。約11時間後にリセットされるか、同梱の高品質音声（0円・無制限）をご利用ください。";
      } else {
        testStatus.textContent = `✕ エラー: ${e.message}`;
      }
      testStatus.className = "status-msg error";
    } finally {
      testTtsJaBtn.disabled = false;
    }
  });

  function saveCurrentSettingsFromForm() {
    state.settings = {
      dailyGoal: Math.max(1, Math.min(100, parseInt(form.dailyGoal.value, 10) || 10)),
      timerSec: Math.max(0, Math.min(30, parseInt(form.timerSec.value, 10) || 0)),
      speechRate: Number(form.speechRate.value) || 1.15,
      autoSpeak: form.autoSpeak.checked,
      showHint: form.showHint.checked,
      typingMode: form.typingMode.checked,
      ttsEngine: form.ttsEngine.value,
      geminiApiKey: form.geminiApiKey.value.trim(),
      geminiModel: form.geminiModel.value,
      geminiVoice: form.geminiVoice.value,
      geminiAccent: form.geminiAccent ? form.geminiAccent.value : "us",
    };
    const h = state.history[todayKey()];
    if (h) h.goal = state.settings.dailyGoal;
    save();
  }

  keyInput.addEventListener("input", () => {
    state.settings.geminiApiKey = keyInput.value.trim();
    save();
  });
  form.geminiModel.addEventListener("change", () => {
    state.settings.geminiModel = form.geminiModel.value;
    save();
  });
  form.geminiVoice.addEventListener("change", () => {
    state.settings.geminiVoice = form.geminiVoice.value;
    save();
  });
  form.geminiAccent?.addEventListener("change", () => {
    state.settings.geminiAccent = form.geminiAccent.value;
    save();
  });
  ttsSelect.addEventListener("change", () => {
    state.settings.ttsEngine = ttsSelect.value;
    save();
  });

  // 一括キャッシュ
  batchCacheBtn?.addEventListener("click", async () => {
    const key = keyInput.value.trim();
    if (!key) {
      alert("先にGemini APIキーを入力してください。");
      keyInput.focus();
      return;
    }
    if (batchCacheBtn.dataset.running === "true") {
      batchCacheAborted = true;
      batchCacheBtn.textContent = "中止中...";
      return;
    }

    // 入力値とGemini設定を即座に永続化
    saveCurrentSettingsFromForm();

    const scope = batchCacheScope ? batchCacheScope.value : "all";
    let targetCards = [];
    let scopeTitle = "";
    if (scope === "all") {
      targetCards = ALL_CARDS;
      scopeTitle = `全${ALL_CARDS.length}問（口語編＋GRIT編 / 英語・日本語 計${ALL_CARDS.length * 2}ファイル）`;
    } else if (scope === "conv") {
      targetCards = CONV_CARDS;
      scopeTitle = `口語編（${CONV_CARDS.length}問 / 英語・日本語 計${CONV_CARDS.length * 2}ファイル）`;
    } else {
      targetCards = GRIT_CARDS;
      scopeTitle = `GRIT編（${GRIT_CARDS.length}問 / 英語・日本語 計${GRIT_CARDS.length * 2}ファイル）`;
    }

    const model = form.geminiModel.value;
    const voice = form.geminiVoice.value;

    if (!confirm(`【${scopeTitle}】の音声をGemini 3.8 (${voice}) で一括生成・端末に保存しますか？\n\n・推定費用: 約60円〜100円（従量課金）\n・所要時間: 約6〜9分\n・生成中は画面のスリープを防止します\n\n※途中で中断しても、保存済みの音声はそのまま残ります。`)) {
      return;
    }

    batchCacheAborted = false;
    batchCacheBtn.dataset.running = "true";
    batchCacheBtn.textContent = "✕ 生成を中止";
    batchCacheProgress.hidden = false;

    let wakeLock = null;
    try {
      if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch {}

    let abortReason = null;
    let processedCount = 0;
    const totalItems = targetCards.length;

    for (let i = 0; i < totalItems; i++) {
      if (batchCacheAborted) break;
      const card = targetCards[i];
      const courseLabel = card.course === "grit" ? "🎓 GRIT" : "🗣️ 口語";
      batchCacheProgress.textContent = `⚡️ [${i + 1}/${totalItems}問] ${courseLabel} (${processedCount}ファイル保存済) - ${card.pattern.en.slice(0, 16)}...`;

      // 1. 英語キャッシュ確認・生成
      const effectiveAccent = getEffectiveAccent(card, state.settings.geminiAccent || "us");
      const enCacheKey = `${card.id}_${model}_${voice}_${effectiveAccent}`;
      const enCached = await getCachedAudio(enCacheKey);
      if (!enCached) {
        let retry = 0;
        while (retry < 5 && !batchCacheAborted) {
          try {
            const blob = await generateGeminiSpeech(card.en, key, model, voice, "en", effectiveAccent);
            await setCachedAudio(enCacheKey, blob);
            processedCount++;
            await updateCacheCount();
            await new Promise((r) => setTimeout(r, 2200));
            break;
          } catch (e) {
            console.warn("Batch cache EN error:", e);
            const msg = String(e.message || e);
            // 本当に無料枠の1日上限（10件/日）の場合のみ中断
            if (msg.includes("free_tier_requests") && msg.includes("limit: 10")) {
              abortReason = `⚠️ Google無料枠上限（1日10件）に到達しました。Google AI Studioでプロジェクトの課金連携をご確認ください。`;
              batchCacheAborted = true;
              break;
            }
            if (msg.includes("API key not valid") || msg.includes("403")) {
              abortReason = `⚠️ APIキー無効エラー: 正しいキーが入力されているかご確認ください`;
              batchCacheAborted = true;
              break;
            }
            // 一時的なレート制限（RPM: 1分間のリクエスト上限）の場合は待機して自動再開
            if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota") || msg.includes("Quota")) {
              retry++;
              for (let s = 15; s > 0; s--) {
                if (batchCacheAborted) break;
                batchCacheProgress.textContent = `⚠️ 1分間のAPI制限のため待機中（あと${s}秒で自動再開）... [${processedCount}件完了]`;
                await new Promise((r) => setTimeout(r, 1000));
              }
            } else {
              retry++;
              await new Promise((r) => setTimeout(r, 3000));
            }
          }
        }
      }

      if (batchCacheAborted) break;

      // 2. 日本語キャッシュ確認・生成
      const jaCacheKey = `ja_${card.id}_${model}_${voice}`;
      const jaCached = await getCachedAudio(jaCacheKey);
      if (!jaCached) {
        let retry = 0;
        while (retry < 5 && !batchCacheAborted) {
          try {
            const blob = await generateGeminiSpeech(card.ja, key, model, voice, "ja");
            await setCachedAudio(jaCacheKey, blob);
            processedCount++;
            await updateCacheCount();
            await new Promise((r) => setTimeout(r, 2200));
            break;
          } catch (e) {
            console.warn("Batch cache JA error:", e);
            const msg = String(e.message || e);
            // 本当に無料枠の1日上限（10件/日）の場合のみ中断
            if (msg.includes("free_tier_requests") && msg.includes("limit: 10")) {
              abortReason = `⚠️ Google無料枠上限（1日10件）に到達しました。Google AI Studioでプロジェクトの課金連携をご確認ください。`;
              batchCacheAborted = true;
              break;
            }
            if (msg.includes("API key not valid") || msg.includes("403")) {
              abortReason = `⚠️ APIキー無効エラー: 正しいキーが入力されているかご確認ください`;
              batchCacheAborted = true;
              break;
            }
            // 一時的なレート制限（RPM: 1分間のリクエスト上限）の場合は待機して自動再開
            if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota") || msg.includes("Quota")) {
              retry++;
              for (let s = 15; s > 0; s--) {
                if (batchCacheAborted) break;
                batchCacheProgress.textContent = `⚠️ 1分間のAPI制限のため待機中（あと${s}秒で自動再開）... [${processedCount}件完了]`;
                await new Promise((r) => setTimeout(r, 1000));
              }
            } else {
              retry++;
              await new Promise((r) => setTimeout(r, 3000));
            }
          }
        }
      }
    }

    if (wakeLock) {
      wakeLock.release().catch(() => {});
      wakeLock = null;
    }

    batchCacheBtn.dataset.running = "false";
    updateBatchCacheBtnText();
    if (abortReason) {
      batchCacheProgress.textContent = `${abortReason}（保存済み: ${await countCachedAudio()}件）`;
    } else if (batchCacheAborted) {
      batchCacheProgress.textContent = `⏹ ユーザー操作により中止しました。保存済みの音声（${await countCachedAudio()}件）はそのままご利用いただけます。`;
    } else {
      batchCacheProgress.textContent = `🎉 完了！全問のGemini音声が端末に保存されました。オフラインでも超自然な音声で練習できます！`;
    }
    saveCurrentSettingsFromForm();
    await updateCacheCount();
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
    const spd = Number(s.speechRate) || 1.15;
    form.speechRate.value = spd;
    updateSpeechRateDisplay(spd);
    form.autoSpeak.checked = s.autoSpeak;
    form.showHint.checked = s.showHint;
    form.typingMode.checked = s.typingMode;
    form.ttsEngine.value = s.ttsEngine;
    form.geminiApiKey.value = s.geminiApiKey;
    form.geminiModel.value = s.geminiModel;
    form.geminiVoice.value = s.geminiVoice;
    if (form.geminiAccent) form.geminiAccent.value = s.geminiAccent || "us";
    testStatus.textContent = "";
    updateTtsFieldsVisibility();
    await updateCacheCount();
    dialog.returnValue = "";
    dialog.showModal();
  });

  dialog.addEventListener("close", () => {
    saveCurrentSettingsFromForm();
    if (!views.home.hidden) renderHome();
    renderHeaderStreak();
  });

  $("#reset-data").addEventListener("click", () => {
    if (!confirm("学習記録とストリーク、作成したカスタム例文、獲得バッジをすべて初期化します。よろしいですか？")) return;
    state = {
      activeCourse: "conversation",
      settings: state.settings,
      cards: {},
      history: {},
      customCards: [],
      achievements: {},
      listeningCount: 0,
      streakShields: 1,
      shieldUsedDates: [],
      shieldAwardedMilestones: [],
    };
    save();
    dialog.close();
    stopSession();
    renderHome();
    showView("home");
  });

  const forceUpdateBtn = $("#force-update-btn");
  if (forceUpdateBtn) {
    forceUpdateBtn.addEventListener("click", async () => {
      forceUpdateBtn.disabled = true;
      forceUpdateBtn.textContent = "更新中...";
      try {
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
      } catch (err) {
        console.warn("Cache reset error:", err);
      }
      const cleanUrl = window.location.origin + window.location.pathname + "?ts=" + Date.now();
      window.location.replace(cleanUrl);
    });
  }

  // ---------- 端末間同期・バックアップ（PC ⇄ iPhone） ----------
  const exportSyncBtn = $("#export-sync-btn");
  const importSyncBtn = $("#import-sync-btn");
  const syncFileInput = $("#sync-file-input");
  const syncStatus = $("#sync-status");

  exportSyncBtn?.addEventListener("click", async () => {
    try {
      exportSyncBtn.disabled = true;
      if (syncStatus) {
        syncStatus.style.display = "block";
        syncStatus.textContent = "書き出し中...";
        syncStatus.className = "status-msg";
      }

      saveCurrentSettingsFromForm();
      const cachedAudios = await getAllCachedAudio();
      const audioList = [];
      for (const item of cachedAudios) {
        const b64 = await blobToBase64(item.blob);
        audioList.push({
          key: item.key,
          mime: item.blob.type || "audio/wav",
          data: b64
        });
      }

      const backupData = {
        version: 1,
        appName: "shunkan-eisakubun",
        exportedAt: new Date().toISOString(),
        state: state,
        audioCount: audioList.length,
        audioCache: audioList
      };

      const jsonStr = JSON.stringify(backupData);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shunkan-sync-${todayKey()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (syncStatus) {
        syncStatus.textContent = `✓ 書き出し完了！(${audioList.length}件の音声を保存。このファイルをiPhoneにAirDropしてください)`;
        syncStatus.className = "status-msg success";
      }
    } catch (err) {
      console.error("Export sync error:", err);
      if (syncStatus) {
        syncStatus.textContent = `✕ 書き出しエラー: ${err.message}`;
        syncStatus.className = "status-msg error";
      }
    } finally {
      exportSyncBtn.disabled = false;
    }
  });

  importSyncBtn?.addEventListener("click", () => {
    syncFileInput?.click();
  });

  syncFileInput?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (syncStatus) {
        syncStatus.style.display = "block";
        syncStatus.textContent = "データを復元中...";
        syncStatus.className = "status-msg";
      }

      const text = await file.text();
      const backupData = JSON.parse(text);
      if (!backupData || backupData.appName !== "shunkan-eisakubun") {
        throw new Error("無効なバックアップファイルです。");
      }

      // 1. 設定・状態の復元
      if (backupData.state) {
        state = {
          ...state,
          ...backupData.state,
          settings: { ...state.settings, ...backupData.state.settings }
        };
        if (typeof state.streakShields !== "number") state.streakShields = 1;
        if (!Array.isArray(state.shieldUsedDates)) state.shieldUsedDates = [];
        if (!Array.isArray(state.shieldAwardedMilestones)) state.shieldAwardedMilestones = [];
        save();
      }

      // 2. 音声キャッシュの復元
      let restoredCount = 0;
      if (Array.isArray(backupData.audioCache)) {
        restoredCount = await restoreAudioCacheItems(backupData.audioCache);
      }

      await updateCacheCount();
      if (syncStatus) {
        syncStatus.textContent = `✓ 復元完了！APIキー、設定、音声キャッシュ（${restoredCount}件）を同期しました。`;
        syncStatus.className = "status-msg success";
      }
      alert(`🎉 復元・同期が完了しました！\nAPIキー、設定、学習履歴、および音声キャッシュ（${restoredCount}件）をiPhoneに反映しました。`);
      location.reload();
    } catch (err) {
      console.error("Import sync error:", err);
      if (syncStatus) {
        syncStatus.textContent = `✕ 復元エラー: ${err.message}`;
        syncStatus.className = "status-msg error";
      }
      alert(`復元に失敗しました: ${err.message}`);
    } finally {
      syncFileInput.value = "";
    }
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
    if (scope === "part6") return Array.from({ length: 10 }, (_, i) => 31 + i);
    if (scope === "part7") return Array.from({ length: 9 }, (_, i) => 41 + i);
    if (scope === "part8") return Array.from({ length: 10 }, (_, i) => 50 + i);
    if (scope === "part9") return Array.from({ length: 11 }, (_, i) => 60 + i);
    return Array.from({ length: window.PATTERNS.length }, (_, i) => i + 1);
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

  // ==========================================
  // 🤖 Gemini テキスト生成（gemini-3.8-flash + 多重フォールバック）
  // ==========================================
  function extractJsonArray(text) {
    if (!text) return null;
    let cleaned = String(text).trim();
    if (cleaned.includes("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    }
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return null;
  }

  async function requestGeminiContent(prompt, apiKey) {
    // 優先度：3.8-flash -> 1.5-flash -> 2.0-flash -> 3.5-flash-lite
    const candidateModels = ["gemini-3.8-flash", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.5-flash-lite"];
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
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
          if (msg.includes("no longer available") || msg.includes("not found") || msg.includes("NotFound") || res.status === 404 || res.status === 400) {
            console.warn(`Model ${model} unavailable (${msg}), trying next candidate...`);
            lastError = new Error(msg);
            continue;
          }
          throw new Error(msg);
        }

        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Geminiからデータを受信できませんでした。");

        const parsed = extractJsonArray(rawText);
        if (!parsed) {
          throw new Error("Geminiの応答をJSON配列として解析できませんでした。");
        }
        return parsed;
      } catch (err) {
        lastError = err;
        if (err.message.includes("no longer available") || err.message.includes("not found") || err.message.includes("404") || err.message.includes("400")) {
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error("Gemini APIのリクエストに失敗しました。");
  }

  async function generateSentencesWithGemini(theme, targetIds, apiKey) {
    const targetPatterns = targetIds.map((id) => {
      const p = window.PATTERNS.find((x) => x.id === id);
      return `${id}: ${p.en} (${p.ja})`;
    }).join("\n");

    const prompt = `あなたはプロの英語ネイティブ講師です。以下のテーマに合わせて、指定された英語構文を使った瞬間パターントレーニングの練習用オリジナル例文を作成してください。

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

    const parsed = await requestGeminiContent(prompt, apiKey);

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
      aiKeyHint.innerHTML = "✨ <strong>Gemini 3.8 Flash 連携中</strong>：あなたのテーマに合わせ、完全オリジナルの実践例文をリアルタイム自動生成します。";
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
    checkAchievements(true);
    renderHome();

    // ユーザーに練習をすぐ促す
    if (confirm(`✨ ${currentGeneratedCards.length}問のオリジナル例文を追加しました！\n今すぐ練習を始めますか？`)) {
      startSession({ type: "custom" });
    }
  });

  // ==========================================
  // 🎧 ハンズフリー「聞き流し・耳トレ」モード
  // ==========================================
  let listening = {
    active: false,
    playing: false,
    queue: [],
    index: 0,
    step: "idle", // "ja" | "think" | "en" | "repeat" | "done"
    range: "all",
    shuffle: false,
    loop: true,
    thinkSec: 3,
    repeatSec: 2,
    enRepeats: 1,
    speed: 1.15,
    showEnAlways: false,
    runId: 0,
    currentSleepReject: null,
  };

  let silentBgAudio = null;
  function ensureSilentBgAudio() {
    if (!silentBgAudio) {
      silentBgAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
      silentBgAudio.loop = true;
      silentBgAudio.volume = 0.01;
    }
    silentBgAudio.play().catch(() => {});
  }
  function stopSilentBgAudio() {
    if (silentBgAudio) {
      silentBgAudio.pause();
    }
  }

  function cancellableSleep(ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        listening.currentSleepReject = null;
        resolve();
      }, ms);
      listening.currentSleepReject = () => {
        clearTimeout(timer);
        reject(new Error("aborted"));
      };
    });
  }

  function abortCurrentSleep() {
    if (listening.currentSleepReject) {
      const fn = listening.currentSleepReject;
      listening.currentSleepReject = null;
      try { fn(); } catch (e) {}
    }
  }

  function getListeningPool(range) {
    if (range && range.startsWith("p")) {
      const partNum = parseInt(range.slice(1), 10);
      return CARDS.filter((c) => c.pattern.part === partNum);
    }
    switch (range) {
      case "weak": {
        const w = weakCards();
        return w.length ? w : CARDS.slice(0, 20);
      }
      case "custom": {
        return (state.customCards || []).map((item) => ({
          id: item.id,
          pattern: window.PATTERNS.find((p) => p.id === item.patternId) || window.PATTERNS[0],
          ja: item.ja,
          en: item.en,
          isCustom: true,
          theme: item.theme || "カスタム",
          audioId: getCustomAudioId(item),
        }));
      }
      case "all":
      default:
        return CARDS;
    }
  }

  function loadListeningQueue(range = listening.range) {
    listening.range = range;
    let pool = getListeningPool(range);
    if (!pool.length) pool = CARDS;
    listening.queue = listening.shuffle ? shuffle(pool) : [...pool];
    listening.index = 0;
  }

  function renderListeningView() {
    listening.active = true;
    const isGrit = getActiveCourse() === "grit";
    const customCount = (state.customCards || []).length;
    const customPill = $("#filter-pill-custom");
    if (customPill) customPill.hidden = customCount === 0 || isGrit;

    $$('#listening-filter-bar .filter-pill[data-range^="p"]').forEach((btn) => {
      const partNum = parseInt(btn.dataset.range.slice(1), 10);
      btn.hidden = isGrit && partNum > 5;
    });

    const weakCount = weakCards().length;
    const weakPill = $("#listening-weak-count");
    if (weakPill) weakPill.textContent = weakCount;

    const allPill = $('#listening-filter-bar .filter-pill[data-range="all"]');
    if (allPill) allPill.textContent = `全範囲 (${CARDS.length})`;

    updateCourseSwitchUI();

    if (!listening.queue.length) {
      loadListeningQueue(listening.range);
    }
    updateListeningControlsUI();
    updateListeningFilterPills();
    if (listening.queue[listening.index]) {
      renderListeningCard(listening.queue[listening.index], false);
    }
    if (!listening.playing) {
      setListeningStep("idle", "▶ 再生ボタンを押して開始", "ready");
      updateSoundwave(false);
    }
  }

  function updateListeningFilterPills() {
    $$("#listening-filter-bar .filter-pill").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.range === listening.range);
    });
  }

  function updateListeningControlsUI() {
    const playBtn = $("#listening-btn-play");
    const playIcon = $("#listening-play-icon");
    if (playBtn && playIcon) {
      playBtn.classList.toggle("playing", listening.playing);
      playIcon.innerHTML = listening.playing ? uiIcon("pause") : uiIcon("play");
    }
    const shuffleBtn = $("#listening-btn-shuffle");
    if (shuffleBtn) shuffleBtn.classList.toggle("active", listening.shuffle);
    const loopBtn = $("#listening-btn-loop");
    if (loopBtn) loopBtn.classList.toggle("active", listening.loop);

    $$("#l-pause-toggles .btn-toggle").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.val) === listening.thinkSec);
    });
    $$("#l-repeat-toggles .btn-toggle").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.val) === listening.enRepeats);
    });
    $$("#l-speed-toggles .btn-toggle").forEach((b) => {
      b.classList.toggle("active", Math.abs(Number(b.dataset.val) - listening.speed) < 0.03);
    });
    const toggleShowBtn = $("#l-toggle-show-en");
    if (toggleShowBtn) {
      toggleShowBtn.textContent = listening.showEnAlways ? "思考中も表示中" : "思考中は隠す（テスト）";
      toggleShowBtn.classList.toggle("active", listening.showEnAlways);
    }
  }

  function renderListeningCard(card, showAnswer = false) {
    if (!card) return;
    const chip = $("#listening-pattern-chip");
    if (chip) {
      const tagText = card.tag ? ` [${card.tag}]` : "";
      chip.textContent = `Part ${card.pattern.part} / 型${card.pattern.id}: ${card.pattern.en}${tagText}`;
    }
    const promptJa = $("#listening-prompt-ja");
    if (promptJa) promptJa.textContent = card.ja;
    const enLabel = $("#listening-en-label");
    if (enLabel) {
      const effectiveAccent = getEffectiveAccent(card, state.settings.geminiAccent || "us");
      const accentInfo = ACCENT_LABELS[effectiveAccent] || ACCENT_LABELS.us;
      enLabel.textContent = `${accentInfo.flag} 英語 (${accentInfo.name})`;
    }
    const enEl = $("#listening-answer-en");
    if (enEl) {
      enEl.textContent = card.en;
      if (showAnswer || listening.showEnAlways) {
        enEl.classList.remove("blurred");
        enEl.classList.add("revealed");
      } else {
        enEl.classList.add("blurred");
        enEl.classList.remove("revealed");
      }
    }
    const noteEl = $("#listening-pattern-note");
    if (noteEl) noteEl.textContent = card.pattern.note || "";
    const counterEl = $("#listening-counter");
    if (counterEl) counterEl.textContent = `${listening.index + 1} / ${listening.queue.length}`;
    const progress = $("#listening-session-progress");
    if (progress) {
      progress.max = listening.queue.length;
      progress.value = listening.index + 1;
    }
  }

  function setListeningStep(step, text, type = "ja") {
    listening.step = step;
    const pill = $("#listening-step-pill");
    const textEl = $("#listening-step-text");
    if (textEl) textEl.textContent = text;
    if (pill) {
      pill.className = `listening-step-pill step-${type}`;
    }
  }

  function updateSoundwave(active) {
    const wave = $("#listening-soundwave");
    if (wave) wave.classList.toggle("active", active);
  }

  function animatePhaseBar(ms) {
    const bar = $("#listening-phase-bar");
    if (!bar) return;
    bar.style.setProperty("--p-duration", `${ms}ms`);
    bar.classList.remove("animating");
    void bar.offsetWidth;
    bar.classList.add("animating");
  }

  function resetPhaseBar() {
    const bar = $("#listening-phase-bar");
    if (!bar) return;
    bar.classList.remove("animating");
    bar.style.transform = "scaleX(0)";
  }

  function updateMediaSession(card, stepTitle, stepSub) {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: card.ja,
        artist: stepSub || card.en,
        album: `瞬間パターントレーニング - ${card.pattern.en}`,
        artwork: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      });
      navigator.mediaSession.playbackState = listening.playing ? "playing" : "paused";
    } catch (e) {}
  }

  function recordListeningProgress(card) {
    state.listeningCount = (state.listeningCount || 0) + 1;
    const t = todayKey();
    const h = state.history[t] || { answered: 0, good: 0, goal: state.settings.dailyGoal };
    h.answered++;
    h.good++;
    state.history[t] = h;

    const s = cardState(card.id);
    s.seen++;
    state.cards[card.id] = s;

    save();
    renderHeaderStreak();
    checkAchievements(false);
  }

  async function runListeningLoop() {
    const currentRunId = ++listening.runId;

    while (listening.playing && listening.index < listening.queue.length) {
      if (listening.runId !== currentRunId || !listening.playing) return;
      const card = listening.queue[listening.index];
      if (!card) break;

      renderListeningCard(card, false);
      setListeningStep("ja", "🇯🇵 日本語を聞く", "ja");
      updateSoundwave(true);
      updateMediaSession(card, "🇯🇵 日本語", card.ja);

      await speakJapanesePromise(card);
      updateSoundwave(false);
      if (listening.runId !== currentRunId || !listening.playing) return;

      try { await cancellableSleep(400); } catch (e) { return; }
      if (listening.runId !== currentRunId || !listening.playing) return;

      setListeningStep("think", `🤔 英語を思い浮かべよう (${listening.thinkSec}s)`, "think");
      updateMediaSession(card, "🤔 英語を思い浮かべよう", card.ja);
      animatePhaseBar(listening.thinkSec * 1000);
      try {
        await cancellableSleep(listening.thinkSec * 1000);
      } catch (e) {
        resetPhaseBar();
        return;
      }
      resetPhaseBar();
      if (listening.runId !== currentRunId || !listening.playing) return;

      const effectiveAccent = getEffectiveAccent(card, state.settings.geminiAccent || "us");
      const accentInfo = ACCENT_LABELS[effectiveAccent] || ACCENT_LABELS.us;

      setListeningStep("en", `${accentInfo.flag} 英語の解答 (${accentInfo.name})`, "en");
      const enEl = $("#listening-answer-en");
      if (enEl) {
        enEl.classList.remove("blurred");
        enEl.classList.add("revealed");
      }
      updateSoundwave(true);
      updateMediaSession(card, `${accentInfo.flag} 英語 (${accentInfo.name})`, card.en);

      await playEnglishCardPromise(card, listening.speed);
      updateSoundwave(false);
      if (listening.runId !== currentRunId || !listening.playing) return;

      if (listening.enRepeats === 2) {
        try { await cancellableSleep(600); } catch (e) { return; }
        if (listening.runId !== currentRunId || !listening.playing) return;
        setListeningStep("en", `🔁 もう一度聞く (${accentInfo.flag} ${accentInfo.name})`, "en");
        updateSoundwave(true);
        await playEnglishCardPromise(card, listening.speed);
        updateSoundwave(false);
        if (listening.runId !== currentRunId || !listening.playing) return;
      }

      setListeningStep("repeat", `🗣️ 声に出してリピート！ (${listening.repeatSec}s)`, "repeat");
      animatePhaseBar(listening.repeatSec * 1000);
      try {
        await cancellableSleep(listening.repeatSec * 1000);
      } catch (e) {
        resetPhaseBar();
        return;
      }
      resetPhaseBar();
      if (listening.runId !== currentRunId || !listening.playing) return;

      recordListeningProgress(card);
      listening.index++;

      if (listening.index >= listening.queue.length) {
        if (listening.loop) {
          listening.index = 0;
          if (listening.shuffle) {
            listening.queue = shuffle(listening.queue);
          }
        } else {
          pauseListening();
          setListeningStep("done", "🎉 1周完了！お疲れ様でした", "en");
          break;
        }
      }
    }
  }

  function pauseListening() {
    listening.playing = false;
    abortCurrentSleep();
    resetPhaseBar();
    stopAudio();
    updateSoundwave(false);
    updateListeningControlsUI();
    stopSilentBgAudio();
    if ("mediaSession" in navigator) {
      try { navigator.mediaSession.playbackState = "paused"; } catch (e) {}
    }
  }

  function resumeListening() {
    if (!listening.queue.length) {
      loadListeningQueue(listening.range);
    }
    listening.playing = true;
    updateListeningControlsUI();
    ensureSilentBgAudio();
    if ("mediaSession" in navigator) {
      try { navigator.mediaSession.playbackState = "playing"; } catch (e) {}
    }
    runListeningLoop();
  }

  function toggleListeningPlay() {
    if (listening.playing) {
      pauseListening();
    } else {
      resumeListening();
    }
  }

  function nextListening() {
    pauseListening();
    if (!listening.queue.length) loadListeningQueue(listening.range);
    listening.index = (listening.index + 1) % listening.queue.length;
    renderListeningCard(listening.queue[listening.index], false);
    resumeListening();
  }

  function prevListening() {
    pauseListening();
    if (!listening.queue.length) loadListeningQueue(listening.range);
    listening.index = (listening.index - 1 + listening.queue.length) % listening.queue.length;
    renderListeningCard(listening.queue[listening.index], false);
    resumeListening();
  }

  function stopListening() {
    pauseListening();
    listening.active = false;
  }

  // Setup Listening UI event listeners
  $("#open-listening-btn")?.addEventListener("click", () => showView("listening"));
  $("#menu-start-listening")?.addEventListener("click", () => showView("listening"));
  $("#quit-listening")?.addEventListener("click", () => {
    stopListening();
    showView("home");
  });
  $("#listening-btn-play")?.addEventListener("click", toggleListeningPlay);
  $("#listening-btn-next")?.addEventListener("click", nextListening);
  $("#listening-btn-prev")?.addEventListener("click", prevListening);
  $("#listening-deck-card")?.addEventListener("click", (e) => {
    if (e.target.closest("button, a, input, select, progress")) return;
    toggleListeningPlay();
  });
  $("#listening-btn-shuffle")?.addEventListener("click", () => {
    listening.shuffle = !listening.shuffle;
    const wasPlaying = listening.playing;
    pauseListening();
    loadListeningQueue(listening.range);
    renderListeningCard(listening.queue[listening.index], false);
    updateListeningControlsUI();
    if (wasPlaying) {
      resumeListening();
    } else {
      setListeningStep("idle", "▶ 再生ボタンを押して開始", "ready");
    }
  });
  $("#listening-btn-loop")?.addEventListener("click", () => {
    listening.loop = !listening.loop;
    updateListeningControlsUI();
  });

  // Filter bar clicks
  $("#listening-filter-bar")?.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    const range = pill.dataset.range;
    if (range === listening.range) return;
    const wasPlaying = listening.playing;
    pauseListening();
    loadListeningQueue(range);
    updateListeningFilterPills();
    renderListeningCard(listening.queue[listening.index], false);
    updateListeningControlsUI();
    if (wasPlaying) {
      resumeListening();
    } else {
      setListeningStep("idle", "▶ 再生ボタンを押して開始", "ready");
    }
  });

  // Settings toggles
  $("#l-pause-toggles")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-toggle");
    if (!btn) return;
    listening.thinkSec = Number(btn.dataset.val) || 3;
    updateListeningControlsUI();
  });
  $("#l-repeat-toggles")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-toggle");
    if (!btn) return;
    listening.enRepeats = Number(btn.dataset.val) || 1;
    updateListeningControlsUI();
  });
  $("#l-speed-toggles")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-toggle");
    if (!btn) return;
    listening.speed = Number(btn.dataset.val) || 1.15;
    updateListeningControlsUI();
  });
  $("#l-toggle-show-en")?.addEventListener("click", () => {
    listening.showEnAlways = !listening.showEnAlways;
    updateListeningControlsUI();
    const enEl = $("#listening-answer-en");
    if (enEl) {
      if (listening.showEnAlways) {
        enEl.classList.remove("blurred");
      } else if (listening.step === "ja" || listening.step === "think") {
        enEl.classList.add("blurred");
      }
    }
  });

  // Tap blurred answer to reveal manually
  $("#listening-answer-en")?.addEventListener("click", () => {
    const enEl = $("#listening-answer-en");
    if (enEl) enEl.classList.toggle("blurred");
  });

  // MediaSession Action Handlers
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setActionHandler("play", () => {
        if (!views.listening.hidden) resumeListening();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        if (!views.listening.hidden) pauseListening();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (!views.listening.hidden) nextListening();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (!views.listening.hidden) prevListening();
      });
    } catch (e) {}
  }

  // Keyboard shortcut listener for listening view
  document.addEventListener("keydown", (e) => {
    if (!views.listening.hidden && !$("#settings-dialog").open) {
      if (e.target.matches("input, textarea, select")) return;
      if (e.key === " ") {
        e.preventDefault();
        toggleListeningPlay();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextListening();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevListening();
      } else if (e.key.toLowerCase() === "s") {
        listening.shuffle = !listening.shuffle;
        pauseListening();
        loadListeningQueue(listening.range);
        renderListeningCard(listening.queue[listening.index], false);
        updateListeningControlsUI();
        resumeListening();
      } else if (e.key.toLowerCase() === "l") {
        listening.loop = !listening.loop;
        updateListeningControlsUI();
      }
    }
  });

  // コース切り替えイベント
  $("#home-course-switch")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".course-tab-btn");
    if (btn && btn.dataset.course) switchCourse(btn.dataset.course);
  });
  $("#list-course-switch")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".course-tab-btn");
    if (btn && btn.dataset.course) switchCourse(btn.dataset.course);
  });
  $("#listening-course-bar")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".listening-course-pill");
    if (btn && btn.dataset.course) switchCourse(btn.dataset.course);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !views.home.hidden) {
      checkAchievements(false);
      renderHome();
    }
  });

  // 🛡️ ストリーク保護モーダルイベント
  $("#open-shield-modal")?.addEventListener("click", () => {
    const dialog = $("#shield-dialog");
    if (dialog) {
      const modalShieldCount = $("#modal-shield-count");
      if (modalShieldCount) modalShieldCount.textContent = state.streakShields ?? 1;
      dialog.showModal();
    }
  });
  $("#close-shield-modal")?.addEventListener("click", () => {
    $("#shield-dialog")?.close();
  });
  $("#shield-modal-ok-btn")?.addEventListener("click", () => {
    $("#shield-dialog")?.close();
  });
  // 📜 利用規約・クレジットモーダルイベント
  $("#open-legal-dialog")?.addEventListener("click", () => {
    $("#legal-dialog")?.showModal();
  });
  $("#close-legal-dialog")?.addEventListener("click", () => {
    $("#legal-dialog")?.close();
  });
  $("#legal-dialog-ok-btn")?.addEventListener("click", () => {
    $("#legal-dialog")?.close();
  });

  // 📲 PWAインストール案内バナー & 手順モーダル
  function checkPwaInstallBanner() {
    const isStandalone = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;
    const dismissed = localStorage.getItem("pwa-banner-dismissed");
    if (dismissed) return;

    const banner = $("#pwa-install-banner");
    if (banner) {
      setTimeout(() => {
        if (!isStandalone && !localStorage.getItem("pwa-banner-dismissed")) {
          banner.hidden = false;
        }
      }, 2500);
    }
  }

  $("#pwa-open-guide-btn")?.addEventListener("click", () => {
    $("#pwa-guide-dialog")?.showModal();
  });
  $("#close-pwa-guide")?.addEventListener("click", () => {
    $("#pwa-guide-dialog")?.close();
  });
  $("#pwa-guide-ok-btn")?.addEventListener("click", () => {
    $("#pwa-guide-dialog")?.close();
  });
  $("#pwa-banner-close-btn")?.addEventListener("click", () => {
    const banner = $("#pwa-install-banner");
    if (banner) banner.hidden = true;
    localStorage.setItem("pwa-banner-dismissed", "true");
  });

  // 📶 全音声一括ダウンロード（完全オフライン化）
  let isBulkDownloading = false;
  async function startBulkAudioDownload() {
    if (isBulkDownloading) return;
    isBulkDownloading = true;
    const btn = $("#bulk-download-btn");
    const box = $("#bulk-download-box");
    const progress = $("#bulk-download-progress");
    const status = $("#bulk-download-status");
    if (btn) btn.disabled = true;
    if (box) box.hidden = false;

    const audioUrls = new Set();
    for (const card of ALL_CARDS) {
      const audioKey = card.audioId || getCustomAudioId(card) || card.id;
      if (audioKey && !audioKey.startsWith("c_")) {
        audioUrls.add(`audio/${audioKey}.mp3`);
      }
    }
    const urls = Array.from(audioUrls);
    let completed = 0;
    const total = urls.length;
    if (progress) {
      progress.max = total;
      progress.value = 0;
    }

    try {
      const concurrency = 6;
      let currentIndex = 0;

      const worker = async () => {
        while (currentIndex < urls.length) {
          const idx = currentIndex++;
          const url = urls[idx];
          try {
            await fetch(url, { cache: "force-cache" });
          } catch (e) {
            // スキップ
          }
          completed++;
          if (progress) progress.value = completed;
          if (status) status.textContent = `保存中... ${completed} / ${total} 問 (${Math.round((completed / total) * 100)}%)`;
        }
      };

      const workers = [];
      for (let i = 0; i < concurrency; i++) workers.push(worker());
      await Promise.all(workers);

      if (status) status.textContent = `✅ 全${total}問の音声を保存しました！オフラインで利用可能です。`;
      if (btn) {
        btn.textContent = "保存完了 ✓";
        btn.disabled = false;
      }
      showToast("✅ 全音声の一括保存が完了しました！");
    } catch (err) {
      if (status) status.textContent = `⚠️ エラー: ${err.message}`;
      if (btn) btn.disabled = false;
    } finally {
      isBulkDownloading = false;
    }
  }
  $("#bulk-download-btn")?.addEventListener("click", startBulkAudioDownload);

  // ==========================================
  // 🥊 AIシチュエーション即答ラリー生成モーダル制御 (v41)
  // ==========================================
  const rallyAiDialog = $("#rally-ai-dialog");
  const openRallyAiBtn = $("#open-rally-ai-btn");
  const closeRallyAiBtn = $("#close-rally-ai-dialog");
  const rallyTopicInput = $("#rally-ai-topic");
  const rallyToneSelect = $("#rally-ai-tone");
  const rallyKeyHint = $("#rally-ai-key-hint");
  const rallyGenerateBtn = $("#rally-ai-generate-btn");
  const rallyLoadingEl = $("#rally-ai-loading");
  const rallyPreviewEl = $("#rally-ai-preview");
  const rallyPreviewList = $("#rally-ai-preview-list");
  const rallyPreviewCount = $("#rally-ai-preview-count");
  const rallySaveBtn = $("#rally-ai-save-btn");
  const rallyCancelBtn = $("#rally-ai-cancel-btn");
  const rallyPresetButtons = document.querySelectorAll(".rally-ai-preset");

  let currentGeneratedRallies = [];

  function updateRallyKeyHint() {
    if (!rallyKeyHint) return;
    const hasKey = !!state.settings.geminiApiKey;
    if (hasKey) {
      rallyKeyHint.className = "ai-key-hint with-key";
      rallyKeyHint.innerHTML = "✨ <strong>Gemini 3.8 Flash 連携中</strong>：指定したシチュエーションに合わせ、臨場感あふれる即答対話ラリーをリアルタイム生成します。";
    } else {
      rallyKeyHint.className = "ai-key-hint no-key";
      rallyKeyHint.innerHTML = "💡 <strong>0円・APIキー不要モード</strong>：おすすめシチュエーションから即座にラリーをセットアップできます。<br><small>オリジナルの場面を自由生成したい場合は、⚙️設定でGemini APIキーを登録できます。</small>";
    }
  }

  openRallyAiBtn?.addEventListener("click", () => {
    updateRallyKeyHint();
    if (rallyLoadingEl) rallyLoadingEl.hidden = true;
    if (rallyPreviewEl) rallyPreviewEl.hidden = true;
    if (rallyGenerateBtn) rallyGenerateBtn.disabled = false;
    currentGeneratedRallies = [];
    rallyAiDialog?.showModal();
  });

  closeRallyAiBtn?.addEventListener("click", () => {
    rallyAiDialog?.close();
  });

  rallyPresetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      rallyPresetButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (rallyTopicInput) rallyTopicInput.value = btn.dataset.topic;
    });
  });

  async function generateRalliesWithGemini(topic, tone, apiKey) {
    const prompt = `あなたは英会話のプロコーチです。以下のシチュエーション・トピックとトーンに合わせて、「シチュエーション即答ラリー」のシナリオを5件作成してください。

【シチュエーション・相手の立場】
${topic}

【トーン】
${tone}

【各ラリーカードのルール】
- 相手（ネイティブ）が自然に英語で話しかけてくるシチュエーションです。
- partner.avatar: 絵文字1文字（例: 🧑‍💼, 👩‍💻, 👱‍♀️, 🧔‍♂️など）
- partner.name: 相手の名前
- partner.context: 状況の短い説明（日本語）
- partner.en: 相手が話しかけてくる英語（1〜2文、日常会話的で自然）
- partner.ja: 相手の英語の日本語訳
- mission.prompt: ユーザーへの返答ミッション（例:「〜とやんわり断って！」「〜と答えて！」）
- mission.hint: 会話のヒント（日本語）
- mission.targetPatternId: 70の基本構文の中で最も適した型ID（1〜70）
- en: あなた（ユーザー）の模範返答となる英語
- ja: 模範返答の自然な日本語訳
- replyTips: なぜこの表現が効果的か、大人の切り返しのコツ解説（1〜2文）
- alternatives: その他の自然な言い回し・返し方（2つの配列）

出力は必ず以下のJSON配列のみを返してください：
[
  {
    "partner": {
      "avatar": "🧑‍💼",
      "name": "Sarah",
      "context": "クライアントからの日程変更依頼",
      "en": "Could we possibly move our sync to next Tuesday?",
      "ja": "打ち合わせを来週の火曜日に変更することは可能ですか？"
    },
    "mission": {
      "prompt": "「私の知る限りでは、火曜なら大丈夫なはずです」と答えて！",
      "hint": "自分の把握範囲に限定する型を使おう",
      "targetPatternId": 11
    },
    "en": "As far as I know, Tuesday should be fine.",
    "ja": "私の知る限りでは、火曜なら大丈夫なはずです。",
    "replyTips": "As far as I know を使うことで、確定前にやんわり見通しを共有できます。",
    "alternatives": ["As far as I'm aware, that works.", "Tuesday should work from what I know."]
  }
]`;

    const parsed = await requestGeminiContent(prompt, apiKey);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("ラリーデータの形式が不正です。");
    }

    return parsed.map((item, idx) => ({
      id: `custom-rally-${Date.now()}-${idx}`,
      isRally: true,
      category: topic,
      partner: item.partner,
      mission: item.mission,
      pattern: window.PATTERNS.find((p) => p.id === (item.mission && item.mission.targetPatternId)) || window.PATTERNS[0],
      en: item.en,
      ja: item.ja,
      replyTips: item.replyTips || "相手の意図を汲み取りながら自然に返す大人のフレーズです。",
      alternatives: item.alternatives || []
    }));
  }

  rallyGenerateBtn?.addEventListener("click", async () => {
    const topic = (rallyTopicInput?.value || "").trim() || "日常会話・オフィスでの雑談";
    const tone = rallyToneSelect?.value || "casual";
    const apiKey = state.settings.geminiApiKey;
    const errorBox = $("#rally-ai-error-box");

    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = "";
    }
    rallyGenerateBtn.disabled = true;
    rallyGenerateBtn.innerHTML = `<div class="spinner icon-xs" style="display:inline-block; vertical-align:middle; width:14px; height:14px; border-width:2px; margin-right:6px;"></div> シナリオを生成中...`;
    if (rallyLoadingEl) rallyLoadingEl.hidden = false;
    if (rallyPreviewEl) rallyPreviewEl.hidden = true;

    try {
      if (apiKey) {
        currentGeneratedRallies = await generateRalliesWithGemini(topic, tone, apiKey);
      } else {
        // APIキーなし: プリセットから5件ピックアップ
        await new Promise((r) => setTimeout(r, 600));
        const pool = [...(window.RALLY_PRESETS || [])];
        currentGeneratedRallies = shuffle(pool).slice(0, 5);
      }

      if (rallyLoadingEl) rallyLoadingEl.hidden = true;
      if (rallyPreviewEl) {
        rallyPreviewEl.hidden = false;
        setTimeout(() => {
          rallyPreviewEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      if (rallyPreviewCount) rallyPreviewCount.textContent = currentGeneratedRallies.length;

      if (rallyPreviewList) {
        rallyPreviewList.replaceChildren(...currentGeneratedRallies.map((item) => {
          const div = document.createElement("div");
          div.className = "preview-card-item";
          div.style.marginBottom = "10px";
          div.style.padding = "10px 12px";
          div.style.background = "var(--surface)";
          div.style.border = "1px solid var(--border)";
          div.style.borderRadius = "10px";
          div.innerHTML = `
            <div style="font-size:0.75rem; color:var(--accent); font-weight:700; margin-bottom:4px;">
              ${item.partner?.avatar || "🧑‍💼"} ${item.partner?.name || "Partner"}「${item.partner?.en || ""}」
            </div>
            <div style="font-size:0.82rem; font-weight:700; color:var(--text); margin-bottom:2px;">
              🎯 ${item.mission?.prompt || item.ja}
            </div>
            <div style="font-size:0.85rem; color:#2563eb; font-weight:700;">
              ↳ 模範返答: ${item.en}
            </div>
          `;
          return div;
        }));
      }
    } catch (err) {
      if (rallyLoadingEl) rallyLoadingEl.hidden = true;
      console.error("Rally generation error:", err);
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = `⚠️ 生成エラー: ${err.message}`;
      } else {
        alert(`生成エラー: ${err.message}`);
      }
    } finally {
      rallyGenerateBtn.disabled = false;
      rallyGenerateBtn.innerHTML = `<svg class="ui-icon" aria-hidden="true"><use href="#icon-sparkle"></use></svg> ラリーシナリオを生成する（5問）`;
    }
  });

  rallyCancelBtn?.addEventListener("click", () => {
    if (rallyPreviewEl) rallyPreviewEl.hidden = true;
    currentGeneratedRallies = [];
  });

  rallySaveBtn?.addEventListener("click", () => {
    if (!currentGeneratedRallies.length) return;
    state.customRallies = state.customRallies || [];
    state.customRallies.push(...currentGeneratedRallies);
    save();
    rallyAiDialog?.close();
    showToast(`🥊 ${currentGeneratedRallies.length}問のラリーを登録しました！`);
    startSession({ type: "rally" });
  });

  const rallyCountEl = $("#rally-preset-count");
  if (rallyCountEl && window.RALLY_PRESETS) {
    rallyCountEl.textContent = window.RALLY_PRESETS.length;
  }

  updateBrandSub();
  updateCourseSwitchUI();
  checkAchievements(false);
  checkStreakShield();
  checkShieldReward();
  checkPwaInstallBanner();
  initSwipeCard();
  showView("home");
})();
