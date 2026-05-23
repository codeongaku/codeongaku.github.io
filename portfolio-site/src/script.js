// Typing animation
const text = "Software Engineering Student";
const typingElement = document.getElementById("typing-text");
let index = 0;
let isDeleting = false;
let pause = false;

function type() {
    if (!isDeleting && index <= text.length) {
        typingElement.innerHTML = text.substring(0, index) + '<span class="typing-cursor"></span>';
        index++;
        
        if (index > text.length) {
            pause = true;
            setTimeout(() => {
                pause = false;
            }, 2000); // Pause for 2 seconds when fully typed
        }
    }
    
    const speed = isDeleting ? 50 : 100;
    if (!pause) {
        setTimeout(type, speed);
    } else {
        setTimeout(type, 2000);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(type, 500); // Start after 0.5 second delay
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.style.backgroundColor = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }
    });
});


// Toggle functionality for Past Experiences button
document.addEventListener('DOMContentLoaded', () => {
    // --- Employment Toggle ---
    const toggleButtonEmployment = document.getElementById('togglePastEmployment');
    const contentDivEmployment = document.getElementById('past-employment-content');

    // --- Leadership Toggle ---
    const toggleButtonLeadership = document.getElementById('togglePastLeadership');
    const contentDivLeadership = document.getElementById('past-leadership-content');
    
    // --- Volunteer Toggle ---
    const toggleButtonVolunteer = document.getElementById('togglePastVolunteer');
    const contentDivVolunteer = document.getElementById('past-volunteer-content');

    // --- Academic Projects Toggle ---
    const toggleButtonAcademic = document.getElementById('togglePastAcademic');
    const contentDivAcademic = document.getElementById('past-academic-content');
    
    // Generic function to handle the toggle
    const setupToggle = (button, content) => {
        if (button && content) {
            button.addEventListener('click', () => {
                content.classList.toggle('active');
                
                // Update the button text dynamically
                let originalText = button.textContent;
                
                if (button.id === 'togglePastEmployment') {
                    originalText = 'Past Employment Experiences';
                } else if (button.id === 'togglePastVolunteer') {
                    originalText = 'Past Volunteer/Mentorship Experiences';
                } else if (button.id === 'togglePastVolunteer') {
                    originalText = 'Past Volunteer/Mentorship Experiences';
                } else if (button.id === 'togglePastAcademic') {
                    originalText = 'Past Academic Projects';
                }
                
                button.textContent = content.classList.contains('active') ? `Hide ${originalText}` : originalText;
            });
        }
    };

    setupToggle(toggleButtonEmployment, contentDivEmployment);
    setupToggle(toggleButtonLeadership, contentDivLeadership);
    setupToggle(toggleButtonVolunteer, contentDivVolunteer);
    setupToggle(toggleButtonAcademic, contentDivAcademic); // NEW

});

// Section Builders

// Following prev. format in past-index.html
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
            <div class="project-image-placeholder">Image Placeholder</div>
            <h4>${p.title}</h4>
            ${source}
            <p class="project-summary">${p.summary}</p>
            <p class="project-tech">${p.tech}</p>
            ${actions}
        </div>`;
}
 
// Following prev. format in past-index.html
function buildTimelineEntry(e) {
    const points   = e.points.map(pt => `<li>${pt}</li>`).join('');
    const isRight  = e.side === 'right';  // "right" = date on left, content on right
    return `
        <div class="timeline-entry ${isRight ? '' : 'reversed'}">
            ${isRight  ? `<div class="entry-date left-date">${e.date}</div>` : ''}
            <div class="entry-content ${isRight ? 'right-content' : 'left-content'}">
                <h4>${e.title}</h4>
                <p class="company">${e.company}</p>
                <ul>${points}</ul>
            </div>
            ${!isRight ? `<div class="entry-date right-date">${e.date}</div>` : ''}
        </div>`;
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
    if (!el) { console.warn(`populateGrid: no element found for "${selector}"`); return; }
    el.innerHTML = items.map(builder).join('');
}
 
// Append timeline entries into a container (keeps any existing <hr> intact).
function populateTimeline(selector, items) {
    const el = document.querySelector(selector);
    if (!el) { console.warn(`populateTimeline: no element found for "${selector}"`); return; }
    el.insertAdjacentHTML('beforeend', items.map(buildTimelineEntry).join(''));
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