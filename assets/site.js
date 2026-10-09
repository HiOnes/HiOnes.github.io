(() => {
  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const storageKey = 'si-wang-language';
  const supportedLanguages = ['en', 'zh'];
  const zh = {
    skip: '跳至正文', navigation: '主要导航', language: '语言',
    biography: '个人简介', publications: '学术论文', news: '最新动态',
    affiliation: '浙江大学 · 控制科学与工程博士生',
    contact: '联系方式与学术主页', email: '邮箱', portrait: '王斯的照片',
    bioEducation: '我是浙江大学控制科学与工程学院博士生，导师为<a href="https://ywang-zju.github.io/" target="_blank" rel="noreferrer">王越</a>教授和<a href="https://person.zju.edu.cn/en/rongxiong" target="_blank" rel="noreferrer">熊蓉</a>教授。',
    bioResearch: '我的研究兴趣包括机器人、感知、定位与世界模型，主要研究面向真实环境机器人的学习式定位与多传感器融合方法。',
    summaryAnyamber: '面向匿名方位与距离观测的通用神经定位框架，适用于不同机器人数量、锚点配置、UWB 布局与观测条件。',
    summaryNrio: '融合 UWB 测距与惯性里程计的神经网络框架，适用于复杂环境、灵活的锚点或标签布局，以及稀疏测距约束。',
    summaryVirgil: '端到端多机器人视觉与测距融合相对定位框架，将图神经网络数据关联与可微位姿图优化相结合。',
    summarySparse: '通过稀疏层次化激光雷达束调整，实现多机器人系统中高精度、低延迟的协同定位与建图。',
    proceedings: '官方论文集', code: '代码',
    newsPublished: '<strong>AnyAmber</strong> 正式发表于 RSS 2026 会议论文集。<a href="https://roboticsproceedings.org/rss22/p168.html" target="_blank" rel="noreferrer">论文页面</a>',
    newsRss: '<strong>AnyAmber</strong> 被 Robotics: Science and Systems（RSS 2026）录用。',
    newsIros: '<strong>Mr. Virgil</strong> 被 IEEE/RSJ 智能机器人与系统国际会议（IROS 2025）录用。',
    newsRal: '<strong>Sparse Hierarchical LiDAR Bundle Adjustment</strong> 刊载于 IEEE Robotics and Automation Letters（RA-L 2025）六月刊。',
    newsIcra: '<strong>Neural Ranging Inertial Odometry</strong> 被 IEEE 机器人与自动化国际会议（ICRA 2025）录用。',
    newsRobocup: '<strong>ZJUNlict</strong> 获得 RoboCup 2023 小型组中国赛冠军、世界赛亚军。',
    footer: '© 2026 王斯 Si Wang。更新于 2026 年 10 月。',
    zoomAnyamber: '放大查看 AnyAmber 实验动图', zoomNrio: '放大查看 Neural Ranging Inertial Odometry 框架图',
    zoomVirgil: '放大查看 Mr. Virgil 框架图', zoomSparse: '放大查看稀疏层次化激光雷达束调整框架图',
    altAnyamber: 'AnyAmber 在仿真与真实机器人定位场景中的实验动态演示',
    altNrio: 'Neural Ranging Inertial Odometry 的惯性网络与 UWB 网络框架',
    altVirgil: 'Mr. Virgil 的图网络数据关联与位姿优化框架',
    altSparse: '多机器人稀疏层次化激光雷达束调整系统概览',
    original: '打开原图', close: '关闭图片', actual: '原始尺寸',
    title: '王斯 Si Wang | 浙江大学',
    description: '王斯，浙江大学控制科学与工程学院博士生。研究方向：机器人、感知、定位与世界模型。'
  };
  const en = {
    title: document.title,
    description: document.querySelector('meta[name="description"]').content
  };
  const translatedNodes = [...document.querySelectorAll('[data-i18n]')];
  const attributes = ['aria-label', 'alt', 'title'];
  const dataAttributes = ['data-i18n-aria', 'data-i18n-alt', 'data-i18n-title'];
  translatedNodes.forEach(node => { en[node.dataset.i18n] = node.innerHTML; });
  dataAttributes.forEach((attribute, index) => {
    document.querySelectorAll(`[${attribute}]`).forEach(node => {
      en[node.getAttribute(attribute)] = node.getAttribute(attributes[index]);
    });
  });

  const header = document.querySelector('.site-header');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  let headerHeight = header.getBoundingClientRect().height;
  function updateHeaderHeight() {
    headerHeight = header.getBoundingClientRect().height;
    root.style.setProperty('--header-height', `${headerHeight}px`);
  }
  function readingPosition() {
    if (window.scrollY < 20) return null;
    // Keep the visible paper or news item anchored when translated text changes height.
    const candidates = [...document.querySelectorAll('.biography, .publication, .news-list li')];
    const visible = candidates.filter(node => node.getBoundingClientRect().bottom > headerHeight + 24);
    const element = visible.sort((a, b) => Math.abs(a.getBoundingClientRect().top - headerHeight - 24) - Math.abs(b.getBoundingClientRect().top - headerHeight - 24))[0];
    return element ? { element, offset: element.getBoundingClientRect().top } : null;
  }
  function updateActiveSection() {
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2;
    const active = atBottom ? sections[sections.length - 1] : [...sections].reverse().find(section => section.getBoundingClientRect().top <= headerHeight + 50) || sections[0];
    navLinks.forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function setLanguage(next, persist = false) {
    const position = persist ? readingPosition() : null;
    const language = supportedLanguages.includes(next) ? next : 'en';
    const strings = language === 'zh' ? zh : en;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    translatedNodes.forEach(node => {
      // Both dictionaries are authored locally; URL parameters are never inserted as HTML.
      node.innerHTML = strings[node.dataset.i18n] ?? en[node.dataset.i18n];
    });
    dataAttributes.forEach((attribute, index) => {
      document.querySelectorAll(`[${attribute}]`).forEach(node => {
        const key = node.getAttribute(attribute);
        node.setAttribute(attributes[index], strings[key] ?? en[key]);
      });
    });
    document.title = strings.title;
    document.querySelector('meta[name="description"]').content = strings.description;
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    updateHeaderHeight();
    if (persist) {
      try { localStorage.setItem(storageKey, language); } catch { /* Storage is optional. */ }
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      try { history.replaceState(null, '', url); } catch { /* Some file viewers restrict history. */ }
      if (position) window.scrollBy(0, position.element.getBoundingClientRect().top - position.offset);
    }
    updateActiveSection();
  }

  let savedLanguage;
  try { savedLanguage = localStorage.getItem(storageKey); } catch { /* Default to English. */ }
  const requestedLanguage = params.get('lang');
  const initialLanguage = supportedLanguages.includes(requestedLanguage) ? requestedLanguage : savedLanguage;
  setLanguage(initialLanguage);
  if (supportedLanguages.includes(requestedLanguage)) {
    try { localStorage.setItem(storageKey, requestedLanguage); } catch { /* Storage is optional. */ }
  }
  root.classList.add('js');
  if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.7 });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language, true));
  });
  if (window.ResizeObserver) new ResizeObserver(updateHeaderHeight).observe(header);
  window.addEventListener('scroll', updateActiveSection, { passive: true });

  // Account for layout changes before positioning an initial section link.
  function alignInitialAnchor() {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
    updateActiveSection();
  }
  if (document.readyState === 'complete') alignInitialAnchor();
  else window.addEventListener('load', alignInitialAnchor, { once: true });

  const dialog = document.querySelector('.figure-dialog');
  const dialogImage = document.getElementById('figure-image');
  let lastTrigger = null;
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-figure]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        lastTrigger = link;
        const sourceImage = link.querySelector('img');
        dialogImage.src = sourceImage.src;
        dialogImage.alt = sourceImage.alt;
        dialogImage.style.setProperty('--natural-width', `${sourceImage.naturalWidth}px`);
        dialog.classList.remove('is-zoomed');
        document.getElementById('zoom-figure').setAttribute('aria-pressed', 'false');
        document.getElementById('figure-caption').textContent = link.closest('article').querySelector('h3').textContent;
        document.getElementById('original-image').href = sourceImage.src;
        dialog.showModal();
        document.body.classList.add('figure-open');
        document.getElementById('close-figure').focus();
      });
    });
    document.getElementById('close-figure').addEventListener('click', () => dialog.close());
    document.getElementById('zoom-figure').addEventListener('click', event => {
      const zoomed = dialog.classList.toggle('is-zoomed');
      event.currentTarget.setAttribute('aria-pressed', String(zoomed));
      const stage = dialog.querySelector('.figure-stage');
      stage.scrollTo(0, 0);
    });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('figure-open');
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    });
  }
})();
