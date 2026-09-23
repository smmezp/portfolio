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
  const featured = getFeaturedProjects();
  return `
    <div class="view home-view">
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-kicker"><i></i> Available for selected commissions</p>
          <h1>Build a server<br>people <span class="hero-accent">remember.</span></h1>
          <p class="hero-lede">Custom Minecraft plugins, server systems and Discord solutions built for your server — with the detail, clarity and flexibility serious communities need.</p>
          <div class="button-row">
            <a class="button button-primary" href="/projects" data-route>View Projects <span aria-hidden="true">↗</span></a>
            ${renderDiscordLink('Hire Me', 'button button-ghost')}
          </div>
          <div class="hero-support">Minecraft developer · plugins · systems · integrations</div>
        </div>

        <div class="hero-stage" aria-label="Medeiros development workspace illustration">
          <div class="stage-frame">
            <div class="stage-topbar">
              <div class="stage-dots"><i></i><i></i><i></i></div>
              <span class="stage-label">medeiros / build-01</span>
            </div>
            <div class="stage-content">
              <div>
                <span class="stage-kicker">Minecraft Developer</span>
                <h2>Systems with a point of view.</h2>
              </div>
              <div class="stage-code" aria-label="Example project configuration">
                <div class="stage-code-line"><b>01</b><span><span class="blue">server</span>.<span class="cyan">connect</span>(<span class="green">"your-world"</span>)</span></div>
                <div class="stage-code-line"><b>02</b><span><span class="blue">lobby</span>.<span class="cyan">configure</span>(<span class="green">"without-limits"</span>)</span></div>
                <div class="stage-code-line"><b>03</b><span><span class="blue">player</span>.<span class="cyan">experience</span>(<span class="green">"feels-right"</span>)</span></div>
              </div>
              <div class="stage-footer"><span>Java · Paper · Velocity</span><strong>● live</strong></div>
            </div>
          </div>
          <div class="hero-mark"><span>ME</span></div>
        </div>
      </section>

      <div class="signal-strip reveal" aria-label="Development focus">
        <div class="signal-item"><b>01</b> Plugins</div>
        <div class="signal-item"><b>02</b> Server systems</div>
        <div class="signal-item"><b>03</b> Discord bots</div>
        <div class="signal-item"><b>04</b> Proxy development</div>
      </div>

      ${renderProjectStats()}

      <section class="section-block intro-grid reveal" id="about-preview">
        <h2>Technical depth.<br><span class="text-soft">Human clarity.</span></h2>
        <div class="intro-copy">
          <p>Medeiros is a developer focused on building custom plugins, server systems and Discord integrations that feel considered from the first interaction to the last configuration file.</p>
          <p>No unnecessary noise. Just a clear brief, thoughtful implementation and a result your team can actually use.</p>
          <a class="inline-link" href="/about" data-route>More about the approach <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="section-block reveal" id="services-preview">
        <div class="section-header">
          <div><p class="eyebrow">What I build</p><h2>Development that fits<br>your world.</h2></div>
          <div><p>From a single plugin to the systems around it, each commission starts with the experience you want players to have.</p><a class="section-link" href="/services" data-route>Explore services <span aria-hidden="true">↗</span></a></div>
        </div>
        <div class="service-grid">${SITE.services.slice(0, 4).map(renderServiceCard).join('')}</div>
      </section>

      <section class="section-block reveal" id="featured-projects">
        <div class="section-header">
          <div><p class="eyebrow">Selected work</p><h2>Projects with<br>purpose.</h2></div>
          <div><p><strong class="project-counter">${formatProjectCount(PROJECTS.length)}</strong> in the catalog. Every card opens a full project page with its own brief, features and gallery.</p><a class="section-link" href="/projects" data-route>View all projects <span aria-hidden="true">↗</span></a></div>
        </div>
        <div class="featured-projects-grid">${featured.length ? featured.map((project, index) => renderProjectCard(project, { featured: index === 0 })).join('') : renderEmptyProjects()}</div>
      </section>

      <section class="section-block tech-section reveal" id="technologies">
        <div><p class="eyebrow">The toolkit</p><h2>Built on tools that let the idea move fast.</h2></div>
        <div class="tech-grid">${SITE.technologies.map(renderTechnology).join('')}</div>
      </section>

      <section class="section-block process-section reveal">
        <div class="section-header"><div><p class="eyebrow">How it works</p><h2>Good work starts<br>with alignment.</h2></div><p>Simple process, focused communication and no black-box handoff.</p></div>
        <div class="process-grid">${SITE.process.map(renderProcessStep).join('')}</div>
      </section>

      ${renderCtaPanel()}
    </div>
  `;
}

