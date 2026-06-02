/*
   casescript.js — Case Study Page Script
   Loads casestudy.json and builds all tab content dynamically
 */

// Theme Switcher (shared)
(function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'obsidian';
  document.documentElement.setAttribute('data-theme', saved);
})();

function setTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('portfolio-theme', name);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === name);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('portfolio-theme') || 'obsidian';
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });
});

// Tab Switching
function switchTab(id) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const tabBtn = document.getElementById('tab-' + id);
  const tabPanel = document.getElementById('panel-' + id);
  if (tabBtn) { tabBtn.classList.add('active'); tabBtn.setAttribute('aria-selected', 'true'); }
  if (tabPanel) tabPanel.classList.add('active');
}

// Support hash links
function initHashTab() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('panel-' + hash)) {
    switchTab(hash);
  }
}

// Builders

function buildTags(tags) {
  return tags.map(t =>
    `<span class="cs-tag${t.highlight ? ' highlight' : ''}">${t.label}</span>`
  ).join('');
}

function buildProcessSteps(steps) {
  return steps.map(s => `
    <div class="process-step">
      <h4>${s.title}</h4>
      <p>${s.description}</p>
    </div>`).join('');
}

function buildInfoCard(card) {
  const points = card.points.map(p => `<li>${p}</li>`).join('');
  return `
    <div class="info-card">
      <h4>${card.title}</h4>
      <ul>${points}</ul>
    </div>`;
}

function buildTechPills(tech) {
  return tech.map(t => `<span class="tech-pill">${t}</span>`).join('');
}

function buildImgGrid(designs) {
  return designs.map(d => `
    <div class="img-placeholder">
      <span class="ph-icon">🖼</span>
      <span>${d.label}</span>
    </div>`).join('');
}

function buildResearchSection(research) {
  if (!research) return '';
  return `
    <div class="cs-section">
      <p class="cs-section-label">Research</p>
      <div class="cs-two-col">
        ${buildInfoCard(research.primary)}
        ${buildInfoCard(research.secondary)}
      </div>
    </div>`;
}

function buildRolesSection(roles, label) {
  if (!roles) return '';
  return `
    <div class="cs-section">
      <p class="cs-section-label">${label || 'My Role'}</p>
      <div class="cs-two-col">
        ${buildInfoCard(roles.design)}
        ${buildInfoCard(roles.engineering)}
      </div>
    </div>`;
}

function buildKeyDecisions(decisions) {
  if (!decisions || !decisions.length) return '';
  return `
    <div class="cs-section">
      <p class="cs-section-label">Key Decisions</p>
      <div class="cs-two-col">
        ${decisions.map(buildInfoCard).join('')}
      </div>
    </div>`;
}

function buildOutcome(outcome) {
  if (!outcome) return '';
  return `
    <div class="cs-section">
      <p class="cs-section-label">Outcome</p>
      <div class="outcome-banner">
        <span class="outcome-icon">${outcome.icon}</span>
        <p>${outcome.text}</p>
      </div>
    </div>`;
}

function buildCaseStudyPanel(cs) {
  return `
    <div class="tab-panel" id="panel-${cs.id}" role="tabpanel" aria-labelledby="tab-${cs.id}">

      <div class="cs-header">
        <div>
          <h2>${cs.title}</h2>
          <p class="subtitle">${cs.subtitle}</p>
        </div>
        <div class="cs-meta">
          ${buildTags(cs.tags)}
        </div>
      </div>

      <div class="cs-section">
        <p class="cs-section-label">Overview</p>
        <p>${cs.overview}</p>
      </div>

      <div class="cs-section">
        <p class="cs-section-label">The Problem</p>
        <p>${cs.problem}</p>
      </div>

      ${buildResearchSection(cs.research)}
      ${buildRolesSection(cs.roles, cs.id === 'navis' ? 'My Role — Mobile App' : 'My Role')}

      <div class="cs-section">
        <p class="cs-section-label">${cs.id === 'navis' ? 'Design Considerations' : 'Design Process'}</p>
        <div class="process-steps">
          ${buildProcessSteps(cs.process)}
        </div>
      </div>

      ${buildKeyDecisions(cs.keyDecisions)}

      <div class="cs-section">
        <p class="cs-section-label">Designs</p>
        <div class="img-grid">
          ${buildImgGrid(cs.designs)}
        </div>
      </div>

      <div class="cs-section">
        <p class="cs-section-label">Tech Used</p>
        <div class="tech-pills">
          ${buildTechPills(cs.tech)}
        </div>
      </div>

      ${buildOutcome(cs.outcome)}
    </div>`;
}

function buildTabButton(cs, index) {
  const num = String(index + 1).padStart(2, '0');
  const isFirst = index === 0;
  return `
    <button
      class="tab-btn${isFirst ? ' active' : ''}"
      role="tab"
      aria-selected="${isFirst ? 'true' : 'false'}"
      aria-controls="panel-${cs.id}"
      id="tab-${cs.id}"
      onclick="switchTab('${cs.id}')">
      ${cs.title} <span class="tab-num">${num}</span>
    </button>`;
}

/* ---- INIT ---- */
async function loadCaseStudies() {
  try {
    const data = await fetch('data/casestudy.json').then(r => r.json());
    const studies = data.casestudies;

    const nav = document.querySelector('.tab-nav');
    const wrapper = document.querySelector('.tab-wrapper');

    if (nav) nav.innerHTML = studies.map(buildTabButton).join('');

    // Build panels and insert after tab-nav
    const panelsHTML = studies.map(buildCaseStudyPanel).join('');
    const panelContainer = document.getElementById('tab-panels');
    if (panelContainer) {
      panelContainer.innerHTML = panelsHTML;
    } else {
      // fallback: append to wrapper
      if (wrapper) wrapper.insertAdjacentHTML('beforeend', panelsHTML);
    }

    // Activate first tab
    if (studies.length > 0) {
      const firstPanel = document.getElementById('panel-' + studies[0].id);
      if (firstPanel) firstPanel.classList.add('active');
    }

    // Handle hash
    initHashTab();

  } catch (err) {
    console.error('Failed to load case studies:', err);
  }
}

loadCaseStudies();
