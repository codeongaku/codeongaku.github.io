/* 
  script.js — Main Portfolio Script
  Handles: theme switching, typing animation, data loading,
            collapse toggles, scroll reveals, active nav
 */

// Theme Switcher
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

// Typing Animation
const TYPING_STRINGS = [
  'Software Engineering Student',
  'Frontend Developer',
  'UI/UX Designer',
];

// Start typing animation when page loads
window.addEventListener('load', () => {
  const el = document.getElementById('typing-text');
  if (!el) return;

  let strIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = TYPING_STRINGS[strIdx];
    if (!deleting) {
      charIdx++;
      el.innerHTML = current.substring(0, charIdx) + '<span class="typing-cursor"></span>';
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      charIdx--;
      el.innerHTML = current.substring(0, charIdx) + '<span class="typing-cursor"></span>';
      if (charIdx === 0) {
        deleting = false;
        strIdx = (strIdx + 1) % TYPING_STRINGS.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, deleting ? 45 : 90);
  }
  setTimeout(tick, 600);
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('main section[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// Scroll reveal
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// Collapse toggles for past experience (employment, leadership, volunteer, academic)
function setupCollapse(btnId, contentId) {
  const btn = document.getElementById(btnId);
  const content = document.getElementById(contentId);
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isOpen = content.classList.toggle('active');
    btn.classList.toggle('open', isOpen);
    const arrow = btn.querySelector('.collapse-arrow');
    if (arrow) arrow.textContent = isOpen ? '▲' : '▼';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupCollapse('togglePastEmployment',  'past-employment-content');
  setupCollapse('togglePastLeadership',  'past-leadership-content');
  setupCollapse('togglePastVolunteer',   'past-volunteer-content');
  setupCollapse('togglePastAcademic',    'past-academic-content');
});

// Section builders - Following prev. format in past-index.html
// Possible addition: <div class="project-image-placeholder">Image</div>
function buildProjectCard(p) {
    const source  = p.source ? `<p class="project-source">${p.source}</p>` : '';
    const actions = (p.links.github || p.links.casestudy)
        ? `<div class="card-actions">
            ${p.links.github    ? `<a href="${p.links.github}" target="_blank" class="card-btn btn-ghost">GitHub</a>` : ''}
            ${p.links.casestudy ? `<a href="${p.links.casestudy}" class="card-btn btn-accent">View Case Study</a>` : ''}
           </div>`
        : '';
    return `
        <div class="project-card">
            <h4>${p.title}</h4>
            ${source}
            <p class="project-summary">${p.summary}</p>
            <p class="project-tech">${p.tech}</p>
            ${actions}
        </div>`;
}

function buildTimelineEntry(e) {
  const points  = e.points.map(pt => `<li>${pt}</li>`).join('');
  const isRight = e.side === 'right';
  if (isRight) {
    return `
      <div class="timeline-entry reveal">
        <div class="entry-date left-date">${e.date}</div>
        <div class="entry-spacer"></div>
        <div class="entry-content right-content">
          <h4>${e.title}</h4>
          <p class="company">${e.company}</p>
          <ul>${points}</ul>
        </div>
      </div>`;
  } else {
    return `
      <div class="timeline-entry reversed reveal">
        <div class="entry-content left-content">
          <h4>${e.title}</h4>
          <p class="company">${e.company}</p>
          <ul>${points}</ul>
        </div>
        <div class="entry-spacer"></div>
        <div class="entry-date right-date">${e.date}</div>
      </div>`;
  }
}

function buildSkillPill(s) {
  return `
      <div class="skill-pill">
          <img src="${s.icon}" class="skill-icon" alt="" />
          <span>${s.name}</span>
      </div>`;
}

// Append rendered HTML into a container; logs a warning if selector not found.
function populateGrid(selector, items, builder) {
  const el = document.querySelector(selector);
  if (!el) { console.warn(`populateGrid: "${selector}" not found`); return; }
  el.innerHTML = items.map(builder).join('');
  // Trigger reveal on newly inserted items
  el.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));
}

// Append timeline entries into a container
function populateTimeline(selector, items) {
  const el = document.querySelector(selector);
  if (!el) { console.warn(`populateTimeline: "${selector}" not found`); return; }
  el.insertAdjacentHTML('beforeend', items.map(buildTimelineEntry).join(''));
  el.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));
}

// Loading data from .json files

async function loadData() {
  try {
    const [projects, skills, experience] = await Promise.all([
      fetch('data/projects.json').then(r => r.json()),
      fetch('data/skills.json').then(r => r.json()),
      fetch('data/experience.json').then(r => r.json()),
    ]);

    // Skills
    populateGrid('.languages .skill-pills',  skills.languages,  buildSkillPill);
    populateGrid('.frameworks .skill-pills', skills.frameworks, buildSkillPill);
    populateGrid('.tools .skill-pills',      skills.tools,      buildSkillPill);

    // Experience
    populateTimeline('.professional-timeline',      experience.professional);
    populateTimeline('.past-professional-timeline', experience.professional_past);

    // Leadership & Volunteer
    populateTimeline('.leadership-timeline',      experience.leadership);
    populateTimeline('.past-leadership-timeline', experience.leadership_past);
    populateTimeline('.volunteer-timeline',       experience.volunteer);
    populateTimeline('.past-volunteer-timeline',  experience.volunteer_past);

    // Projects
    populateGrid('.internship-grid',    projects.internship,    buildProjectCard);
    populateGrid('.academic-grid',      projects.academic,      buildProjectCard);
    populateGrid('.past-academic-grid', projects.academic_past, buildProjectCard);
    populateGrid('.personal-grid',      projects.personal,      buildProjectCard);

  } catch (err) {
    console.error('Failed to load portfolio data:', err);
  }
}

loadData();