function renderProjects() {
  return `
    <div class="view projects-view">
      <section class="page-heading reveal">
        <div class="page-heading-copy"><p class="eyebrow">Project catalog</p><h1>Selected systems,<br><span class="text-soft">fully documented.</span></h1><p>Explore plugins and server work built around a clear player experience and a maintainable technical foundation.</p></div>
        <div class="page-mark" aria-label="${escapeHTML(formatProjectCount(PROJECTS.length))}">${PROJECTS.length}<br>PROJECTS</div>
      </section>
      <section class="reveal" aria-label="Project filters">
        <div class="filter-toolbar">
          <div class="filter-list" role="group" aria-label="Filter projects by category">${FILTERS.map(renderFilterButton).join('')}</div>
          <label class="search-box"><span class="visually-hidden">Search projects</span>${icon('search')}<input type="search" data-project-search value="${escapeHTML(activeSearch)}" placeholder="Search projects" autocomplete="off"></label>
        </div>
        <div class="project-results-meta" aria-live="polite"><strong data-project-results-count>${escapeHTML(formatProjectCount(getFilteredProjects().length))}</strong><span>shown in the catalog</span></div>
        <div class="project-index-grid" data-project-grid>${renderFilteredProjectCards()}</div>
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
  return `${total} ${total === 1 ? 'Project' : 'Projects'}`;
}

function renderProjectStats() {
  const categoryStats = getProjectCategories().map((category) => `
    <div class="project-stat project-stat-category" aria-label="${escapeHTML(category)} — ${getProjectCount(category)}">
      <span>${escapeHTML(category)} <span aria-hidden="true">—</span></span>
      <strong>${getProjectCount(category)}</strong>
    </div>
  `).join('');
  return `
    <section class="project-stats reveal" aria-label="Project statistics">
      <div class="project-stat project-stat-total"><strong>${PROJECTS.length}</strong><span>${PROJECTS.length === 1 ? 'Project' : 'Projects'}</span></div>
      <div class="project-stat"><strong>${getFeaturedProjects().length}</strong><span>Featured</span></div>
      ${categoryStats}
    </section>
  `;
}

function renderFilterButton(filter) {
  const count = getProjectCount(filter);
  return `<button class="filter-button ${activeFilter === filter ? 'is-active' : ''}" type="button" data-filter="${escapeHTML(filter)}" aria-pressed="${activeFilter === filter}"><span>${escapeHTML(filter)}</span><strong>${count}</strong></button>`;
}

function renderDiscordLink(label, className = 'button button-primary') {
  return `<a class="${escapeHTML(className)}" href="${escapeHTML(DISCORD_SERVER_URL)}" data-discord-link target="_blank" rel="noopener noreferrer">${escapeHTML(label)} <span aria-hidden="true">↗</span></a>`;
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
      <section class="page-heading reveal"><div class="page-heading-copy"><p class="eyebrow">Capabilities</p><h1>Build the part of<br>your server that matters.</h1><p>Bring a mechanic, workflow or technical problem. We can turn it into a focused system that feels native to your server.</p></div><div class="page-mark" aria-label="${SITE.services.length} ways to build">${String(SITE.services.length).padStart(2, '0')}<br>WAYS TO BUILD</div></section>
      <section class="services-list reveal" aria-label="Services">${SITE.services.map(renderServiceRow).join('')}</section>
      ${renderCtaPanel()}
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="view about-view">
      <section class="page-heading reveal"><div class="page-heading-copy"><p class="eyebrow">About Medeiros</p><h1>Development for<br>worlds worth entering.</h1><p>A focused Minecraft developer portfolio for international server owners and teams looking to commission thoughtful technical work.</p></div></section>
      <section class="about-grid reveal">
        <div class="about-display"><p class="eyebrow">Medeiros</p><h2>Minecraft<br><span class="text-soft">Developer</span></h2><span class="about-signature">Plugins · systems · integrations</span></div>
        <div class="about-copy">
          <p>I specialize in Minecraft server development, custom plugins, server systems and Discord integrations.</p>
          <p>The goal is not to add complexity for its own sake. It is to make the right things possible: clearer player experiences, better operations and systems that remain understandable after handoff.</p>
          <p>Every project starts from the actual brief. No invented case studies, no inflated claims — just a focused build and a clean path from idea to implementation.</p>
          <div class="philosophy-list">
            <div class="philosophy-item"><span>01</span><div><h3>Make the experience legible</h3><p>Players should understand what a system is doing, and server teams should understand how to tune it.</p></div></div>
            <div class="philosophy-item"><span>02</span><div><h3>Prefer useful flexibility</h3><p>Configuration is valuable when it supports real decisions, not when it hides an unclear design.</p></div></div>
            <div class="philosophy-item"><span>03</span><div><h3>Leave a better handoff</h3><p>Documentation, structure and clear communication are part of the implementation — not an afterthought.</p></div></div>
          </div>
          <div class="about-tech"><h3>Working with</h3><div class="tag-list">${SITE.technologies.map((tech) => `<span class="tag">${escapeHTML(tech.name)}</span>`).join('')}</div></div>
        </div>
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
      <section class="page-heading reveal"><div class="page-heading-copy"><p class="eyebrow">Start a commission</p><h1>Want to work<br><span class="text-soft">together?</span></h1><p>Share the shape of the project, the problem you want to solve and where you want the experience to go. We can take it from there.</p></div><div class="page-mark" aria-hidden="true">LET'S<br>BUILD</div></section>
      <section class="contact-layout reveal">
        <div class="contact-intro">
          <p class="eyebrow">Primary contact</p>
          <h2>Bring the brief.<br>I’ll bring the system.</h2>
          <p>Discord is the fastest way to start a conversation. The form creates a concise brief you can copy and paste — it does not send anything automatically.</p>
           <div class="discord-card"><div><span class="discord-label">Discord</span><strong class="discord-handle">${escapeHTML(SITE.contact.discord)}</strong></div><div class="discord-actions"><button class="copy-button" type="button" data-copy-discord>Copy handle</button>${renderDiscordLink('Open Discord', 'button button-ghost button-small')}</div></div>
          <div class="commission-steps">
            <div class="commission-step"><span>01</span><div><strong>Send the context</strong><p>What are you building, and what should the player or team be able to do?</p></div></div>
            <div class="commission-step"><span>02</span><div><strong>Align on scope</strong><p>We turn the idea into a clear technical direction, priorities and next steps.</p></div></div>
            <div class="commission-step"><span>03</span><div><strong>Build with feedback</strong><p>Progress stays visible, focused and easy to discuss as the system takes shape.</p></div></div>
          </div>
        </div>
        <div class="commission-form-wrap">
          <div class="form-header"><div><p class="eyebrow no-dot">Commission brief</p><h2>Tell me about the build.</h2></div><p>Required fields are marked in the form. Nothing is sent from this page.</p></div>
          <form class="commission-form" id="commissionForm">
            <div class="field"><label for="commissionName">Name</label><input id="commissionName" name="name" type="text" placeholder="Your name" autocomplete="name" required></div>
            <div class="field"><label for="commissionDiscord">Discord username</label><input id="commissionDiscord" name="discord" type="text" placeholder="username" autocomplete="off" required></div>
            <div class="field"><label for="commissionEmail">Email</label><input id="commissionEmail" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
            <div class="field"><label for="commissionType">Project type</label><select id="commissionType" name="projectType" required><option value="" disabled selected>Select a project type</option>${projectOptions}</select></div>
            <div class="field"><label for="commissionBudget">Budget</label><select id="commissionBudget" name="budget" required><option value="" disabled selected>Select a range</option>${budgetOptions}</select></div>
            <div class="field field-wide"><label for="commissionDescription">Project description</label><textarea id="commissionDescription" name="description" placeholder="What are you hoping to build? Include useful context, existing systems and your ideal outcome." required></textarea></div>
            <div class="form-actions"><p class="form-note">Submitting prepares a shareable brief and copies it to your clipboard when your browser allows it.</p><button class="button button-primary" type="submit">Prepare brief <span aria-hidden="true">↗</span></button></div>
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
  return `
    <div class="view project-detail-view">
      <section class="project-detail-hero">
        <div class="detail-copy reveal">
          <div class="breadcrumbs"><a href="/projects" data-route>Projects</a><span>/</span><span>${escapeHTML(project.name)}</span></div>
          <div class="detail-labels"><span class="detail-label">${escapeHTML(project.categoryLabel || project.category)}</span><span class="detail-label status">${escapeHTML(project.status)}</span></div>
          <h1>${escapeHTML(project.name)}</h1>
          <p class="detail-description">${escapeHTML(project.shortDescription)}</p>
           <div class="button-row">${renderDiscordLink('Contact Me', 'button button-primary')}${renderProjectLinks(project)}</div>
           <div class="detail-meta"><div class="detail-meta-item"><span>Project year</span><strong>${escapeHTML(project.date || '—')}</strong></div><div class="detail-meta-item"><span>Engagement</span><strong>${escapeHTML(project.price || 'Scope on request')}</strong></div></div>
         </div>
         <div class="detail-visual image-frame reveal" data-image-frame>${renderProjectImage(project.images?.hero, `${project.name} project preview`, { loading: 'eager', fetchPriority: 'high' })}<div class="detail-visual-caption"><span>${escapeHTML(project.categoryLabel || project.category)}</span><span>${escapeHTML(project.status)}</span></div></div>
      </section>

      <section class="detail-content">
        <div>
          <section class="detail-section reveal"><p class="eyebrow">Overview</p><h2>Designed around<br>the actual brief.</h2><p>${escapeHTML(project.fullDescription)}</p></section>
          <section class="detail-subsection reveal"><p class="eyebrow">What it does</p><h3>Key features</h3><div class="feature-grid">${(project.features || []).map((feature, index) => `<div class="feature-item"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHTML(feature)}</strong></div>`).join('')}</div></section>
          ${details.length ? `<section class="detail-subsection reveal"><p class="eyebrow">Additional information</p><div class="details-grid">${details.map((detail) => `<article class="details-card"><h3>${escapeHTML(detail.title)}</h3><p>${escapeHTML(detail.body)}</p></article>`).join('')}</div></section>` : ''}
        </div>
        <aside class="detail-sidebar reveal"><div class="snapshot"><span class="snapshot-label">Technologies</span><div class="tag-list">${(project.technologies || []).map((technology) => `<span class="tag">${escapeHTML(technology)}</span>`).join('')}</div></div><div class="snapshot"><span class="snapshot-label">Status</span><strong class="text-soft">${escapeHTML(project.status)}</strong></div><div class="snapshot"><span class="snapshot-label">Need something similar?</span>${renderDiscordLink('Discuss a commission', 'inline-link')}</div></aside>
      </section>

       ${gallery.length ? `<section class="gallery-section reveal"><div class="gallery-header"><div><p class="eyebrow">Project gallery</p><h2>Inside the build.</h2></div><p>${String(gallery.length).padStart(2, '0')} views · click to expand</p></div><div class="gallery-grid">${gallery.map((image, index) => `<button class="gallery-item image-frame" type="button" data-image-frame data-lightbox-slug="${escapeHTML(project.slug)}" data-lightbox-index="${index + 1}" aria-label="Open ${escapeHTML(project.name)} gallery image ${index + 1}">${renderProjectImage(image, `${project.name} gallery image ${index + 1}`, { loading: 'lazy' })}<span>0${index + 1} / ${String(gallery.length).padStart(2, '0')}</span></button>`).join('')}</div></section>` : ''}
      ${renderVideoSection(project)}
       <section class="section-block reveal"><div class="section-header"><div><p class="eyebrow">Keep exploring</p><h2>More from the<br>project catalog.</h2></div><div><p><strong class="project-counter">${formatProjectCount(PROJECTS.length)}</strong> total</p><a class="section-link" href="/projects" data-route>Back to projects <span aria-hidden="true">↗</span></a></div></div><div class="project-index-grid">${PROJECTS.filter((item) => item.slug !== project.slug).map((item) => renderProjectCard(item)).join('')}</div></section>
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
  return `<section class="video-section reveal"><div class="gallery-header"><div><p class="eyebrow">Project video</p><h2>See it in motion.</h2></div></div><div class="video-frame">${videos}</div></section>`;
}

