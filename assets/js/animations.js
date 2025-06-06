class RoyaumeAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupPageTransitions();
    this.setupHoverEffects();
    this.setupScrollAnimations();
    this.setupLoadingAnimations();
  }

  // Transitions de page
  setupPageTransitions() {
    // Transition sortante
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.getAttribute('download') && !link.target) {
        e.preventDefault();
        this.transitionToPage(link.href);
      }
    });
  }

  async transitionToPage(url) {
    // Animation de sortie
    document.body.classList.add('page-transitioning-out');
    
    // Attendre la fin de l'animation
    await this.wait(300);
    
    // Naviguer vers la nouvelle page
    window.location.href = url;
  }

  // Effets de survol
  setupHoverEffects() {
    // Effet de lift sur les cartes
    document.querySelectorAll('.tool-card, .hero-card').forEach(card => {
      card.classList.add('hover-lift');
      
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
    });

    // Effet parallax sur les icônes flottantes
    document.addEventListener('mousemove', (e) => {
      this.updateFloatingIcons(e);
    });
  }

  animateCardHover(card, isHover) {
    const icon = card.querySelector('.tool-icon img, .hero-tool-icon img');
    if (!icon) return;

    if (isHover) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  }

  updateFloatingIcons(e) {
    const icons = document.querySelectorAll('.floating-icon');
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    icons.forEach((icon, index) => {
      const speed = (index + 1) * 0.02;
      const x = (clientX - innerWidth / 2) * speed;
      const y = (clientY - innerHeight / 2) * speed;
      
      icon.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // Animations au scroll
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Elements à observer
    document.querySelectorAll(`
      .hero-section,
      .tools-container,
      .guide-section,
      .filters-section
    `).forEach(el => observer.observe(el));

    // Parallax header
    this.setupParallaxScroll();
  }

  animateElement(element) {
    if (element.classList.contains('.hero-section')) {
      this.animateHero(element);
    } else if (element.classList.contains('tools-container')) {
      this.animateToolsGrid(element);
    } else if (element.classList.contains('guide-section')) {
      this.animateGuideSection(element);
    }
  }

  animateHero(hero) {
    const title = hero.querySelector('.hero-title');
    const icons = hero.querySelectorAll('.floating-icon');

    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        title.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 200);
    }

    icons.forEach((icon, index) => {
      icon.style.opacity = '0';
      icon.style.transform = 'scale(0.5)';
      
      setTimeout(() => {
        icon.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        icon.style.opacity = '1';
        icon.style.transform = 'scale(1)';
      }, 300 + index * 100);
    });
  }

  animateToolsGrid(container) {
    const cards = container.querySelectorAll('.tool-card, .tool-hero-card');
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.95)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  }

  animateGuideSection(section) {
    const card = section.querySelector('.guide-card');
    const title = card?.querySelector('.guide-title');
    const description = card?.querySelector('.guide-description');
    const button = card?.querySelector('.guide-download');

    [title, description, button].forEach((el, index) => {
      if (!el) return;
      
      el.style.opacity = '0';
      el.style.transform = 'translateX(-30px)';
      
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, index * 200);
    });
  }

  setupParallaxScroll() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    
    if (hero) {
      const speed = scrolled * 0.5;
      hero.style.transform = `translateY(${speed}px)`;
    }

    // Parallax pour les icônes flottantes
    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach((icon, index) => {
      const speed = scrolled * (0.1 + index * 0.02);
      icon.style.transform += ` translateY(${speed}px)`;
    });
  }

  // Animations de chargement
  setupLoadingAnimations() {
    // Animation du logo au chargement
    const logo = document.querySelector('.logo-img');
    if (logo) {
      logo.style.opacity = '0';
      logo.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        logo.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
      }, 100);
    }

    // Animation de la navigation
    this.animateNavigation();
  }

  animateNavigation() {
    const navElements = document.querySelectorAll('.nav-link, .switcher-btn, .btn-primary');
    
    navElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + index * 50);
    });
  }

  // Utilitaires
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Animation de typing effect
  typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // Animation de compteur
  animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (target - start) * progress);
      element.textContent = current.toLocaleString('fr-FR');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // Animation morphing SVG
  morphSVG(element, pathData, duration = 500) {
    const path = element.querySelector('path');
    if (!path) return;

    const currentPath = path.getAttribute('d');
    
    path.style.transition = `d ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    path.setAttribute('d', pathData);
    
    setTimeout(() => {
      path.style.transition = '';
    }, duration);
  }
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('enable-animations')) {
    new RoyaumeAnimations();
  }
});

// Export pour utilisation dans d'autres fichiers
window.RoyaumeAnimations = RoyaumeAnimations;