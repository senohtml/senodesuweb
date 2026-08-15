// Smooth animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements on page load
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll('.resource-card, .about, .cta');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Fetch resources from backend
    loadResources();
});

// Load resources from backend
async function loadResources() {
    try {
        const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api'
            : `${window.location.origin}/api`;
        const response = await fetch(`${API_BASE_URL}/resources`);
        const data = await response.json();
        
        if (data.resources && Array.isArray(data.resources)) {
            const grid = document.querySelector('.resources-grid');
            
            // Clear existing cards
            grid.innerHTML = '';
            
            // Add cards from database
            data.resources.forEach((resource, index) => {
                const card = createResourceCard(resource, index);
                grid.appendChild(card);
                observer.observe(card);
            });
        }
    } catch (error) {
        console.log('Using default resources');
    }
}

function getCategoryIcon(category) {
    switch (category) {
        case 'language':
            return `<path d="M12 28a8 8 0 0 1 8-8V10a8 8 0 0 0-8 8v10Zm0 0a8 8 0 0 0-8-8V10a8 8 0 0 1 8 8v10Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
        case 'work':
            return `
                <rect x="12" y="15" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M16 15V12a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" fill="none" stroke="currentColor" stroke-width="1.5"/>
            `;
        case 'culture':
            return `<path d="M11 14h18M11 19h18M14 14v13M26 14v13M9 11c3 1 7 2 11 2s8-1 11-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
        case 'travel':
            return `<path d="M20 10a6 6 0 0 0-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
        case 'tech':
            return `
                <rect x="13" y="13" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M17 13V10M23 13V10M17 27v3M23 27v3M13 17H10M13 23H10M27 17h3M27 23h3" fill="none" stroke="currentColor" stroke-width="1.5"/>
            `;
        case 'dev':
            return `<path d="M15 15l-5 5 5 5M25 15l5 5-5 5M22 13l-4 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
        default:
            return `<circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
    }
}

function createResourceCard(resource, index) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const hasLink = resource.link && resource.link !== 'null' && resource.link !== '#' && resource.link !== '';
    
    // Get translation
    const currentLang = localStorage.getItem('preferredLanguage') || 'id';
    
    const titleKey = `resources.${resource.category}`;
    const descKey = `resources.${resource.category}_desc`;
    
    const displayTitle = (translations[currentLang] && translations[currentLang][titleKey]) || resource.title;
    const displayDescription = (translations[currentLang] && translations[currentLang][descKey]) || resource.description;
    
    const buttonText = hasLink 
        ? (translations[currentLang]['resources.view'] || 'View Module') 
        : (translations[currentLang]['resources.coming_soon'] || 'Coming Soon');
    
    const buttonHref = hasLink ? resource.link : 'javascript:void(0)';
    const buttonClass = hasLink ? 'link-btn' : 'link-btn disabled';
    const targetAttr = hasLink ? 'target="_blank" rel="noopener"' : '';
    
    card.innerHTML = `
        <div class="resource-icon">
            <svg width="40" height="40" viewBox="0 0 40 40">
                ${getCategoryIcon(resource.category)}
            </svg>
        </div>
        <h3>${displayTitle}</h3>
        <p>${displayDescription}</p>
        <a href="${buttonHref}" class="${buttonClass}" ${targetAttr}>${buttonText}</a>
    `;
    
    return card;
}

// Active navigation link
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let currentSection = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
