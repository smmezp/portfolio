'use strict';

/*
 * Medeiros portfolio runtime.
 * The page is a small dependency-free SPA: every route is rendered from the
 * centralized data files, so adding a project does not require new HTML.
 */

const SITE = window.MEDEIROS_SITE;
const PROJECTS = window.MEDEIROS_PROJECTS || [];
const DISCORD_SERVER_URL = SITE?.contact?.discordServer || 'https://discord.gg/Unbx6TpXwa';
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

initialize();

function initialize() {
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  document.addEventListener('click', handleClick);
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
  handleScroll();
  renderRoute(false);
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

function navigate(path) {
  const [pathname, query = ''] = path.split('?');
  const normalized = stripSiteBasePath(pathname);

  if (window.location.protocol === 'file:') {
    const next = `index.html?route=${encodeURIComponent(normalized + (query ? `?${query}` : ''))}`;
    window.history.pushState({}, '', next);
  } else {
    window.history.pushState({}, '', buildSitePath(normalized, query));
  }

  closeMobileNav();
  renderRoute(true);
}

function renderRoute(shouldScroll) {
  const location = getLocation();
  const path = location.pathname;
  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  let markup = '';
  let title = 'Medeiros — Minecraft Developer';
  let description = 'Custom Minecraft plugins, server systems and Discord solutions built for your server.';

  if (path === '/') {
    markup = renderHome();
  } else if (path === '/projects') {
    markup = renderProjects();
    title = 'Projects — Medeiros';
    description = 'Selected Minecraft plugins, Discord bots and server systems built by Medeiros.';
  } else if (projectMatch) {
    const project = findProject(projectMatch[1]);
    if (project) {
      markup = renderProjectDetail(project);
      title = `${project.name} — Medeiros`;
      description = project.shortDescription;
    } else {
      markup = renderNotFound('Project not found', 'This project is not in the current portfolio catalog.');
      title = 'Project not found — Medeiros';
    }
  } else if (path === '/services') {
    markup = renderServices();
    title = 'Services — Medeiros';
    description = 'Minecraft plugin development, server systems, Discord bots, proxy development and more.';
  } else if (path === '/about') {
    markup = renderAbout();
    title = 'About — Medeiros';
    description = 'Learn about Medeiros, a developer focused on maintainable Minecraft and Discord systems.';
  } else if (path === '/contact') {
    markup = renderContact();
    title = 'Contact — Medeiros';
    description = 'Tell Medeiros about your Minecraft or Discord development commission.';
  } else {
    markup = renderNotFound('Page not found', 'The route you requested does not exist.');
    title = 'Page not found — Medeiros';
  }

  app.innerHTML = markup;
  document.title = title;
  updateMeta(title, description);
  updateActiveNavigation(path);
  syncRouteLinks();
  setupReveal();
  setupImageFrames();
  syncDiscordLinks();

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
  const active = path.startsWith('/projects') ? 'projects' : path.slice(1) || 'home';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const isActive = link.dataset.navLink === active;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function renderHome() {
  const released = PROJECTS.filter((project) => project.status === 'Released');
  const collage = (released.length ? released : PROJECTS).slice(0, 3);
  const latest = PROJECTS.slice(0, 4);
  return `
    <div class="view home-view">
      <section class="hero">
        <div class="hero-copy">
          <p class="status-pill"><i></i> Open for commissions</p>
          <h1>Minecraft plugins, built to be <span class="mark">configured.</span></h1>
          <p class="lede">I’m Medeiros. I write Paper and Spigot plugins, Velocity tools and Discord bots for server owners who want something that fits their server instead of a one-size-fits-all pack.</p>
          <div class="button-row">
            <a class="button button-primary" href="/projects" data-route>See my plugins ${icon('arrow')}</a>
            ${renderDiscordLink('Hire me', 'button button-ghost')}
          </div>
          <ul class="hero-facts">
            <li><strong>${released.length}</strong> plugin${released.length === 1 ? '' : 's'} released on SpigotMC</li>
            <li><strong>Paper · Spigot · Velocity</strong></li>
            <li><strong>Multi-version</strong> support</li>
          </ul>
        </div>

        <div class="hero-collage" aria-label="Released plugins">
          <span class="pixel-cloud pixel-cloud-a" aria-hidden="true"></span>
          <span class="pixel-cloud pixel-cloud-b" aria-hidden="true"></span>
          ${collage.map((project, index) => `
            <a class="collage-card collage-card-${index + 1}" href="/projects/${escapeHTML(project.slug)}" data-route>
              <div class="image-frame" data-image-frame>${renderProjectImage(project.images?.hero, `${project.name} preview`, { loading: 'eager' })}</div>
              <span class="collage-caption">${escapeHTML(project.name)}</span>
            </a>`).join('')}
        </div>
      </section>

      <section class="section reveal" id="featured-projects">
        <div class="section-head">
          <div>
            <p class="eyebrow">Selected work</p>
            <h2>Plugins you can use today.</h2>
          </div>
          <div class="section-head-side">
            <p>Released plugins link straight to SpigotMC. Each one has its own page with screenshots and a feature list.</p>
            <a class="text-link" href="/projects" data-route>All projects ${icon('arrow')}</a>
          </div>
        </div>
        <div class="project-grid">${latest.length ? latest.map((project) => renderProjectCard(project)).join('') : renderEmptyProjects()}</div>
      </section>

      <section class="section reveal" id="services-preview">
        <div class="section-head">
          <div>
            <p class="eyebrow">Services</p>
            <h2>Work for hire.</h2>
          </div>
          <div class="section-head-side">
            <p>From a small fix to a full plugin. Bring the problem and we’ll work out the rest.</p>
            <a class="text-link" href="/services" data-route>All services ${icon('arrow')}</a>
          </div>
        </div>
        <div class="service-grid">${SITE.services.slice(0, 4).map(renderServiceCard).join('')}</div>
      </section>

      <section class="section reveal" id="process">
        <div class="section-head">
          <div>
            <p class="eyebrow">How it works</p>
            <h2>A commission, step by step.</h2>
          </div>
        </div>
        <div class="process-grid">${SITE.process.map(renderProcessStep).join('')}</div>
        <div class="toolbelt">
          <span class="toolbelt-label">Working with</span>
          <ul class="chips">${SITE.technologies.map((tech) => `<li class="chip">${escapeHTML(tech.name)}</li>`).join('')}</ul>
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
        <p class="eyebrow">Projects</p>
        <h1>Things I’ve built.</h1>
        <p class="page-lede">Plugins and server tools for Minecraft. Released ones link to SpigotMC, the rest are on the way.</p>
      </section>
      <section class="reveal" aria-label="Projects">
        ${showToolbar ? `
        <div class="filter-toolbar">
          <div class="filter-list" role="group" aria-label="Filter projects by category">${FILTERS.map(renderFilterButton).join('')}</div>
          <label class="search-box"><span class="visually-hidden">Search projects</span>${icon('search')}<input type="search" data-project-search value="${escapeHTML(activeSearch)}" placeholder="Search projects" autocomplete="off"></label>
        </div>
        <p class="results-meta" aria-live="polite"><strong data-project-results-count>${escapeHTML(formatProjectCount(getFilteredProjects().length))}</strong> shown</p>` : ''}
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

function getFeaturedProjects() {
  return PROJECTS.filter((project) => project.featured);
}

function formatProjectCount(count) {
  const total = Number.isFinite(Number(count)) ? Number(count) : 0;
  return `${total} ${total === 1 ? 'project' : 'projects'}`;
}

function renderFilterButton(filter) {
  const count = getProjectCount(filter);
  return `<button class="filter-button ${activeFilter === filter ? 'is-active' : ''}" type="button" data-filter="${escapeHTML(filter)}" aria-pressed="${activeFilter === filter}"><span>${escapeHTML(filter)}</span><strong>${count}</strong></button>`;
}

function renderDiscordLink(label, className = 'button button-primary') {
  return `<a class="${escapeHTML(className)}" href="${escapeHTML(DISCORD_SERVER_URL)}" data-discord-link target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ${icon('external')}</a>`;
}

function renderFilteredProjectCards() {
  const query = activeSearch.trim().toLowerCase();
  const filtered = getFilteredProjects();
  return filtered.length ? filtered.map((project) => renderProjectCard(project)).join('') : renderEmptyProjects(query ? 'No projects match that search.' : 'No projects in this category yet.');
}

function getFilteredProjects() {
  const query = activeSearch.trim().toLowerCase();
  return PROJECTS.filter((project) => {
    const categoryMatch = activeFilter === 'All' || project.category === activeFilter;
    const haystack = [project.name, project.shortDescription, project.fullDescription, project.category, ...(project.technologies || []), ...(project.features || [])].join(' ').toLowerCase();
    return categoryMatch && (!query || haystack.includes(query));
  });
}

function renderServices() {
  return `
    <div class="view services-view">
      <section class="page-head reveal">
        <p class="eyebrow">Services</p>
        <h1>What I can build for you.</h1>
        <p class="page-lede">Bring a mechanic, a workflow or a bug. I’ll tell you what it takes and what it costs before we start.</p>
      </section>
      <section class="service-list reveal" aria-label="Services">${SITE.services.map(renderServiceRow).join('')}</section>
      ${renderCtaPanel()}
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="view about-view">
      <section class="page-head reveal">
        <p class="eyebrow">About</p>
        <h1>Hi, I’m Medeiros.</h1>
        <p class="page-lede">I’m a Minecraft developer. I make plugins for Paper and Spigot, tools for Velocity networks and Discord bots that keep a community in sync with its server.</p>
      </section>
      <section class="about-grid reveal">
        <div class="about-copy">
          <p>I release my own plugins on SpigotMC and take commissions from servers that need something specific. Everything I build is meant to be configured by the people who run the server, not just by me.</p>
          <p>If something I made breaks on your server, I want to hear about it. Fixes and updates are part of the work.</p>
          <div class="principles">
            <div class="principle"><h3>Clear for players</h3><p>People should understand what a system is doing the moment they see it.</p></div>
            <div class="principle"><h3>Flexible for staff</h3><p>Settings are there for real decisions, with sensible defaults so nothing needs tuning on day one.</p></div>
            <div class="principle"><h3>Easy to hand over</h3><p>Readable config and clear structure, so your team can keep running it without me.</p></div>
          </div>
        </div>
        <aside class="about-card">
          <h3>Working with</h3>
          <ul class="chips">${SITE.technologies.map((tech) => `<li class="chip">${escapeHTML(tech.name)}</li>`).join('')}</ul>
          <h3>Find me</h3>
          <p class="about-handle">Discord: <strong>${escapeHTML(SITE.contact.discord)}</strong></p>
          ${renderDiscordLink('Open Discord', 'button button-primary button-small')}
        </aside>
      </section>
      ${renderCtaPanel()}
    </div>
  `;
}

function renderContact() {
  const projectOptions = SITE.projectTypes.map((type) => `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`).join('');
  const budgetOptions = SITE.budgets.map((budget) => `<option value="${escapeHTML(budget)}">${escapeHTML(budget)}</option>`).join('');
  return `
    <div class="view contact-view">
      <section class="page-head reveal">
        <p class="eyebrow">Contact</p>
        <h1>Want to work together?</h1>
        <p class="page-lede">Discord is the fastest way to reach me. You can also fill in the brief below and paste it to me there.</p>
      </section>
      <section class="contact-layout reveal">
        <div class="contact-intro">
          <div class="discord-card">
            <div><span class="discord-label">Discord</span><strong class="discord-handle">${escapeHTML(SITE.contact.discord)}</strong></div>
            <div class="discord-actions"><button class="button button-ghost button-small" type="button" data-copy-discord>Copy handle</button>${renderDiscordLink('Open Discord', 'button button-primary button-small')}</div>
          </div>
          <ol class="steps">
            <li><strong>Tell me what you need</strong><span>What are you building, and what should players or staff be able to do?</span></li>
            <li><strong>We agree on scope</strong><span>I reply with a plan, a price and a rough timeline.</span></li>
            <li><strong>I build, you review</strong><span>You see progress along the way and can ask for changes.</span></li>
          </ol>
        </div>
        <div class="form-card">
          <h2>Commission brief</h2>
          <p class="form-hint">Nothing is sent from this page. The brief is copied so you can paste it to me on Discord.</p>
          <form class="commission-form" id="commissionForm">
            <div class="field"><label for="commissionName">Name</label><input id="commissionName" name="name" type="text" placeholder="Your name" autocomplete="name" required></div>
            <div class="field"><label for="commissionDiscord">Discord username</label><input id="commissionDiscord" name="discord" type="text" placeholder="username" autocomplete="off" required></div>
            <div class="field"><label for="commissionEmail">Email</label><input id="commissionEmail" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
            <div class="field"><label for="commissionType">Project type</label><select id="commissionType" name="projectType" required><option value="" disabled selected>Select a project type</option>${projectOptions}</select></div>
            <div class="field"><label for="commissionBudget">Budget</label><select id="commissionBudget" name="budget" required><option value="" disabled selected>Select a range</option>${budgetOptions}</select></div>
            <div class="field field-wide"><label for="commissionDescription">What do you need?</label><textarea id="commissionDescription" name="description" placeholder="Describe the idea, the server it’s for and anything it needs to work with." required></textarea></div>
            <div class="form-actions"><button class="button button-primary" type="submit">Prepare brief ${icon('arrow')}</button></div>
            <p class="form-status" id="commissionStatus" aria-live="polite"></p>
            <pre class="brief-preview" id="briefPreview" hidden></pre>
          </form>
        </div>
      </section>
    </div>
  `;
}

function renderProjectDetail(project) {
  const gallery = Array.isArray(project.images?.gallery) ? project.images.gallery : [];
  const details = Array.isArray(project.details) ? project.details : [];
  const others = PROJECTS.filter((item) => item.slug !== project.slug);
  return `
    <div class="view project-detail-view">
      <section class="detail-hero">
        <div class="detail-copy reveal">
          <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/projects" data-route>Projects</a><span>/</span><span>${escapeHTML(project.name)}</span></nav>
          <div class="detail-labels"><span class="chip">${escapeHTML(project.categoryLabel || project.category)}</span>${renderStatusBadge(project.status)}</div>
          <h1>${escapeHTML(project.name)}</h1>
          <p class="detail-description">${escapeHTML(project.shortDescription)}</p>
          <div class="button-row">${renderProjectLinks(project)}</div>
          <dl class="detail-meta">
            <div><dt>Year</dt><dd>${escapeHTML(project.date || '—')}</dd></div>
            <div><dt>Price</dt><dd>${escapeHTML(project.price || 'On request')}</dd></div>
            <div><dt>Status</dt><dd>${escapeHTML(project.status)}</dd></div>
          </dl>
        </div>
        <div class="detail-visual image-frame reveal" data-image-frame>${renderProjectImage(project.images?.hero, `${project.name} project preview`, { loading: 'eager', fetchPriority: 'high' })}</div>
      </section>

      <section class="detail-body">
        <div class="detail-main">
          <section class="detail-block reveal"><p class="eyebrow">Overview</p><p class="detail-overview">${escapeHTML(project.fullDescription)}</p></section>
          <section class="detail-block reveal"><p class="eyebrow">Features</p><ul class="check-list">${(project.features || []).map((feature) => `<li>${escapeHTML(feature)}</li>`).join('')}</ul></section>
          ${details.length ? `<section class="detail-block reveal"><div class="details-grid">${details.map((detail) => `<article class="details-card"><h3>${escapeHTML(detail.title)}</h3><p>${escapeHTML(detail.body)}</p></article>`).join('')}</div></section>` : ''}
        </div>
        <aside class="detail-side reveal">
          <div class="side-card"><span class="side-label">Built with</span><ul class="chips">${(project.technologies || []).map((technology) => `<li class="chip">${escapeHTML(technology)}</li>`).join('')}</ul></div>
          <div class="side-card"><span class="side-label">Need something similar?</span><p>I take commissions for custom plugins and configuration.</p>${renderDiscordLink('Talk on Discord', 'button button-primary button-small')}</div>
        </aside>
      </section>

      ${gallery.length ? `<section class="detail-section reveal"><div class="section-head"><div><p class="eyebrow">Screenshots</p><h2>In the game.</h2></div><p class="section-head-note">Tap an image to enlarge.</p></div><div class="gallery-grid">${gallery.map((image, index) => `<button class="gallery-item image-frame" type="button" data-image-frame data-lightbox-slug="${escapeHTML(project.slug)}" data-lightbox-index="${index + 1}" aria-label="Open ${escapeHTML(project.name)} screenshot ${index + 1}">${renderProjectImage(image, `${project.name} screenshot ${index + 1}`, { loading: 'lazy' })}</button>`).join('')}</div></section>` : ''}
      ${renderVideoSection(project)}
      ${others.length ? `<section class="detail-section reveal"><div class="section-head"><div><p class="eyebrow">More</p><h2>Other projects.</h2></div><a class="text-link" href="/projects" data-route>All projects ${icon('arrow')}</a></div><div class="project-grid">${others.map((item) => renderProjectCard(item)).join('')}</div></section>` : ''}
      ${renderCtaPanel()}
    </div>
  `;
}

function renderVideoSection(project) {
  if (!Array.isArray(project.videos) || !project.videos.length) return '';
  const videos = project.videos.map((video) => {
    if (typeof video === 'string') return `<video controls preload="metadata" src="${escapeHTML(assetUrl(video))}"></video>`;
    if (video.type === 'youtube' || video.type === 'vimeo') return `<iframe src="${escapeHTML(video.src)}" title="${escapeHTML(video.title || `${project.name} video`)}" loading="lazy" allowfullscreen></iframe>`;
    return `<video controls preload="metadata" src="${escapeHTML(assetUrl(video.src || ''))}"${video.poster ? ` poster="${escapeHTML(assetUrl(video.poster))}"` : ''}></video>`;
  }).join('');
  return `<section class="detail-section reveal"><div class="section-head"><div><p class="eyebrow">Video</p><h2>See it in action.</h2></div></div><div class="video-frame">${videos}</div></section>`;
}

function renderProjectLinks(project) {
  const links = [];
  if (project.links?.download) links.push(`<a class="button button-primary" href="${escapeHTML(project.links.download)}" target="_blank" rel="noopener noreferrer">Download on SpigotMC ${icon('external')}</a>`);
  if (project.links?.demo) links.push(`<a class="button button-ghost" href="${escapeHTML(project.links.demo)}" target="_blank" rel="noopener noreferrer">Demo ${icon('external')}</a>`);
  if (project.github) links.push(`<a class="button button-ghost" href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">GitHub ${icon('external')}</a>`);
  if (!links.length) links.push(renderDiscordLink('Ask about it on Discord', 'button button-primary'));
  return links.join('');
}

function renderStatusBadge(status) {
  const live = String(status || '').toLowerCase() === 'released';
  return `<span class="badge ${live ? 'badge-live' : 'badge-dev'}"><i></i>${escapeHTML(status || '')}</span>`;
}

function renderProjectImage(path, alt, options = {}) {
  const source = assetUrl(path);
  if (!source) return renderImagePlaceholder(alt);
  const loading = options.loading || 'lazy';
  const fetchPriority = options.fetchPriority ? ` fetchpriority="${escapeHTML(options.fetchPriority)}"` : '';
  return `<img class="project-image" data-project-image src="${escapeHTML(source)}" alt="${escapeHTML(alt)}" loading="${escapeHTML(loading)}" decoding="async"${fetchPriority}>${renderImagePlaceholder(alt).replace(' aria-label=', ' hidden aria-label=')}`;
}

function renderImagePlaceholder(alt = 'Project preview') {
  return `<div class="image-placeholder" data-image-placeholder role="img" aria-label="${escapeHTML(alt)} — preview coming soon"><span class="pixel-cloud" aria-hidden="true"></span><strong>Preview coming soon</strong></div>`;
}

function renderServiceCard(service) {
  return `<article class="service"><h3>${escapeHTML(service.title)}</h3><p>${escapeHTML(service.description)}</p><a class="text-link" href="/contact?service=${encodeURIComponent(service.id)}" data-route>Request this ${icon('arrow')}</a></article>`;
}

function renderServiceRow(service) {
  return `<article class="service-row"><h2>${escapeHTML(service.title)}</h2><p>${escapeHTML(service.description)}</p><a class="button button-ghost button-small" href="/contact?service=${encodeURIComponent(service.id)}" data-route>Request this ${icon('arrow')}</a></article>`;
}

function renderProjectCard(project) {
  const technologies = (project.technologies || []).slice(0, 4);
  return `<a class="project-card" href="/projects/${escapeHTML(project.slug)}" data-route>
    <div class="project-card-media image-frame" data-image-frame>${renderProjectImage(project.images?.hero, `${project.name} project preview`)}</div>
    <div class="project-card-body">
      <div class="project-card-top"><h3>${escapeHTML(project.name)}</h3>${renderStatusBadge(project.status)}</div>
      <p>${escapeHTML(project.shortDescription)}</p>
      <div class="project-card-foot"><ul class="chips">${technologies.map((technology) => `<li class="chip">${escapeHTML(technology)}</li>`).join('')}</ul><span class="project-card-price">${escapeHTML(project.price || '')}</span></div>
    </div>
  </a>`;
}

function renderProcessStep(step, index) {
  return `<article class="process-step"><span class="step-number">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHTML(step.title)}</h3><p>${escapeHTML(step.description)}</p></article>`;
}

function renderCtaPanel() {
  return `<section class="cta-panel reveal"><div><h2>Need something built?</h2><p>Message me on Discord and tell me what your server needs. I’ll tell you what it takes.</p></div><div class="cta-actions">${renderDiscordLink('Message me on Discord', 'button button-light')}<span class="cta-handle">${escapeHTML(SITE.contact.discord)}</span></div></section>`;
}

function renderEmptyProjects(message = 'Projects are on the way.') {
  return `<div class="empty-results"><strong>${escapeHTML(message)}</strong><span>Try another category or check back soon.</span></div>`;
}

function renderNotFound(title, message) {
  return `<div class="view not-found"><p class="eyebrow">404</p><h1>${escapeHTML(title)}</h1><p class="page-lede">${escapeHTML(message)}</p><a class="button button-primary" href="/" data-route>Back to home ${icon('arrow')}</a></div>`;
}

function handleClick(event) {
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
      showToast(copied ? 'Discord handle copied.' : `Discord: ${SITE.contact.discord}`);
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
  const brief = [
    'Medeiros commission brief',
    '-------------------------',
    `Name: ${data.get('name')}`,
    `Discord: ${data.get('discord')}`,
    `Email: ${data.get('email')}`,
    `Project type: ${data.get('projectType')}`,
    `Budget: ${data.get('budget')}`,
    '',
    'Project description:',
    String(data.get('description') || '').trim()
  ].join('\n');

  const preview = document.getElementById('briefPreview');
  const status = document.getElementById('commissionStatus');
  if (preview) {
    preview.hidden = false;
    preview.textContent = brief;
  }

  copyToClipboard(brief).then((copied) => {
    if (status) status.textContent = copied ? 'Brief prepared and copied. Paste it into Discord when you are ready.' : 'Brief prepared below. Copy it and send it to smmezp on Discord.';
    showToast(copied ? 'Commission brief copied.' : 'Commission brief prepared.');
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
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
}

function initializeContactForm(query) {
  const typeSelect = document.getElementById('commissionType');
  const description = document.getElementById('commissionDescription');
  if (!typeSelect) return;

  const serviceId = query.get('service');
  const projectSlug = query.get('project');
  const service = SITE.services.find((item) => item.id === serviceId);
  const project = findProject(projectSlug);
  if (service) {
    const matchingType = [...typeSelect.options].find((option) => option.textContent.toLowerCase().includes(service.shortTitle.toLowerCase().replace('plugins', 'plugin')) || option.textContent.toLowerCase().includes(service.title.toLowerCase().split(' ')[0]));
    if (matchingType) typeSelect.value = matchingType.value;
  }
  if (project && description) {
    const categoryHints = [project.categoryLabel, project.category]
      .filter(Boolean)
      .map((value) => value.toLowerCase());
    const projectType = [...typeSelect.options].find((option) => {
      const optionValue = option.value.toLowerCase();
      return categoryHints.some((hint) => optionValue.includes(hint) || hint.includes(optionValue.replace(/s$/, '')));
    });
    if (projectType) typeSelect.value = projectType.value;
    description.value = `Project reference: ${project.name}\n\n`;
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
  const isOpen = mobileNav.classList.toggle('is-open');
  header.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

function closeMobileNav() {
  if (!mobileNav.classList.contains('is-open')) return;
  mobileNav.classList.remove('is-open');
  header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}

function openLightbox(slug, index) {
  const project = findProject(slug);
  if (!project) return;
  activeGallery = [
    { src: project.images?.hero, label: `${project.name} · hero` },
    ...((project.images?.gallery || []).map((src, galleryIndex) => ({ src, label: `${project.name} · gallery ${String(galleryIndex + 1).padStart(2, '0')}` })))
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
  return PROJECTS.find((project) => project.slug === slug || project.id === slug) || null;
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
