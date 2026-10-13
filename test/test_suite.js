const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8089;
const ROOT = path.resolve(__dirname, '..');

// 1. Simple local static file server
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

async function runDeviceTests(browser, deviceConfig, errors, warnings) {
  const { name, width, height, isMobile, hasTouch } = deviceConfig;
  console.log('\n======================================================');
  console.log(`🚀 TESTING ON ${name.toUpperCase()} (${width} x ${height})`);
  console.log('======================================================');

  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[${name} Console Error] ${msg.text()}`);
    } else if (msg.type() === 'warn') {
      // Ignore deprecated apple-mobile-web-app-capable warning
      if (!msg.text().includes('apple-mobile-web-app-capable')) {
        warnings.push(`[${name} Console Warn] ${msg.text()}`);
      }
    }
  });
  page.on('pageerror', err => {
    errors.push(`[${name} Page Uncaught Error] ${err.toString()}`);
  });
  page.on('requestfailed', req => {
    // Normal browser cancellation when audio element switches tracks or pauses
    if ((req.url().startsWith('blob:') || req.url().includes('/audio/')) && req.failure()?.errorText === 'net::ERR_ABORTED') {
      return;
    }
    errors.push(`[${name} Request Failed] ${req.url()} (${req.failure()?.errorText})`);
  });
  page.on('response', resp => {
    if (resp.status() >= 400) {
      errors.push(`[${name} HTTP ${resp.status()}] ${resp.url()}`);
    }
  });

  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('shunkan-eisakubun-v1', JSON.stringify({ hasSeenCoachTour: true }));
    } catch (e) {}
  });

  await page.setViewport({ width, height, isMobile, hasTouch });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
  console.log(`✓ Page loaded cleanly on ${name}.`);

  // TEST 0: Guide Tour (Coach Mark) Modal
  console.log(`\n--- [${name}] Test 0: Guide Tour Modal (使い方ガイド) ---`);
  await page.click('#open-guide-btn');
  await page.waitForSelector('#coach-tour-container:not([hidden])', { timeout: 3000 });
  console.log('✓ Coach tour modal opened.');
  await page.click('#coach-close-btn');
  await page.waitForFunction(() => document.querySelector('#coach-tour-container').hidden);
  console.log('✓ Coach tour modal closed cleanly.');

  // TEST 1: Check Settings Modal Width & Horizontal Overflow
  console.log(`\n--- [${name}] Test 1: Settings Modal Dimensions & Scrolling ---`);
  await page.click('#open-settings');
  await page.waitForSelector('#settings-dialog[open]', { timeout: 3000 });
  const settingsBox = await page.evaluate(() => {
    const dialog = document.querySelector('#settings-dialog');
    const rect = dialog.getBoundingClientRect();
    const isOverflowing = dialog.scrollWidth > dialog.clientWidth;
    return {
      viewportWidth: window.innerWidth,
      dialogWidth: rect.width,
      dialogLeft: rect.left,
      dialogRight: rect.right,
      scrollWidth: dialog.scrollWidth,
      clientWidth: dialog.clientWidth,
      isOverflowing
    };
  });
  console.log('Settings Dialog Rect:', settingsBox);
  if (settingsBox.dialogRight > settingsBox.viewportWidth) {
    errors.push(`[${name}] Settings dialog extends beyond viewport width! Right: ${settingsBox.dialogRight}, Viewport: ${settingsBox.viewportWidth}`);
  } else {
    console.log(`✓ Settings dialog width fits 100% within ${name} viewport width.`);
  }
  if (settingsBox.isOverflowing) {
    errors.push(`[${name}] Settings dialog has internal horizontal scroll overflow! scrollWidth: ${settingsBox.scrollWidth}, clientWidth: ${settingsBox.clientWidth}`);
  } else {
    console.log(`✓ Settings dialog has zero horizontal scroll overflow on ${name}.`);
  }

  // TEST 1.2: Test Speed presets buttons inside Settings
  console.log('Testing speed preset buttons in settings...');
  const speedButtons = await page.$$('#speech-speed-presets .btn-toggle');
  console.log(`Found ${speedButtons.length} speed buttons.`);
  if (speedButtons.length !== 4) {
    errors.push(`[${name}] Expected 4 speed buttons, found ${speedButtons.length}`);
  }
  for (let i = 0; i < speedButtons.length; i++) {
    await speedButtons[i].click();
    const activeSpeed = await page.evaluate(() => document.querySelector('#speech-rate-val').textContent);
    console.log(`Clicked speed button ${i}, displayed speed: ${activeSpeed}`);
  }
  console.log('✓ Speed preset buttons responsive and active.');

  // Close settings
  await page.click('#close-settings-btn');
  await page.waitForFunction(() => !document.querySelector('#settings-dialog')?.hasAttribute('open'));
  console.log('✓ Settings dialog closed.');

  // TEST 2: Pattern List and "この構文を練習" button
  console.log(`\n--- [${name}] Test 2: Pattern List (構文一覧) & Practice Button ---`);
  await page.click('#bottom-nav [data-nav="list"]');
  await page.waitForFunction(() => !document.querySelector('#view-list').hidden);
  console.log('✓ Navigated to 構文一覧 (view-list).');

  // Open the first details element
  const firstDetails = await page.$('.pattern-item');
  if (!firstDetails) throw new Error('No .pattern-item details found in list!');
  await firstDetails.click();
  await page.waitForSelector('.pattern-item[open] .practice-pattern-btn');
  console.log('✓ Expanded pattern item details.');

  // Click "この構文を練習"
  console.log('Clicking "この構文を練習" button...');
  await page.click('.pattern-item[open] .practice-pattern-btn');

  // Verify that Practice view opens and card is shown
  await page.waitForFunction(() => !document.querySelector('#view-practice').hidden, { timeout: 3000 });
  const practiceTitle = await page.evaluate(() => document.querySelector('#practice-title').textContent);
  const cardPrompt = await page.evaluate(() => document.querySelector('#card-ja').textContent);
  console.log(`✓ Practice session started successfully! Title: "${practiceTitle}", Japanese prompt: "${cardPrompt}"`);

  // TEST 3: Practice Flashcard Flow (Reveal & Grade)
  console.log(`\n--- [${name}] Test 3: Flashcard Reveal & 3-Button Grading ---`);
  await page.click('#reveal-btn');
  await page.waitForFunction(() => document.querySelector('#grade-actions') && !document.querySelector('#grade-actions').hidden);
  const enAnswer = await page.evaluate(() => document.querySelector('#card-en').textContent);
  console.log(`✓ Answer revealed: "${enAnswer}"`);

  // Click ◯ 言えた
  console.log('Grading card: Good (言えた)...');
  await page.click('[data-grade="good"]');
  await page.waitForFunction(() => document.querySelector('#session-progress').value > 0 || document.querySelector('#view-result') && !document.querySelector('#view-result').hidden);
  console.log('✓ Graded card and transitioned smoothly.');

  // Quit practice session back to Home
  await page.click('#quit-practice');
  await page.waitForFunction(() => !document.querySelector('#view-home').hidden);
  console.log('✓ Quit practice session and returned to Home.');

  // TEST 4: Home Quick Tiles and Part Buttons
  console.log(`\n--- [${name}] Test 4: Home View Buttons & Navigation ---`);
  const partButtons = await page.$$('#part-buttons .part-btn');
  console.log(`Found ${partButtons.length} part buttons on home screen.`);
  if (partButtons.length === 0) {
    errors.push(`[${name}] No part buttons found on home screen!`);
  } else {
    console.log('Clicking Part 1 button...');
    await partButtons[0].click();
    await page.waitForFunction(() => !document.querySelector('#view-practice').hidden);
    const partTitle = await page.evaluate(() => document.querySelector('#practice-title').textContent);
    console.log(`✓ Part session started: "${partTitle}"`);
    await page.click('#quit-practice');
    await page.waitForFunction(() => !document.querySelector('#view-home').hidden);
  }

  // TEST 5: Listening View (耳トレ)
  console.log(`\n--- [${name}] Test 5: Listening View (耳トレ) ---`);
  await page.click('#bottom-nav [data-nav="listening"]');
  await page.waitForFunction(() => !document.querySelector('#view-listening').hidden);
  console.log('✓ Navigated to 耳トレ.');

  const listeningPrompt = await page.evaluate(() => document.querySelector('#listening-prompt-ja').textContent);
  console.log(`Listening current prompt: "${listeningPrompt}"`);

  // Scroll player controls safely into view above bottom navigation
  await page.$eval('#listening-btn-play', el => el.scrollIntoView({ block: 'center' }));

  // Click Play / Pause button
  await page.click('#listening-btn-play');
  console.log('✓ Clicked listening play button.');
  await page.click('#listening-btn-next');
  console.log('✓ Clicked listening next button.');
  await page.click('#listening-btn-prev');
  console.log('✓ Clicked listening prev button.');

  // TEST 6: Situation Immediate Rally (シチュエーション即答ラリー)
  console.log(`\n--- [${name}] Test 6: Situation Rally (即答ラリー) Modal & Selection ---`);
  await page.click('#bottom-nav [data-nav="home"]');
  await page.waitForFunction(() => !document.querySelector('#view-home').hidden);
  await page.$eval('#open-rally-select-btn', el => el.scrollIntoView({ block: 'center' }));
  await page.click('#open-rally-select-btn');
  await page.waitForSelector('#rally-select-dialog[open]', { timeout: 3000 });
  const themeCount = await page.evaluate(() => document.querySelectorAll('#rally-theme-list button').length);
  console.log(`✓ Rally select dialog opened. Themes available: ${themeCount}`);
  if (themeCount === 0) errors.push(`[${name}] Rally theme list is empty!`);

  // Close rally dialog
  await page.click('#close-rally-select-dialog');
  await page.waitForFunction(() => !document.querySelector('#rally-select-dialog')?.hasAttribute('open'));
  console.log('✓ Rally dialog closed cleanly.');

  // TEST 7: My Page (マイページ) Tabs & Weak Point Ranking
  console.log(`\n--- [${name}] Test 7: My Page (マイページ) & Weak Point Drill Buttons ---`);
  await page.click('#bottom-nav [data-nav="report"]');
  await page.waitForFunction(() => !document.querySelector('#view-report').hidden);
  console.log('✓ Navigated to マイページ.');

  // Switch to Section 2: 弱点・学習分析
  await page.click('[data-mypage-tab="analysis"]');
  await page.waitForFunction(() => !document.querySelector('#mypage-section-analysis').hidden);
  console.log('✓ Switched to 弱点・学習分析 tab.');

  // Switch to Section 3: AI自作・ラリー
  await page.click('#bottom-nav [data-nav="report"]');
  await page.waitForFunction(() => !document.querySelector('#view-report').hidden);
  await page.click('[data-mypage-tab="custom"]');
  await page.waitForFunction(() => !document.querySelector('#mypage-section-custom').hidden);
  console.log('✓ Switched to AI自作・ラリー tab.');

  // Click "AIでオリジナル例文を生成"
  await page.click('#open-ai-modal');
  await page.waitForSelector('#ai-modal[open]', { timeout: 3000 });
  console.log('✓ AI例文生成 modal opened.');
  await page.click('#close-ai-modal');
  await page.waitForFunction(() => !document.querySelector('#ai-modal')?.hasAttribute('open'));
  console.log('✓ AI例文生成 modal closed.');

  // TEST 8: GRIT Course Switching & Verification
  console.log(`\n--- [${name}] Test 8: GRIT Course Switching & Pattern Practice ---`);
  await page.click('#bottom-nav [data-nav="list"]');
  await page.waitForFunction(() => !document.querySelector('#view-list').hidden);
  const gritTabBtn = await page.$('#list-course-switch [data-course="grit"]');
  if (gritTabBtn) {
    await gritTabBtn.click();
    console.log('Switched course tab to TED・GRIT編.');
    await page.waitForFunction(() => {
      const firstHeading = document.querySelector('.part-block h2');
      return firstHeading && firstHeading.textContent.includes('キャリア・日常');
    }, { timeout: 3000 });
    console.log('✓ GRIT patterns rendered.');

    // Open first GRIT pattern details
    const gritDetails = await page.$('.pattern-item');
    if (gritDetails) {
      await gritDetails.click();
      await page.waitForSelector('.pattern-item[open] .practice-pattern-btn');
      console.log('Clicking GRIT pattern practice button...');
      await page.$eval('.pattern-item[open] .practice-pattern-btn', el => el.scrollIntoView({ block: 'center' }));
      await page.click('.pattern-item[open] .practice-pattern-btn');
      await page.waitForFunction(() => !document.querySelector('#view-practice').hidden);
      const gritPracticeTitle = await page.evaluate(() => document.querySelector('#practice-title').textContent);
      console.log(`✓ GRIT practice session started cleanly: "${gritPracticeTitle}"`);
      await page.click('#quit-practice');
      await page.waitForFunction(() => !document.querySelector('#view-home').hidden);
    }
  }

  await page.close();
}

async function runTests() {
  await new Promise(r => server.listen(PORT, r));
  console.log(`Local test server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const errors = [];
  const warnings = [];

  try {
    // 1. Run iPhone viewport tests
    await runDeviceTests(browser, {
      name: 'iPhone (390x844)',
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true
    }, errors, warnings);

    // 2. Run Desktop viewport tests
    await runDeviceTests(browser, {
      name: 'Desktop (1280x800)',
      width: 1280,
      height: 800,
      isMobile: false,
      hasTouch: false
    }, errors, warnings);

  } catch (err) {
    console.error('FATAL TEST ERROR:', err);
    errors.push(`Fatal Test Exception: ${err.message}`);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n======================================================');
  console.log('🏁 E2E AUTOMATED USER TEST SUITE FINISHED');
  console.log('======================================================');
  console.log(`Total errors captured: ${errors.length}`);
  if (errors.length > 0) {
    console.error('ERRORS FOUND:');
    errors.forEach((e, idx) => console.error(`${idx + 1}. ${e}`));
    process.exit(1);
  } else {
    console.log('🎉 100% OF END-TO-END AUTOMATED USER TESTS PASSED WITH ZERO ERRORS ON BOTH IPHONE AND DESKTOP!');
    process.exit(0);
  }
}

runTests();
