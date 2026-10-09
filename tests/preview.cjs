const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const base = pathToFileURL(path.join(root, 'index.html')).href;
const output = path.join(root, '.preview', 'screenshots');
const layouts = ['classic', 'sidebar'];
const widths = [390, 772, 1440];
const languages = ['en', 'zh'];

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.classList.contains('js'));
  await page.locator('main img').evaluateAll(images => images.forEach(img => { img.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(img => img.complete && img.naturalWidth > 0));
  await page.evaluate(() => document.fonts.ready);
}

async function checkGeometry(page) {
  const result = await page.evaluate(() => {
    const problems = [];
    if (document.documentElement.scrollWidth > innerWidth) problems.push('page overflow');
    for (const node of document.querySelectorAll('main h1, main h2, main h3, main p, .contact-links, .paper-links, .news-list li, .nav, .language-switch')) {
      const rect = node.getBoundingClientRect();
      if (rect.width && (rect.left < -1 || rect.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 1)) problems.push(`overflow: ${node.className || node.tagName}`);
    }
    for (const article of document.querySelectorAll('.publication')) {
      const image = article.querySelector('.paper-thumb').getBoundingClientRect();
      const body = article.querySelector('.paper-body').getBoundingClientRect();
      const overlap = Math.min(image.right, body.right) - Math.max(image.left, body.left) > 1 && Math.min(image.bottom, body.bottom) - Math.max(image.top, body.top) > 1;
      if (overlap) problems.push(`overlap: ${article.id}`);
      const img = article.querySelector('img');
      if (getComputedStyle(img).objectFit !== 'contain') problems.push(`cropped: ${article.id}`);
    }
    return problems;
  });
  assert.deepEqual(result, []);
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL });
  let count = 0;
  try {
    for (const layout of layouts) {
      for (const width of widths) {
        for (const language of languages) {
          const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          page.on('requestfailed', request => errors.push(request.url()));
          await page.goto(`${base}?layout=${layout}&lang=${language}`);
          await ready(page);
          assert.equal(await page.locator('html').getAttribute('data-layout'), layout);
          assert.equal(await page.locator('html').getAttribute('lang'), language === 'zh' ? 'zh-CN' : 'en');
          assert.equal(await page.locator('.publication').count(), 4);
          assert.equal(await page.locator('.news-list li').count(), 6);
          assert.equal(await page.locator('.contact-links svg').count(), 3);
          assert.equal(await page.locator('a[href^="papers/"], a[href^="tel:"], a[href*="resume.pdf"]').count(), 0);
          const titles = await page.locator('.publication h3').allTextContents();
          assert(titles[0].startsWith('AnyAmber: A Generalist'));
          assert.equal(await page.locator('#anyamber .paper-links a').first().getAttribute('href'), 'https://roboticsproceedings.org/rss22/p168.pdf');
          assert.equal(await page.locator('#anyamber img').getAttribute('src'), 'assets/anyamber-experiment.gif');
          await checkGeometry(page);
          const name = `${layout}-${language}-${width}`;
          await page.screenshot({ path: path.join(output, `${name}.png`) });
          await page.screenshot({ path: path.join(output, `${name}-full.png`), fullPage: true });

          for (const figure of await page.locator('.paper-thumb').all()) {
            await figure.click();
            assert.equal(await page.locator('dialog').evaluate(node => node.open), true);
            await page.locator('#figure-image').evaluate(img => img.decode());
            assert(await page.locator('#original-image').getAttribute('href'));
            await page.locator('#zoom-figure').click();
            assert.equal(await page.locator('#zoom-figure').getAttribute('aria-pressed'), 'true');
            const zoom = await page.locator('#figure-image').evaluate(img => ({ width: img.getBoundingClientRect().width, natural: img.naturalWidth }));
            assert.equal(zoom.width, zoom.natural);
            if (language === 'zh' && width === 390 && await figure.getAttribute('data-figure') === 'anyamber') {
              await page.screenshot({ path: path.join(output, `${name}-zoom.png`) });
            }
            await page.keyboard.press('Escape');
            await page.waitForFunction(() => !document.querySelector('dialog').open);
            assert.equal(await figure.evaluate(node => document.activeElement === node), true);
          }
          await page.locator('.nav a[href="#publications"]').click();
          const headingTop = await page.locator('#publications').evaluate(node => node.getBoundingClientRect().top);
          const headerBottom = await page.locator('.site-header').evaluate(node => node.getBoundingClientRect().bottom);
          assert(headingTop >= headerBottom, 'anchor is hidden by header');

          await page.locator('#nrio').evaluate(node => window.scrollTo(0, node.getBoundingClientRect().top + scrollY - 140));
          const offset = await page.locator('#nrio').evaluate(node => node.getBoundingClientRect().top);
          const other = language === 'en' ? 'zh' : 'en';
          const languageButton = await page.locator(`[data-language="${other}"]`).boundingBox();
          // Locator auto-scrolling changes the reading position before a sticky-header click.
          await page.mouse.click(languageButton.x + languageButton.width / 2, languageButton.y + languageButton.height / 2);
          assert.equal(await page.locator('html').getAttribute('lang'), other === 'zh' ? 'zh-CN' : 'en');
          assert.deepEqual(await page.locator('.publication h3').allTextContents(), titles);
          const newOffset = await page.locator('#nrio').evaluate(node => node.getBoundingClientRect().top);
          assert(Math.abs(newOffset - offset) < 3, `reading position moved: ${offset} -> ${newOffset}`);
          assert(page.url().includes(`layout=${layout}`) && page.url().includes(`lang=${other}`));
          await page.reload();
          await ready(page);
          assert.equal(await page.locator('html').getAttribute('lang'), other === 'zh' ? 'zh-CN' : 'en');
          await page.goto(`${base}?layout=${layout}`);
          await ready(page);
          assert.equal(await page.locator('html').getAttribute('lang'), other === 'zh' ? 'zh-CN' : 'en');
          await page.locator('.nav a[href="#news"]').click();
          await page.waitForFunction(() => document.querySelector('.nav a[href="#news"]').getAttribute('aria-current') === 'location');
          assert(await page.locator('#news-heading').isVisible());
          assert.deepEqual(errors, []);
          await context.close();
          count++;
          console.log(`PASS ${name}: layout, images, links, language, dialogs, anchors`);
        }
      }
    }

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(base);
    await ready(page);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('data-layout'), 'classic');
    const animation = page.locator('#anyamber img');
    await animation.scrollIntoViewIfNeeded();
    await animation.evaluate(img => img.decode());
    const firstFrame = await animation.screenshot({ path: path.join(output, 'anyamber-motion-1.png') });
    await page.waitForTimeout(1000);
    const secondFrame = await animation.screenshot({ path: path.join(output, 'anyamber-motion-2.png') });
    assert.notDeepEqual(firstFrame, secondFrame, 'experiment GIF is not animating');
    await page.goto(`${base}?layout=unknown&lang=unknown`);
    await ready(page);
    assert.equal(await page.locator('html').getAttribute('data-layout'), 'classic');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await context.close();

    const noStorage = await browser.newContext();
    await noStorage.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
    });
    const blockedPage = await noStorage.newPage();
    await blockedPage.goto(`${base}?layout=sidebar&lang=zh`);
    await ready(blockedPage);
    await blockedPage.locator('[data-language="en"]').click();
    assert.equal(await blockedPage.locator('html').getAttribute('lang'), 'en');
    await noStorage.close();

    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const fallback = await noJs.newPage();
    await fallback.goto(base);
    assert.equal(await fallback.locator('.publication').count(), 4);
    assert.equal(await fallback.locator('html').getAttribute('lang'), 'en');
    assert.equal(await fallback.locator('.language-switch').isVisible(), false);
    assert((await fallback.locator('.paper-thumb').first().getAttribute('href')).endsWith('.gif'));
    await noJs.close();

    const galleryPath = path.join(root, '.preview', 'index.html');
    if (await fs.access(galleryPath).then(() => true, () => false)) {
      const galleryPage = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
      await galleryPage.goto(pathToFileURL(galleryPath).href);
      await galleryPage.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      await galleryPage.screenshot({ path: path.join(output, 'comparison.png'), fullPage: true });
      await galleryPage.close();
    }

    await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify({ passed: count, viewports: widths, languages, layouts, checks: ['overflow', 'image loading', 'image containment', 'GIF playback', 'classic default', 'language persistence', 'URL overrides', 'reading position', 'dialog and Escape', 'focus restoration', 'anchor offsets', 'no local PDF or private links', 'no-JS fallback', 'blocked storage'] }, null, 2));
    console.log(`PASS ${count} layout/language/viewport combinations plus fallback checks.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
