'use strict';

/*
 * Medeiros portfolio runtime.
 * The page is a small dependency-free SPA: every route is rendered from the
 * centralized data files, so adding a project does not require new HTML.
 */

/* Se os arquivos de dados não carregarem, mostra um aviso claro em vez de travar. */
if (!window.MEDEIROS_I18N || !window.MEDEIROS_SITE) {
  const appRoot = document.getElementById('app');
  if (appRoot) {
    appRoot.innerHTML = '<div class="view not-found"><h1>Faltam arquivos do site</h1><p class="page-lede">Não consegui carregar data/i18n.js ou data/site.js. Confira se esses arquivos estão na pasta data do GitHub e recarregue a página.</p></div>';
  }
  window.__medeirosReady = 'missing-data';
  throw new Error('Medeiros: arquivos de dados ausentes (data/i18n.js, data/site.js)');
}

const SITE = window.MEDEIROS_SITE;
const I18N = window.MEDEIROS_I18N;
const ALL_PRODUCTS = (window.MEDEIROS_PRODUCTS || []).filter((product) => product && product.id !== 'meu-bot' && product.name !== 'Nome do Bot');
const PROJECTS = ALL_PRODUCTS.filter((product) => product.brand !== 'discord');
const DISCORD_PRODUCTS = ALL_PRODUCTS.filter((product) => product.brand === 'discord');
const DISCORD_SERVER_URL = SITE?.contact?.discordServer || 'https://discord.gg/Unbx6TpXwa';
const GITHUB_PROFILE_URL = (/^https:\/\/github\.com\/[^/]+\/?$/.test(SITE?.contact?.github || '') ? SITE.contact.github : 'https://github.com/smmezp').replace(/\/$/, '');
/* Três áreas, da esquerda para a direita: Minecraft | Início | Discord. */
const MODE_ORDER = ['minecraft', 'home', 'discord'];
const MODE_ROUTE = { minecraft: '/minecraft', home: '/', discord: '/discord' };
const STORAGE_LANG = 'medeiros-lang';
const STORAGE_THEME = 'medeiros-theme';
const app = document.getElementById('app');
const header = document.querySelector('[data-header]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const toast = document.querySelector('[data-toast]');
const lightbox = document.querySelector('[data-lightbox]');
const SITE_BASE_PATH = getSiteBasePath();

const FILTERS = ['All', ...getProjectCategories()];
const ICON_PATHS = {
  code: '<path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/><path d="m14 4-4 16"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  sliders: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  bot: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 7V4h8v3"/><path d="M8 13h.01M16 13h.01"/><path d="M9 17h6"/>',
  network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m10.6 7-4.2 8.7M13.4 7l4.2 8.7M7.8 18h8.4"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17a2.1 2.1 0 0 0 3 3l5.5-5.5a4 4 0 0 0 5.2-5.2l-2.2 2.2-2.5-.5-.5-2.5 2.2-2.2Z"/>',
  terminal: '<path d="m5 7 5 5-5 5"/><path d="M12 17h7"/>',
  spark: '<path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z"/><path d="m19 17 .5 2.5L22 20l-2.5.5L19 23l-.5-2.5L16 20l2.5-.5L19 17Z"/>',
  github: '<path d=\"M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21\"/>',
  shield: '<path d=\"M12 3 4 6v6c0 4.5 3.2 7.6 8 9 4.8-1.4 8-4.5 8-9V6l-8-3Z\"/><path d=\"m9 12 2 2 4-4\"/>',
  ticket: '<path d=\"M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3v3Z\"/><path d=\"M13 6v12\" stroke-dasharray=\"2 3\"/>',
  link: '<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1\"/><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1\"/>',
  users: '<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6\"/><path d=\"M16 5a3.5 3.5 0 0 1 0 6.5\"/><path d=\"M18 14.3c2.3.7 3.5 2.6 3.5 5.7\"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  external: '<path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>'
};

let activeFilter = 'All';
let activeSearch = '';
let activeGallery = [];
let activeGalleryIndex = 0;
let lastFocusedElement = null;
let toastTimer = null;
let lightboxCloseTimer = null;
let lightboxTouchStart = null;

let lang = readPref(STORAGE_LANG, ['pt', 'en'], 'pt');
let lastScrollY = 0;
let theme = readPref(STORAGE_THEME, ['light', 'dark'], preferredTheme());

function readPref(key, allowed, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch (error) {
    return fallback;
  }
}

function writePref(key, value) {
  try { window.localStorage.setItem(key, value); } catch (error) { /* storage can be blocked */ }
}

function preferredTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* t('grupo.chave') devolve o texto da interface no idioma atual. */
function t(key) {
  const read = (dictionary) => key.split('.').reduce((node, part) => (node ? node[part] : undefined), dictionary);
  const value = read(I18N[lang]);
  if (typeof value === 'string') return value;
  const fallback = read(I18N.en);
  return typeof fallback === 'string' ? fallback : key;
}

/* L(valor) escolhe o idioma de um conteúdo { pt, en } dos arquivos de dados. */
function L(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && ('pt' in value || 'en' in value)) {
    return value[lang] ?? value.en ?? value.pt;
  }
  return value;
}

function applyTheme(next, persist = true) {
  theme = next === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f1424' : '#f5f1e8');
  if (persist) writePref(STORAGE_THEME, theme);
}

function applyLanguage(next, persist = true, rerender = true) {
  lang = next === 'en' ? 'en' : 'pt';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  if (persist) writePref(STORAGE_LANG, lang);
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-title]').forEach((element) => { element.setAttribute('title', t(element.dataset.i18nTitle)); });
  document.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (menuToggle) menuToggle.setAttribute('aria-label', t(mobileNav.classList.contains('is-open') ? 'nav.closeMenu' : 'nav.openMenu'));
  if (rerender) renderRoute(false);
}


initialize();

function initialize() {
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  document.addEventListener('click', handleClick);
  setupSwipe();
  setupModeSwitchDrag();
  document.addEventListener('input', handleInput);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('error', handleAssetError, true);
  document.addEventListener('load', handleAssetLoad, true);
  document.addEventListener('touchstart', handleLightboxTouchStart, { passive: true });
  document.addEventListener('touchend', handleLightboxTouchEnd, { passive: true });
  window.addEventListener('popstate', () => renderRoute(false));
  window.addEventListener('scroll', handleScroll, { passive: true });
  syncDiscordLinks();
  syncGithubLinks();
  handleScroll();
  applyTheme(theme, false);
  applyLanguage(lang, false, false);
  renderRoute(false);
  window.__medeirosReady = '4';
}

function getSiteBasePath() {
  if (window.location.protocol === 'file:') return '';
  const baseElement = document.querySelector('base');
  const baseHref = baseElement?.getAttribute('href') || '/';
  try {
    const pathname = new URL(baseHref, window.location.href).pathname;
    return pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  } catch (error) {
    return '/';
  }
}

function stripSiteBasePath(path) {
  const normalized = normalizePath(path);
  if (!SITE_BASE_PATH || SITE_BASE_PATH === '/') return normalized;
  const baseWithoutSlash = SITE_BASE_PATH.replace(/\/+$/, '');
  if (normalized === baseWithoutSlash) return '/';
  if (normalized.startsWith(SITE_BASE_PATH)) return normalizePath(normalized.slice(SITE_BASE_PATH.length));
  return normalized;
}

function buildSitePath(pathname, query = '') {
  const normalized = stripSiteBasePath(pathname);
  const suffix = normalized === '/' ? '' : normalized.replace(/^\/+/, '');
  const base = SITE_BASE_PATH || '/';
  const path = base.endsWith('/') ? `${base}${suffix}` : `${base}/${suffix}`;
  return `${path || '/'}${query ? `?${query}` : ''}`;
}

