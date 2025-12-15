// Script pour la page des règles du jeu

// Smooth scroll pour les ancres (si on ajoute un menu de navigation plus tard)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation au scroll (optionnel)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer toutes les cartes de règles
document.querySelectorAll('.rule-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Effet de survol sur les tableaux
document.querySelectorAll('.table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Message de confirmation avant de retourner au jeu (optionnel)
document.querySelectorAll('a[href="index.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Stockage local pour indiquer que l'utilisateur a lu les règles
        localStorage.setItem('rulesRead', 'true');
    });
});

// Animation des icônes d'action
document.querySelectorAll('.action-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(360deg) scale(1.1)';
        this.style.transition = 'transform 0.5s ease';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(0deg) scale(1)';
    });
});

// Animation des cartes de ressources
document.querySelectorAll('.resource-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.resource-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.resource-icon i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

// Effet de pulsation sur les badges
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.5s ease';
    });
});

// Keyframe pour l'animation pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Console log pour debug
console.log('Page des règles chargée avec succès');
console.log('Black Castle - Un jeu de stratégie et de dés');