function renderProjectLinks(project) {
  const links = [];
  if (project.github) links.push(`<a class="button button-ghost button-small" href="${escapeHTML(project.github)}" target="_blank" rel="noreferrer">GitHub ${icon('external')}</a>`);
  if (project.links?.demo) links.push(`<a class="button button-ghost button-small" href="${escapeHTML(project.links.demo)}" target="_blank" rel="noreferrer">Demo ${icon('external')}</a>`);
  if (project.links?.download) links.push(`<a class="button button-ghost button-small" href="${escapeHTML(project.links.download)}" target="_blank" rel="noreferrer">Download ${icon('external')}</a>`);
  if (project.discord) links.push(renderDiscordLink('Discord', 'button button-ghost button-small'));
  return links.join('');
}

function renderProjectImage(path, alt, options = {}) {
  const source = assetUrl(path);
  if (!source) return renderImagePlaceholder(alt);
  const loading = options.loading || 'lazy';
  const fetchPriority = options.fetchPriority ? ` fetchpriority="${escapeHTML(options.fetchPriority)}"` : '';
  return `<img class="project-image" data-project-image src="${escapeHTML(source)}" alt="${escapeHTML(alt)}" loading="${escapeHTML(loading)}" decoding="async"${fetchPriority}>${renderImagePlaceholder(alt).replace(' aria-label=', ' hidden aria-label=')}`;
}