function routeHref(path) {
  const [pathname, query = ''] = String(path || '/').split('?');
  if (window.location.protocol === 'file:') return path || '/';
  return buildSitePath(pathname, query);
}

function syncRouteLinks() {
  document.querySelectorAll('[data-route]').forEach((link) => {
    const href = link.getAttribute('href') || '/';
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return;
    const [pathname, query = ''] = href.split('?');
    link.setAttribute('href', routeHref(`${pathname || '/'}${query ? `?${query}` : ''}`));
  });
}

function getLocation() {
  if (window.location.protocol === 'file:') {
    const search = new URLSearchParams(window.location.search);
    const storedRoute = search.get('route') || '/';
    const split = storedRoute.split('?');
    return {
      pathname: normalizePath(split[0]),
      query: new URLSearchParams(split[1] || '')
    };
  }

  return {
    pathname: stripSiteBasePath(window.location.pathname),
    query: new URLSearchParams(window.location.search)
  };
}

function normalizePath(path) {
  if (!path || path === '/index.html') return '/';
  const withLeadingSlash = String(path).replace(/^\.\//, '/').replace(/^([^/])/, '/$1');
  const normalized = withLeadingSlash.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return normalized || '/';
}

/* Arrastar o dedo para o lado troca de área: direita = Discord, esquerda = Minecraft. */
function renderRoute(shouldScroll) {
  const location = getLocation();
  const path = location.pathname;
  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  const discordMatch = path.match(/^\/discord\/([^/]+)$/);
  let markup = '';
  let title = t('meta.defaultTitle');
  let description = t('meta.defaultDesc');
  let skin = 'main';

  if (path === '/') {
    markup = renderHub();
  } else if (path === '/minecraft') {
    markup = renderMinecraftHome();
    title = t('meta.mcTitle');
    description = t('meta.mcDesc');
  } else if (path === '/projects') {
    markup = renderProjects();
    title = t('meta.projectsTitle');
    description = t('meta.projectsDesc');
  } else if (projectMatch) {
    const project = PROJECTS.find((item) => item.slug === projectMatch[1]);
    if (project) {
      markup = renderProjectDetail(project);
      title = `${project.name} — Medeiros`;
      description = L(project.shortDescription);
    } else {
      markup = renderNotFound(t('notFound.project'), t('notFound.projectText'));
      title = t('meta.notFoundTitle');
    }
  } else if (path === '/services') {
    markup = renderServices();
    title = t('meta.servicesTitle');
    description = t('meta.servicesDesc');
  } else if (path === '/discord') {
    markup = renderDiscord();
    skin = 'discord';
    title = t('meta.discordTitle');
    description = t('meta.discordDesc');
  } else if (discordMatch) {
    const product = DISCORD_PRODUCTS.find((item) => item.slug === discordMatch[1]);
    skin = 'discord';
    if (product) {
      markup = renderProjectDetail(product, 'discord');
      title = `${product.name} — Medeiros`;
      description = L(product.shortDescription);
    } else {
      markup = renderNotFound(t('notFound.product'), t('notFound.productText'));
      title = t('meta.notFoundTitle');
    }
  } else if (path === '/about') {
    markup = renderAbout();
    title = t('meta.aboutTitle');
    description = t('meta.aboutDesc');
  } else if (path === '/contact') {
    markup = renderContact();
    title = t('meta.contactTitle');
    description = t('meta.contactDesc');
  } else {
    markup = renderNotFound(t('notFound.page'), t('notFound.pageText'));
    title = t('meta.notFoundTitle');
  }

  document.body.dataset.skin = skin;
  app.innerHTML = markup;
  document.title = title;
  updateMeta(title, description);
  updateActiveNavigation(path);
  syncRouteLinks();
  setupReveal();
  setupImageFrames();
  syncDiscordLinks();
  syncGithubLinks();

  if (path === '/contact') initializeContactForm(location.query);

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }
}

function updateMeta(title, description) {
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', description);
  if (ogTitle) ogTitle.setAttribute('content', title);
  if (ogDescription) ogDescription.setAttribute('content', description);
}