function renderImagePlaceholder(alt = 'Project preview') {
  return `<div class="image-placeholder" data-image-placeholder role="img" aria-label="${escapeHTML(alt)} — images coming soon"><strong>Project Preview</strong><span>Images coming soon</span></div>`;
}

function renderServiceCard(service) {
  return `<article class="service-card"><div class="service-card-top"><span class="service-number">${escapeHTML(service.number)}</span><span class="service-icon">${icon(service.icon)}</span></div><h3>${escapeHTML(service.title)}</h3><p>${escapeHTML(service.description)}</p><div class="service-card-bottom"><span class="mono-label">${escapeHTML(service.shortTitle)}</span><a class="inline-link" href="/contact?service=${encodeURIComponent(service.id)}" data-route>Request <span aria-hidden="true">↗</span></a></div></article>`;
}

function renderServiceRow(service) {
  return `<article class="service-row"><span class="service-row-number">${escapeHTML(service.number)}</span><h2>${escapeHTML(service.title)}</h2><p>${escapeHTML(service.description)}</p><a class="button button-ghost button-small" href="/contact?service=${encodeURIComponent(service.id)}" data-route>Request a commission <span aria-hidden="true">↗</span></a></article>`;
}

function renderProjectCard(project, options = {}) {
  const featured = options.featured ? ' project-card-featured' : '';
  const technologies = (project.technologies || []).slice(0, 4);
  return `<a class="project-card${featured}" href="/projects/${escapeHTML(project.slug)}" data-route><div class="project-card-image image-frame" data-image-frame>${renderProjectImage(project.images?.hero, `${project.name} project preview`)}<div class="project-card-overlay"><span class="project-category">${escapeHTML(project.categoryLabel || project.category)}</span><span class="project-status">${escapeHTML(project.status)}</span></div></div><div class="project-card-body"><div class="project-card-heading"><h3>${escapeHTML(project.name)}</h3><span class="mono-label">↗</span></div><p class="project-card-description">${escapeHTML(project.shortDescription)}</p><div class="tag-list">${technologies.map((technology) => `<span class="tag">${escapeHTML(technology)}</span>`).join('')}</div><div class="project-card-footer"><span class="project-card-year">${escapeHTML(project.date || 'Project')}</span><span class="inline-link">View project <span aria-hidden="true">↗</span></span></div></div></a>`;
}