function syncGithubLinks() {
  document.querySelectorAll('[data-github-link]').forEach((link) => {
    link.href = GITHUB_PROFILE_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

function syncDiscordLinks() {
  document.querySelectorAll('[data-discord-link]').forEach((link) => {
    link.href = DISCORD_SERVER_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

function setupImageFrames() {
  document.querySelectorAll('[data-image-frame]').forEach((frame) => {
    const image = frame.querySelector('img[data-project-image]');
    if (!image) {
      frame.classList.add('is-image-missing');
      return;
    }
    frame.classList.add('is-image-loading');
    if (image.complete) {
      if (image.naturalWidth > 0) markImageLoaded(image);
    }
  });
}

function handleAssetLoad(event) {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  if (image.matches('[data-lightbox-image]')) {
    const placeholder = lightbox?.querySelector('[data-lightbox-placeholder]');
    image.hidden = false;
    if (placeholder) placeholder.hidden = true;
    return;
  }
  if (image.matches('[data-project-image]')) markImageLoaded(image);
}

function handleAssetError(event) {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  if (image.matches('[data-lightbox-image]')) {
    image.hidden = true;
    const placeholder = lightbox?.querySelector('[data-lightbox-placeholder]');
    if (placeholder) placeholder.hidden = false;
    return;
  }
  if (image.matches('[data-project-image]')) markImageMissing(image);
}

function markImageLoaded(image) {
  const frame = image.closest('[data-image-frame]');
  if (!frame) return;
  image.hidden = false;
  frame.classList.remove('is-image-loading', 'is-image-missing');
  frame.classList.add('is-image-loaded');
  const placeholder = frame.querySelector('[data-image-placeholder]');
  if (placeholder) placeholder.hidden = true;
}

function markImageMissing(image) {
  const frame = image.closest('[data-image-frame]');
  if (!frame) return;
  image.hidden = true;
  frame.classList.remove('is-image-loading', 'is-image-loaded');
  frame.classList.add('is-image-missing');
  const placeholder = frame.querySelector('[data-image-placeholder]');
  if (placeholder) placeholder.hidden = false;
}

function updateActiveNavigation(path) {
  const mode = modeOfPath(path);
  let active = mode;
  if (mode === 'home') active = path === '/about' ? 'about' : (path === '/contact' ? 'contact' : 'home');

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const isActive = link.dataset.navLink === active;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const switchEl = document.querySelector('[data-mode-switch]');
  if (switchEl) {
    switchEl.dataset.active = mode;
    switchEl.querySelectorAll('[data-mode]').forEach((option) => {
      option.classList.toggle('is-active', option.dataset.mode === mode);
      if (option.dataset.mode === mode) option.setAttribute('aria-current', 'page');
      else option.removeAttribute('aria-current');
    });
  }
}

function projectColor(project) {
  const palette = ['#55ffff', '#55ff55', '#ffaa00', '#ff77ff', '#7f9bff'];
  const index = Math.max(0, PROJECTS.indexOf(project));
  return palette[index % palette.length];
}

/* ------------------------------------------------------------------
 * Páginas. Todo texto passa por t() (interface) ou L() (conteúdo dos
 * arquivos de dados), então tudo troca entre português e inglês.
 * ------------------------------------------------------------------ */

function renderHub() {
  const released = PROJECTS.filter((project) => project.status === 'released');
  const thumbs = PROJECTS.slice(0, 3);
  return `
    <div class="view hub-view">
      <section class="hero hero-hub">
        <div class="hero-copy">
          <p class="status-pill"><i></i> ${t('common.open')}</p>
          <h1>${t('hub.h1a')} <span class="mark">${t('hub.h1b')}</span> ${t('hub.h1c')}</h1>
          <p class="lede">${t('hub.lede')}</p>
          <div class="button-row">
            <a class="button button-primary" href="/minecraft" data-route>${t('hub.ctaMinecraft')} ${icon('arrow')}</a>
            <a class="button button-discord" href="/discord" data-route>${t('hub.ctaDiscord')} ${icon('arrow')}</a>
          </div>
          <ul class="hero-facts">
            <li><strong>${released.length}</strong> ${t(released.length === 1 ? 'hub.factPlugin' : 'hub.factPlugins')}</li>
            <li><strong>${t('hub.factTestedA')}</strong> ${t('hub.factTestedB')}</li>
            <li><strong>${t('hub.factEasyA')}</strong> ${t('hub.factEasyB')}</li>
          </ul>
        </div>
        <div class="hub-doors">
          <a class="door door-minecraft" href="/minecraft" data-route>
            <div class="door-art" aria-hidden="true">
              ${thumbs.map((project, index) => `<span class="door-tile door-tile-${index + 1}"><span class="image-frame" data-image-frame>${renderProjectImage(project.images?.hero, project.name, { loading: 'eager' })}</span></span>`).join('')}
            </div>
            <div class="door-body">
              <span class="door-label">Minecraft</span>
              <h2>${t('hub.doorMinecraftTitle')}</h2>
              <p>${t('hub.doorMinecraftText')}</p>
              <span class="door-go">${t('hub.doorMinecraftGo')} ${icon('arrow')}</span>
            </div>
          </a>
          <a class="door door-discord" href="/discord" data-route>
            <div class="door-art door-art-discord" aria-hidden="true">
              <span class="dc-mini dc-mini-1"><i></i><b></b></span>
              <span class="dc-mini dc-mini-2"><i></i><b></b><em></em></span>
              <span class="dc-mini-command">/ticket</span>
            </div>
            <div class="door-body">
              <span class="door-label">Discord</span>
              <h2>${t('hub.doorDiscordTitle')}</h2>
              <p>${t('hub.doorDiscordText')}</p>
              <span class="door-go">${t('hub.doorDiscordGo')} ${icon('arrow')}</span>
            </div>
          </a>
        </div>
      </section>

      <section class="section reveal" id="process">
        <div class="section-head">
          <div><p class="eyebrow">${t('common.howItWorks')}</p><h2>${t('hub.processTitle')}</h2></div>
        </div>
        <div class="process-grid">${SITE.process.map(renderProcessStep).join('')}</div>
      </section>

      <section class="section reveal">
        <div class="github-card">
          <div class="github-mark">${icon('github')}</div>
          <div class="github-text">
            <h2>${t('hub.githubTitle')}</h2>
            <p>${t('hub.githubText')}</p>
            <span class="github-handle">github.com/${escapeHTML(SITE.contact.githubHandle)}</span>
          </div>
          <a class="button button-primary" href="${GITHUB_PROFILE_URL}" data-github-link target="_blank" rel="noopener noreferrer">${t('hub.githubCta')} ${icon('external')}</a>
        </div>
      </section>

      ${renderCtaPanel()}
    </div>
  `;
}

function renderMinecraftHome() {
  const released = PROJECTS.filter((project) => project.status === 'released');
  const collage = (released.length ? released : PROJECTS).slice(0, 3);
  return `
    <div class="view home-view">
      <section class="hero">
        <div class="hero-copy">
          <p class="status-pill"><i></i> ${t('common.open')}</p>
          <h1>${t('mc.h1a')} <span class="mark">${t('mc.h1b')}</span> ${t('mc.h1c')}</h1>
          <p class="lede">${t('mc.lede')}</p>
          <div class="button-row">
            <a class="button button-primary" href="/projects" data-route>${t('mc.ctaPlugins')} ${icon('arrow')}</a>
            ${renderDiscordLink(t('common.hire'), 'button button-ghost')}
          </div>
          <ul class="hero-facts">
            <li><strong>${released.length}</strong> ${t(released.length === 1 ? 'hub.factPlugin' : 'hub.factPlugins')}</li>
            <li><strong>${t('mc.factConfigA')}</strong> ${t('mc.factConfigB')}</li>
            <li><strong>${t('hub.factTestedA')}</strong> ${t('hub.factTestedB')}</li>
          </ul>
        </div>

        <div class="hero-collage" aria-label="${t('mc.collageLabel')}">
          <span class="pixel-cloud pixel-cloud-a" aria-hidden="true"></span>
          <span class="pixel-cloud pixel-cloud-b" aria-hidden="true"></span>
          ${collage.map((project, index) => `
            <a class="collage-card collage-card-${index + 1}" href="/projects/${escapeHTML(project.slug)}" data-route>
              <div class="image-frame" data-image-frame>${renderProjectImage(project.images?.hero, `${project.name}`, { loading: 'eager' })}</div>
              <span class="collage-caption">${escapeHTML(project.name)}</span>
            </a>`).join('')}
        </div>
      </section>

      <section class="section reveal" id="services-preview">
        <div class="section-head">
          <div><p class="eyebrow">${t('common.services')}</p><h2>${t('mc.servicesTitle')}</h2></div>
          <div class="section-head-side"><p>${t('mc.servicesText')}</p><a class="text-link" href="/services" data-route>${t('common.allServices')} ${icon('arrow')}</a></div>
        </div>
        <div class="service-grid">${SITE.services.slice(0, 4).map(renderServiceCard).join('')}</div>
      </section>

      <section class="section reveal" id="featured-projects">
        <div class="section-head">
          <div><p class="eyebrow">${t('mc.workEyebrow')}</p><h2>${t('mc.workTitle')}</h2></div>
          <div class="section-head-side"><p>${t('mc.workText')}</p><a class="text-link" href="/projects" data-route>${t('common.allProjects')} ${icon('arrow')}</a></div>
        </div>
        <div class="project-grid">${PROJECTS.length ? PROJECTS.map((project) => renderProjectCard(project)).join('') : renderEmptyProjects()}</div>
      </section>

      <section class="section reveal" id="process">
        <div class="section-head"><div><p class="eyebrow">${t('common.howItWorks')}</p><h2>${t('mc.processTitle')}</h2></div></div>
        <div class="process-grid">${SITE.process.map(renderProcessStep).join('')}</div>
        <div class="toolbelt">
          <span class="toolbelt-label">${t('common.workingWith')}</span>
          <ul class="chips">${SITE.technologies.map((tech) => `<li class="chip">${escapeHTML(tech)}</li>`).join('')}</ul>
        </div>
      </section>

      ${renderCtaPanel()}
    </div>
  `;
}

function renderProjects() {
  const showToolbar = PROJECTS.length > 6;
  return `
    <div class="view projects-view">
      <section class="page-head reveal">
        <p class="eyebrow">${t('common.projects')}</p>
        <h1>${t('projects.title')}</h1>
        <p class="page-lede">${t('projects.lede')}</p>
      </section>
      <section class="reveal" aria-label="${t('common.projects')}">
        ${showToolbar ? `
        <div class="filter-toolbar">
          <div class="filter-list" role="group">${FILTERS.map(renderFilterButton).join('')}</div>
          <label class="search-box"><span class="visually-hidden">${t('projects.search')}</span>${icon('search')}<input type="search" data-project-search value="${escapeHTML(activeSearch)}" placeholder="${t('projects.search')}" autocomplete="off"></label>
        </div>
        <p class="results-meta" aria-live="polite"><strong data-project-results-count>${escapeHTML(formatProjectCount(getFilteredProjects().length))}</strong> ${t('projects.shown')}</p>` : ''}
        <div class="project-grid" data-project-grid>${renderFilteredProjectCards()}</div>
      </section>
      ${renderCtaPanel()}
    </div>
  `;
}

function getProjectCategories() {
  return [...new Set(PROJECTS.map((project) => project.category).filter(Boolean))];
}

function getProjectCount(category = '') {
  if (!category || category === 'All') return PROJECTS.length;
  return PROJECTS.filter((project) => project.category === category).length;
}

function formatProjectCount(count) {
  const total = Number.isFinite(Number(count)) ? Number(count) : 0;
  return `${total} ${t(total === 1 ? 'projects.one' : 'projects.many')}`;
}

function renderFilterButton(filter) {
  const count = getProjectCount(filter);
  const label = filter === 'All' ? t('projects.all') : (L(PROJECTS.find((project) => project.category === filter)?.categoryLabel) || filter);
  return `<button class="filter-button ${activeFilter === filter ? 'is-active' : ''}" type="button" data-filter="${escapeHTML(filter)}" aria-pressed="${activeFilter === filter}"><span>${escapeHTML(label)}</span><strong>${count}</strong></button>`;
}

function renderDiscordLink(label, className = 'button button-primary') {
  const withIcon = /button/.test(className) && !/command|dc-btn/.test(className);
  return `<a class="${escapeHTML(className)}" href="${escapeHTML(DISCORD_SERVER_URL)}" data-discord-link target="_blank" rel="noopener noreferrer">${escapeHTML(label)}${withIcon ? ` ${icon('external')}` : ''}</a>`;
}

function renderFilteredProjectCards() {
  const query = activeSearch.trim().toLowerCase();
  const filtered = getFilteredProjects();
  return filtered.length ? filtered.map((project) => renderProjectCard(project)).join('') : renderEmptyProjects(query ? t('projects.noMatch') : t('projects.noCategory'));
}

function getFilteredProjects() {
  const query = activeSearch.trim().toLowerCase();
  return PROJECTS.filter((project) => {
    const categoryMatch = activeFilter === 'All' || project.category === activeFilter;
    const haystack = [project.name, L(project.shortDescription), L(project.fullDescription), ...(project.technologies || []), ...(L(project.features) || [])].join(' ').toLowerCase();
    return categoryMatch && (!query || haystack.includes(query));
  });
}

function renderServices() {
  return `
    <div class="view services-view">
      <section class="page-head reveal">
        <p class="eyebrow">${t('common.services')}</p>
        <h1>${t('services.title')}</h1>
        <p class="page-lede">${t('services.lede')}</p>
      </section>
      <section class="service-list reveal" aria-label="${t('common.services')}">${SITE.services.map(renderServiceRow).join('')}</section>
      <section class="section reveal">
        <div class="swap-card swap-card-discord">
          <div><h2>${t('services.discordTitle')}</h2><p>${t('services.discordText')}</p></div>
          <a class="button button-discord" href="/discord" data-route>${t('hub.ctaDiscord')} ${icon('arrow')}</a>
        </div>
      </section>
      ${renderCtaPanel()}
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="view about-view">
      <section class="page-head reveal">
        <p class="eyebrow">${t('common.about')}</p>
        <h1>${t('about.title')}</h1>
        <p class="page-lede">${t('about.lede')}</p>
      </section>
      <section class="about-grid reveal">
        <div class="about-copy">
          <p>${t('about.p1')}</p>
          <p>${t('about.p2')}</p>
          <div class="principles">
            <div class="principle"><h3>${t('about.pr1t')}</h3><p>${t('about.pr1')}</p></div>
            <div class="principle"><h3>${t('about.pr2t')}</h3><p>${t('about.pr2')}</p></div>
            <div class="principle"><h3>${t('about.pr3t')}</h3><p>${t('about.pr3')}</p></div>
          </div>
        </div>
        <aside class="about-card">
          <h3>${t('common.workingWith')}</h3>
          <ul class="chips">${SITE.technologies.map((tech) => `<li class="chip">${escapeHTML(tech)}</li>`).join('')}</ul>
          <h3>${t('about.find')}</h3>
          <p class="about-handle">Discord: <strong>${escapeHTML(SITE.contact.discord)}</strong></p>
          <p class="about-handle">GitHub: <a class="text-link" href="${GITHUB_PROFILE_URL}" data-github-link target="_blank" rel="noopener noreferrer">github.com/${escapeHTML(SITE.contact.githubHandle)}</a></p>
          <div class="button-row">
            ${renderDiscordLink(t('common.openDiscord'), 'button button-primary button-small')}
            <a class="button button-ghost button-small" href="${GITHUB_PROFILE_URL}" data-github-link target="_blank" rel="noopener noreferrer">${icon('github')} GitHub</a>
          </div>
        </aside>
      </section>
      ${renderCtaPanel()}
    </div>
  `;
}

function renderContact() {
  const projectOptions = SITE.projectTypes.map((type) => `<option value="${escapeHTML(type.id)}">${escapeHTML(L(type.label))}</option>`).join('');
  const budgetOptions = L(SITE.budgets).map((budget) => `<option value="${escapeHTML(budget)}">${escapeHTML(budget)}</option>`).join('');
  return `
    <div class="view contact-view">
      <section class="page-head reveal">
        <p class="eyebrow">${t('common.contact')}</p>
        <h1>${t('contact.title')}</h1>
        <p class="page-lede">${t('contact.lede')}</p>
      </section>
      <section class="contact-layout reveal">
        <div class="contact-intro">
          <div class="discord-card">
            <div><span class="discord-label">Discord</span><strong class="discord-handle">${escapeHTML(SITE.contact.discord)}</strong></div>
            <div class="discord-actions"><button class="button button-ghost button-small" type="button" data-copy-discord>${t('contact.copy')}</button>${renderDiscordLink(t('common.openDiscord'), 'button button-primary button-small')}</div>
          </div>
          <a class="github-line" href="${GITHUB_PROFILE_URL}" data-github-link target="_blank" rel="noopener noreferrer">${icon('github')}<span><strong>GitHub</strong> github.com/${escapeHTML(SITE.contact.githubHandle)}</span>${icon('external')}</a>
          <ol class="steps">
            <li><strong>${t('contact.s1t')}</strong><span>${t('contact.s1')}</span></li>
            <li><strong>${t('contact.s2t')}</strong><span>${t('contact.s2')}</span></li>
            <li><strong>${t('contact.s3t')}</strong><span>${t('contact.s3')}</span></li>
          </ol>
        </div>
        <div class="form-card">
          <h2>${t('contact.formTitle')}</h2>
          <p class="form-hint">${t('contact.formHint')}</p>
          <form class="commission-form" id="commissionForm">
            <div class="field"><label for="commissionName">${t('contact.name')}</label><input id="commissionName" name="name" type="text" placeholder="${t('contact.namePh')}" autocomplete="name" required></div>
            <div class="field"><label for="commissionDiscord">${t('contact.discordUser')}</label><input id="commissionDiscord" name="discord" type="text" placeholder="username" autocomplete="off" required></div>
            <div class="field"><label for="commissionEmail">Email</label><input id="commissionEmail" name="email" type="email" placeholder="${t('contact.emailPh')}" autocomplete="email" required></div>
            <div class="field"><label for="commissionType">${t('contact.type')}</label><select id="commissionType" name="projectType" required><option value="" disabled selected>${t('contact.typePh')}</option>${projectOptions}</select></div>
            <div class="field"><label for="commissionBudget">${t('contact.budget')}</label><select id="commissionBudget" name="budget" required><option value="" disabled selected>${t('contact.budgetPh')}</option>${budgetOptions}</select></div>
            <div class="field field-wide"><label for="commissionDescription">${t('contact.desc')}</label><textarea id="commissionDescription" name="description" placeholder="${t('contact.descPh')}" required></textarea></div>
            <div class="form-actions"><button class="button button-primary" type="submit">${t('contact.submit')} ${icon('arrow')}</button></div>
            <p class="form-status" id="commissionStatus" aria-live="polite"></p>
            <pre class="brief-preview" id="briefPreview" hidden></pre>
          </form>
        </div>
      </section>
    </div>
  `;
}

function renderProjectDetail(project, brand = 'minecraft') {
  const gallery = Array.isArray(project.images?.gallery) ? project.images.gallery : [];
  const details = Array.isArray(project.details) ? project.details : [];
  const isDiscord = brand === 'discord';
  const others = (isDiscord ? DISCORD_PRODUCTS : PROJECTS).filter((item) => item.slug !== project.slug);
  return `
    <div class="view project-detail-view">
      <section class="detail-hero">
        <div class="detail-copy reveal">
          <nav class="breadcrumbs" aria-label="${t('nav.breadcrumb')}">${isDiscord ? `<a href="/discord" data-route>Discord</a>` : `<a href="/minecraft" data-route>Minecraft</a><span>/</span><a href="/projects" data-route>${t('common.projects')}</a>`}<span>/</span><span>${escapeHTML(project.name)}</span></nav>
          <div class="detail-labels"><span class="chip">${escapeHTML(L(project.categoryLabel))}</span>${renderStatusBadge(project.status)}</div>
          <h1>${escapeHTML(project.name)}</h1>
          <p class="detail-description">${escapeHTML(L(project.shortDescription))}</p>
          <div class="button-row">${renderProjectLinks(project)}</div>
          <dl class="detail-meta">
            <div><dt>${t('detail.year')}</dt><dd>${escapeHTML(project.date || '—')}</dd></div>
            <div><dt>${t('detail.price')}</dt><dd>${escapeHTML(L(project.price) || t('detail.onRequest'))}</dd></div>
            <div><dt>${t('detail.status')}</dt><dd>${escapeHTML(statusLabel(project.status))}</dd></div>
          </dl>
        </div>
        <div class="detail-visual image-frame reveal" data-image-frame>${renderProjectImage(project.images?.hero, project.name, { loading: 'eager', fetchPriority: 'high' })}</div>
      </section>

      <section class="detail-body">
        <div class="detail-main">
          <section class="detail-block reveal"><p class="eyebrow">${t('detail.overview')}</p><p class="detail-overview">${escapeHTML(L(project.fullDescription))}</p></section>
          <section class="detail-block reveal"><p class="eyebrow">${t('detail.features')}</p><ul class="check-list">${(L(project.features) || []).map((feature) => `<li>${escapeHTML(feature)}</li>`).join('')}</ul></section>
          ${details.length ? `<section class="detail-block reveal"><div class="details-grid">${details.map((detail) => `<article class="details-card"><h3>${escapeHTML(L(detail.title))}</h3><p>${escapeHTML(L(detail.body))}</p></article>`).join('')}</div></section>` : ''}
        </div>
        <aside class="detail-side reveal">
          <div class="side-card"><span class="side-label">${t('detail.builtWith')}</span><ul class="chips">${(project.technologies || []).map((technology) => `<li class="chip">${escapeHTML(technology)}</li>`).join('')}</ul></div>
          <div class="side-card"><span class="side-label">${t('detail.similar')}</span><p>${t('detail.similarText')}</p>${renderDiscordLink(t('detail.talk'), 'button button-primary button-small')}</div>
        </aside>
      </section>

      ${gallery.length ? `<section class="detail-section reveal"><div class="section-head"><div><p class="eyebrow">${t('detail.screens')}</p><h2>${t('detail.inGame')}</h2></div><p class="section-head-note">${t('detail.tap')}</p></div><div class="gallery-grid">${gallery.map((image, index) => `<button class="gallery-item image-frame" type="button" data-image-frame data-lightbox-slug="${escapeHTML(project.slug)}" data-lightbox-index="${index + 1}" aria-label="${escapeHTML(project.name)} · ${index + 1}">${renderProjectImage(image, `${project.name} · ${index + 1}`, { loading: 'lazy' })}</button>`).join('')}</div></section>` : ''}
      ${renderVideoSection(project)}
      ${others.length ? `<section class="detail-section reveal"><div class="section-head"><div><p class="eyebrow">${t('detail.more')}</p><h2>${t('detail.others')}</h2></div><a class="text-link" href="${isDiscord ? '/discord' : '/projects'}" data-route>${t('common.allProjects')} ${icon('arrow')}</a></div><div class="project-grid">${others.map((item) => renderProjectCard(item, brand)).join('')}</div></section>` : ''}
      ${renderCtaPanel()}
    </div>
  `;
}

function renderVideoSection(project) {
  if (!Array.isArray(project.videos) || !project.videos.length) return '';
  const videos = project.videos.map((video) => {
    if (typeof video === 'string') return `<video controls preload="metadata" src="${escapeHTML(assetUrl(video))}"></video>`;
    if (video.type === 'youtube' || video.type === 'vimeo') return `<iframe src="${escapeHTML(video.src)}" title="${escapeHTML(video.title || project.name)}" loading="lazy" allowfullscreen></iframe>`;
    return `<video controls preload="metadata" src="${escapeHTML(assetUrl(video.src || ''))}"${video.poster ? ` poster="${escapeHTML(assetUrl(video.poster))}"` : ''}></video>`;
  }).join('');
  return `<section class="detail-section reveal"><div class="section-head"><div><p class="eyebrow">${t('detail.video')}</p><h2>${t('detail.seeAction')}</h2></div></div><div class="video-frame">${videos}</div></section>`;
}

function renderProjectLinks(project) {
  const links = [];
  if (project.links?.download) links.push(`<a class="button button-primary" href="${escapeHTML(project.links.download)}" target="_blank" rel="noopener noreferrer">${t('detail.download')} ${icon('external')}</a>`);
  if (project.links?.invite) links.push(`<a class="button button-primary" href="${escapeHTML(project.links.invite)}" target="_blank" rel="noopener noreferrer">${t('detail.invite')} ${icon('external')}</a>`);
  if (project.github) links.push(`<a class="button button-ghost" href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">GitHub ${icon('external')}</a>`);
  if (!links.length) links.push(renderDiscordLink(t('detail.ask'), 'button button-primary'));
  return links.join('');
}

function statusLabel(status) {
  return t(String(status || '').toLowerCase() === 'released' ? 'common.released' : 'common.development');
}

function renderStatusBadge(status) {
  const live = String(status || '').toLowerCase() === 'released';
  return `<span class="badge ${live ? 'badge-live' : 'badge-dev'}"><i></i>${escapeHTML(statusLabel(status))}</span>`;
}

function renderProjectImage(path, alt, options = {}) {
  const source = assetUrl(path);
  if (!source) return renderImagePlaceholder(alt);
  const loading = options.loading || 'lazy';
  const fetchPriority = options.fetchPriority ? ` fetchpriority="${escapeHTML(options.fetchPriority)}"` : '';
  return `<img class="project-image" data-project-image src="${escapeHTML(source)}" alt="${escapeHTML(alt)}" loading="${escapeHTML(loading)}" decoding="async"${fetchPriority}>${renderImagePlaceholder(alt).replace(' aria-label=', ' hidden aria-label=')}`;
}

function renderImagePlaceholder(alt = '') {
  return `<div class="image-placeholder" data-image-placeholder role="img" aria-label="${escapeHTML(alt)} — ${t('common.soon')}"><span class="pixel-cloud" aria-hidden="true"></span><strong>${t('common.soon')}</strong></div>`;
}

function renderServiceCard(service) {
  return `<article class="service"><h3>${escapeHTML(L(service.title))}</h3><p>${escapeHTML(L(service.description))}</p><a class="text-link" href="/contact?service=${encodeURIComponent(service.id)}" data-route>${t('common.request')} ${icon('arrow')}</a></article>`;
}

function renderServiceRow(service) {
  return `<article class="service-row"><h2>${escapeHTML(L(service.title))}</h2><p>${escapeHTML(L(service.description))}</p><a class="button button-ghost button-small" href="/contact?service=${encodeURIComponent(service.id)}" data-route>${t('common.request')} ${icon('arrow')}</a></article>`;
}

function renderProjectCard(project, brand = 'minecraft') {
  const technologies = (project.technologies || []).slice(0, 4);
  return `<a class="project-card" href="${brand === 'discord' ? '/discord' : '/projects'}/${escapeHTML(project.slug)}" data-route>
    <div class="project-card-media image-frame" data-image-frame>${renderProjectImage(project.images?.hero, project.name)}</div>
    <div class="project-card-body">
      <div class="project-card-top"><h3>${escapeHTML(project.name)}</h3>${renderStatusBadge(project.status)}</div>
      <p>${escapeHTML(L(project.shortDescription))}</p>
      <div class="project-card-foot"><ul class="chips">${technologies.map((technology) => `<li class="chip">${escapeHTML(technology)}</li>`).join('')}</ul><span class="project-card-price">${escapeHTML(L(project.price) || '')}</span></div>
    </div>
  </a>`;
}

function renderProcessStep(step, index) {
  return `<article class="process-step"><span class="step-number">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHTML(L(step.title))}</h3><p>${escapeHTML(L(step.description))}</p></article>`;
}

function renderCtaPanel() {
  return `<section class="cta-panel reveal"><div><h2>${t('cta.title')}</h2><p>${t('cta.text')}</p></div><div class="cta-actions">${renderDiscordLink(t('cta.button'), 'button button-light')}<span class="cta-handle">${escapeHTML(SITE.contact.discord)}</span></div></section>`;
}

function renderEmptyProjects(message = t('projects.empty')) {
  return `<div class="empty-results"><strong>${escapeHTML(message)}</strong><span>${t('projects.emptyHint')}</span></div>`;
}

function renderNotFound(title, message) {
  return `<div class="view not-found"><p class="eyebrow">404</p><h1>${escapeHTML(title)}</h1><p class="page-lede">${escapeHTML(message)}</p><a class="button button-primary" href="/" data-route>${t('common.backHome')} ${icon('arrow')}</a></div>`;
}

/* ------------------------------------------------------------------
 * Página /discord — estilo próprio, inspirado na interface do Discord.
 * ------------------------------------------------------------------ */

function renderDiscordWindows() {
  const picker = SITE.discordServices.slice(0, 4);
  return `
    <div class="dc-collage" aria-label="${t('dc.collageLabel')}">
      <div class="dc-window dc-window-1">
        <div class="dc-window-bar"><span class="dc-hash">#</span><strong>${t('dc.ex1Channel')}</strong><span class="dc-example">${t('dc.example')}</span></div>
        <div class="dc-chat">
          <div class="dc-chat-msg"><span class="dc-chat-avatar dc-chat-avatar-user">${escapeHTML(t('dc.ex1User').charAt(0))}</span><div><b>${t('dc.ex1User')}</b><span class="dc-chat-cmd">${t('dc.ex1Cmd')}</span></div></div>
          <div class="dc-chat-msg"><span class="dc-chat-avatar"><img src="assets/brand/logo-main.png" alt="" width="28" height="28" decoding="async"></span><div><b>Medeiros Bot <i class="dc-tag">BOT</i></b>
            <div class="dc-mini-embed" style="--embed:#23a55a">
              <strong>${t('dc.ex1Title')}</strong>
              <div class="dc-mini-fields"><div><b>${t('dc.ex1F1n')}</b><span>${t('dc.ex1F1v')}</span></div><div><b>${t('dc.ex1F2n')}</b><span>${t('dc.ex1F2v')}</span></div></div>
              <div class="dc-mini-buttons"><span class="dc-mini-btn">${t('dc.ex1B1')}</span><span class="dc-mini-btn dc-mini-btn-ghost">${t('dc.ex1B2')}</span></div>
            </div></div></div>
        </div>
      </div>

      <div class="dc-window dc-window-2">
        <div class="dc-window-bar"><span class="dc-hash">#</span><strong>${t('dc.ex2Channel')}</strong><span class="dc-example">${t('dc.example')}</span></div>
        <div class="dc-chat"><div class="dc-chat-msg"><span class="dc-chat-avatar"><img src="assets/brand/logo-main.png" alt="" width="28" height="28" decoding="async"></span><div><b>Medeiros Bot <i class="dc-tag">BOT</i></b>
          <div class="dc-mini-embed" style="--embed:#5865f2">
            <strong>${t('dc.ex2Title')}</strong>
            <div class="dc-mini-fields"><div><b>${t('dc.ex2F1n')}</b><span>24 / 100</span></div><div><b>${t('dc.ex2F2n')}</b><span>1.21</span></div><div><b>${t('dc.ex2F3n')}</b><span class="dc-online">${t('dc.ex2F3v')}</span></div></div>
          </div></div></div></div>
      </div>

      <div class="dc-window dc-window-3">
        <div class="dc-window-bar"><strong>${t('dc.ex3Title')}</strong><span class="dc-example">${t('dc.example')}</span></div>
        <ul class="dc-picker">${picker.map((service, index) => `<li class="${index === 0 ? 'is-first' : ''}"><span class="dc-picker-icon">${icon(service.icon)}</span><span class="dc-picker-text"><b>${escapeHTML(L(service.command))}</b><em>${escapeHTML(L(service.title))}</em></span></li>`).join('')}</ul>
      </div>
    </div>`;
}

function renderDiscordService(service) {
  return `<article class="dc-service">
    <span class="dc-service-cmd">${escapeHTML(L(service.command))}</span>
    <h3>${escapeHTML(L(service.title))}</h3>
    <p>${escapeHTML(L(service.description))}</p>
    <a class="dc-service-link" href="/contact?service=${encodeURIComponent(service.id)}" data-route>${t('dc.request')}</a>
  </article>`;
}

function renderDiscord() {
  const productsMarkup = DISCORD_PRODUCTS.length
    ? `<div class="project-grid">${DISCORD_PRODUCTS.map((product) => renderProjectCard(product, 'discord')).join('')}</div>`
    : `<div class="dc-empty"><span class="dc-empty-icon">${icon('spark')}</span><div><h3>${t('dc.emptyTitle')}</h3><p>${t('dc.emptyText')}</p></div><a class="button button-primary button-small" href="/minecraft" data-route>${t('dc.emptyLink')} ${icon('arrow')}</a></div>`;
  return `
    <div class="view discord-view">
      <section class="hero dc-hero">
        <div class="hero-copy">
          <p class="status-pill"><i></i> ${t('common.open')}</p>
          <h1>${t('dc.h1a')} <span class="mark">${t('dc.h1b')}</span> ${t('dc.h1c')}</h1>
          <p class="lede">${t('dc.lede')}</p>
          <div class="button-row">
            <a class="button button-primary" href="#dc-services" data-scroll="dc-services">${t('dc.ctaServices')} ${icon('arrow')}</a>
            ${renderDiscordLink(t('common.hire'), 'button button-ghost')}
          </div>
          <ul class="hero-facts">
            <li><strong>${t('dc.fact1A')}</strong> ${t('dc.fact1B')}</li>
            <li><strong>${t('dc.fact2A')}</strong> ${t('dc.fact2B')}</li>
            <li><strong>${t('hub.factTestedA')}</strong> ${t('hub.factTestedB')}</li>
          </ul>
        </div>
        ${renderDiscordWindows()}
      </section>

      <section class="section reveal" id="dc-services">
        <div class="section-head">
          <div><p class="eyebrow">${t('common.services')}</p><h2>${t('dc.servicesTitle')}</h2></div>
          <div class="section-head-side"><p>${t('dc.servicesText')}</p></div>
        </div>
        <div class="dc-service-grid">${SITE.discordServices.map(renderDiscordService).join('')}</div>
      </section>

      <section class="section reveal" id="dc-products">
        <div class="section-head">
          <div><p class="eyebrow">${t('dc.productsEyebrow')}</p><h2>${t('dc.productsTitle')}</h2></div>
          <div class="section-head-side"><p>${t('dc.productsText')}</p></div>
        </div>
        ${productsMarkup}
      </section>

      <section class="section reveal" id="dc-process">
        <div class="section-head"><div><p class="eyebrow">${t('common.howItWorks')}</p><h2>${t('dc.processTitle')}</h2></div></div>
        <div class="process-grid">${SITE.process.map(renderProcessStep).join('')}</div>
        <div class="toolbelt">
          <span class="toolbelt-label">${t('common.workingWith')}</span>
          <ul class="chips">${SITE.discordTechnologies.map((tech) => `<li class="chip">${escapeHTML(tech)}</li>`).join('')}</ul>
        </div>
      </section>

      ${renderCtaPanel()}
    </div>
  `;
}

function modeOfPath(path) {
  if (path === '/discord' || path.startsWith('/discord/')) return 'discord';
  if (path === '/minecraft' || path.startsWith('/projects') || path === '/services') return 'minecraft';
  return 'home';
}

function currentMode() {
  return modeOfPath(getLocation().pathname);
}

function navigate(path) {
  const [pathname, query = ''] = path.split('?');
  const normalized = stripSiteBasePath(pathname);
  const fromMode = currentMode();
  const toMode = modeOfPath(normalized);

  const go = () => {
    if (window.location.protocol === 'file:') {
      const next = `index.html?route=${encodeURIComponent(normalized + (query ? `?${query}` : ''))}`;
      window.history.pushState({}, '', next);
    } else {
      window.history.pushState({}, '', buildSitePath(normalized, query));
    }
    closeMobileNav();
    renderRoute(true);
  };

  if (fromMode === toMode || reducedMotion() || !app) {
    go();
    return;
  }

  /* A bolinha do seletor já acompanha, e a página desliza no sentido do movimento. */
  const switchEl = document.querySelector('[data-mode-switch]');
  if (switchEl) switchEl.dataset.active = toMode;
  const forward = MODE_ORDER.indexOf(toMode) > MODE_ORDER.indexOf(fromMode);
  app.classList.add(forward ? 'is-leaving-left' : 'is-leaving-right');
  window.setTimeout(() => {
    app.classList.remove('is-leaving-left', 'is-leaving-right');
    app.dataset.enter = forward ? 'right' : 'left';
    go();
    window.setTimeout(() => { delete app.dataset.enter; }, 700);
  }, 230);
}

function stepMode(direction) {
  const index = MODE_ORDER.indexOf(currentMode()) + direction;
  if (index < 0 || index >= MODE_ORDER.length) return;
  navigate(MODE_ROUTE[MODE_ORDER[index]]);
}

/* Arrastar a tela: dedo para a esquerda avança (Minecraft > Início > Discord), para a direita volta. */
function setupSwipe() {
  let start = null;
  const blocked = (target) => {
    if (document.querySelector('[data-lightbox]:not([hidden])')) return true;
    if (mobileNav && mobileNav.classList.contains('is-open')) return true;
    for (let node = target; node && node !== document.body; node = node.parentElement) {
      const tag = node.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'VIDEO' || tag === 'IFRAME') return true;
      if (node.matches && node.matches('[data-mode-switch]')) return true;
      if (node.scrollWidth > node.clientWidth + 4 && ['auto', 'scroll'].includes(getComputedStyle(node).overflowX)) return true;
    }
    return false;
  };

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) { start = null; return; }
    const touch = event.touches[0];
    const edge = 28;
    if (touch.clientX < edge || touch.clientX > window.innerWidth - edge || blocked(event.target)) { start = null; return; }
    start = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const elapsed = Date.now() - start.time;
    start = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6 || elapsed > 800) return;
    stepMode(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('touchcancel', () => { start = null; }, { passive: true });
}

/* Também dá para arrastar a própria bolinha do seletor até a área desejada. */
function setupModeSwitchDrag() {
  const switchEl = document.querySelector('[data-mode-switch]');
  const thumb = switchEl ? switchEl.querySelector('.mode-thumb') : null;
  if (!switchEl || !thumb) return;
  let drag = null;
  let suppressClick = false;
  const segment = (rect) => (rect.width - 8) / 3;

  switchEl.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const rect = switchEl.getBoundingClientRect();
    drag = { startX: event.clientX, rect, moved: false, startIndex: Math.max(0, MODE_ORDER.indexOf(switchEl.dataset.active)), x: 0 };
  });

  switchEl.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true;
      switchEl.classList.add('is-dragging');
      try { switchEl.setPointerCapture(event.pointerId); } catch (error) { /* ignorado */ }
    }
    if (drag.moved) {
      const size = segment(drag.rect);
      drag.x = Math.max(0, Math.min(size * 2, drag.startIndex * size + dx));
      thumb.style.transform = `translateX(${drag.x}px)`;
    }
  });

  const finish = () => {
    if (!drag) return;
    const state = drag;
    drag = null;
    if (!state.moved) return;
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
    switchEl.classList.remove('is-dragging');
    const index = Math.max(0, Math.min(2, Math.round(state.x / segment(state.rect))));
    thumb.style.transform = '';
    const target = MODE_ORDER[index];
    if (target === currentMode()) {
      switchEl.dataset.active = target;
    } else {
      navigate(MODE_ROUTE[target]);
    }
  };
  switchEl.addEventListener('dragstart', (event) => event.preventDefault());
  switchEl.addEventListener('pointerup', finish);
  switchEl.addEventListener('pointercancel', finish);
  switchEl.addEventListener('click', (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

function handleClick(event) {
  const langButton = event.target.closest('[data-lang]');
  if (langButton) {
    applyLanguage(langButton.dataset.lang);
    return;
  }

  if (event.target.closest('[data-theme-toggle]')) {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
    return;
  }

  const scrollLink = event.target.closest('[data-scroll]');
  if (scrollLink) {
    event.preventDefault();
    const target = document.getElementById(scrollLink.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    return;
  }

  const routeLink = event.target.closest('[data-route]');
  if (routeLink) {
    event.preventDefault();
    navigate(routeLink.getAttribute('href') || '/');
    return;
  }

  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) {
    activeFilter = filterButton.dataset.filter || 'All';
    document.querySelectorAll('[data-filter]').forEach((button) => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const grid = document.querySelector('[data-project-grid]');
    if (grid) grid.innerHTML = renderFilteredProjectCards();
    updateProjectResultsCount();
    setupReveal(grid || document);
    setupImageFrames();
    return;
  }

  const copyButton = event.target.closest('[data-copy-discord]');
  if (copyButton) {
    copyToClipboard(SITE.contact.discord).then((copied) => {
      showToast(copied ? t('contact.copied') : `Discord: ${SITE.contact.discord}`);
    });
    return;
  }

  const galleryButton = event.target.closest('[data-lightbox-slug]');
  if (galleryButton) {
    openLightbox(galleryButton.dataset.lightboxSlug, Number(galleryButton.dataset.lightboxIndex || 0));
    return;
  }

  if (event.target.closest('[data-lightbox-close]')) {
    closeLightbox();
    return;
  }

  if (event.target.closest('[data-lightbox-prev]')) {
    moveLightbox(-1);
    return;
  }

  if (event.target.closest('[data-lightbox-next]')) {
    moveLightbox(1);
    return;
  }

  if (event.target.closest('[data-menu-toggle]')) {
    toggleMobileNav();
  }
}

function handleInput(event) {
  if (event.target.matches('[data-project-search]')) {
    activeSearch = event.target.value;
    const grid = document.querySelector('[data-project-grid]');
    if (grid) grid.innerHTML = renderFilteredProjectCards();
    updateProjectResultsCount();
    setupReveal(grid || document);
    setupImageFrames();
  }
}

function updateProjectResultsCount() {
  const countElement = document.querySelector('[data-project-results-count]');
  if (countElement) countElement.textContent = formatProjectCount(getFilteredProjects().length);
}

function handleSubmit(event) {
  if (!event.target.matches('#commissionForm')) return;
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const type = SITE.projectTypes.find((item) => item.id === data.get('projectType'));
  const title = t('contact.briefTitle');
  const brief = [
    title,
    '-'.repeat(title.length),
    `${t('contact.briefName')}: ${data.get('name')}`,
    `Discord: ${data.get('discord')}`,
    `Email: ${data.get('email')}`,
    `${t('contact.briefType')}: ${type ? L(type.label) : data.get('projectType')}`,
    `${t('contact.briefBudget')}: ${data.get('budget')}`,
    '',
    `${t('contact.briefDesc')}:`,
    String(data.get('description') || '').trim()
  ].join('\n');

  const preview = document.getElementById('briefPreview');
  const status = document.getElementById('commissionStatus');
  if (preview) {
    preview.hidden = false;
    preview.textContent = brief;
  }

  copyToClipboard(brief).then((copied) => {
    if (status) status.textContent = copied ? t('contact.ok') : t('contact.manual');
    showToast(copied ? t('contact.toastOk') : t('contact.toastManual'));
  });
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    if (!lightbox.hidden) closeLightbox();
    else closeMobileNav();
  }
  if (!lightbox.hidden && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    moveLightbox(event.key === 'ArrowLeft' ? -1 : 1);
  }
}

function handleScroll() {
  const y = window.scrollY;
  if (header) {
    header.classList.toggle('is-scrolled', y > 12);
    const menuOpen = header.classList.contains('menu-open');
    if (!menuOpen && window.innerWidth < 1160 && y > 140 && y > lastScrollY + 6) header.classList.add('is-compact');
    else if (y < lastScrollY - 6 || y < 90 || menuOpen) header.classList.remove('is-compact');
  }
  lastScrollY = y;
}

function initializeContactForm(query) {
  const typeSelect = document.getElementById('commissionType');
  const description = document.getElementById('commissionDescription');
  if (!typeSelect) return;

  const serviceId = query.get('service');
  const projectSlug = query.get('project');
  const service = [...SITE.services, ...SITE.discordServices].find((item) => item.id === serviceId);
  const project = findProject(projectSlug);
  if (service && [...typeSelect.options].some((option) => option.value === service.projectType)) {
    typeSelect.value = service.projectType;
  }
  if (project && description) {
    description.value = `${t('contact.ref')}: ${project.name}\n\n`;
  }
}

function setupReveal(scope = document) {
  const elements = scope.querySelectorAll ? scope.querySelectorAll('.reveal:not(.is-visible)') : document.querySelectorAll('.reveal:not(.is-visible)');
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  elements.forEach((element) => observer.observe(element));
}

function toggleMobileNav() {
  if (!menuToggle) return;
  const isOpen = mobileNav.classList.toggle('is-open');
  header.classList.toggle('menu-open', isOpen);
  if (isOpen) header.classList.remove('is-compact');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', t(isOpen ? 'nav.closeMenu' : 'nav.openMenu'));
}

function closeMobileNav() {
  if (!menuToggle || !mobileNav.classList.contains('is-open')) return;
  mobileNav.classList.remove('is-open');
  header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', t('nav.openMenu'));
}

function openLightbox(slug, index) {
  const project = findProject(slug);
  if (!project) return;
  activeGallery = [
    { src: project.images?.hero, label: `${project.name} · ${t('lightbox.hero')}` },
    ...((project.images?.gallery || []).map((src, galleryIndex) => ({ src, label: `${project.name} · ${t('lightbox.gallery')} ${String(galleryIndex + 1).padStart(2, '0')}` })))
  ];
  activeGalleryIndex = Math.min(Math.max(index, 0), activeGallery.length - 1);
  lastFocusedElement = document.activeElement;
  window.clearTimeout(lightboxCloseTimer);
  lightbox.hidden = false;
  lightbox.classList.remove('is-visible');
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderLightboxImage();
  window.requestAnimationFrame(() => lightbox.classList.add('is-visible'));
  lightbox.querySelector('.lightbox-close').focus();
}

function renderLightboxImage() {
  if (!activeGallery.length) return;
  const image = lightbox.querySelector('[data-lightbox-image]');
  const caption = lightbox.querySelector('[data-lightbox-caption]');
  const placeholder = lightbox.querySelector('[data-lightbox-placeholder]');
  const item = activeGallery[activeGalleryIndex];
  const source = assetUrl(item.src);
  image.hidden = !source;
  if (source) image.src = source;
  else image.removeAttribute('src');
  if (placeholder) placeholder.hidden = Boolean(source);
  image.alt = item.label;
  caption.textContent = `${item.label} · ${activeGalleryIndex + 1} / ${activeGallery.length}`;
  lightbox.querySelector('[data-lightbox-prev]').disabled = activeGallery.length < 2;
  lightbox.querySelector('[data-lightbox-next]').disabled = activeGallery.length < 2;
}

function moveLightbox(direction) {
  if (activeGallery.length < 2) return;
  activeGalleryIndex = (activeGalleryIndex + direction + activeGallery.length) % activeGallery.length;
  renderLightboxImage();
}

function closeLightbox() {
  if (lightbox.hidden) return;
  window.clearTimeout(lightboxCloseTimer);
  lightbox.classList.remove('is-visible');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  lightboxCloseTimer = window.setTimeout(() => {
    if (!lightbox.classList.contains('is-visible')) {
      lightbox.hidden = true;
      lightbox.classList.remove('is-open');
    }
  }, 220);
}

function handleLightboxTouchStart(event) {
  if (lightbox.hidden || !event.touches.length || !(event.target instanceof Element) || !event.target.closest('[data-lightbox]')) return;
  const touch = event.touches[0];
  lightboxTouchStart = { x: touch.clientX, y: touch.clientY };
}

function handleLightboxTouchEnd(event) {
  if (!lightboxTouchStart || !event.changedTouches.length) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - lightboxTouchStart.x;
  const deltaY = touch.clientY - lightboxTouchStart.y;
  lightboxTouchStart = null;
  if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  moveLightbox(deltaX < 0 ? 1 : -1);
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return Promise.resolve(copied);
  } catch (error) {
    return Promise.resolve(false);
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function findProject(slug) {
  if (!slug) return null;
  return ALL_PRODUCTS.find((product) => product.slug === slug || product.id === slug) || null;
}

function assetUrl(path) {
  if (!path) return '';
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path;
  return new URL(path.replace(/^\/+/, ''), document.baseURI).href;
}

function icon(name) {
  const paths = ICON_PATHS[name] || ICON_PATHS.arrow;
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