function renderTechnology(technology) {
  return `<div class="tech-item"><span class="tech-mark">${escapeHTML(technology.mark)}</span><span>${escapeHTML(technology.name)}</span></div>`;
}

function renderProcessStep(step) {
  return `<article class="process-step"><span class="process-step-number">${escapeHTML(step.number)}</span><h3>${escapeHTML(step.title)}</h3><p>${escapeHTML(step.description)}</p></article>`;
}

function renderCtaPanel() {
  return `<section class="section-block cta-panel reveal"><div><p class="eyebrow">Have a project in mind?</p><h2>Let’s build something<br>for your server.</h2><p>Bring the idea, the problem or the rough shape of it. Start the conversation on Discord: <strong>${escapeHTML(SITE.contact.discord)}</strong>.</p></div>${renderDiscordLink('Contact Me', 'button button-primary')}</section>`;
}

function renderEmptyProjects(message = 'Projects are being prepared.') {
  return `<div class="empty-results"><strong>${escapeHTML(message)}</strong><span>Try another category or check back soon.</span></div>`;
}

function renderNotFound(title, message) {
  return `<div class="view not-found"><p class="eyebrow">404 / route unavailable</p><h1>${escapeHTML(title)}</h1><p>${escapeHTML(message)}</p><a class="button button-primary" href="/" data-route>Return home <span aria-hidden="true">↗</span></a></div>`;
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
