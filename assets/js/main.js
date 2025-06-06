class RoyaumeTheme {
  constructor() {
    this.currentPage = 1;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeFilters = [];
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupSearch();
    this.setupFilters();
    this.setupToolActions();
    this.setupAnimations();
    this.setupInfiniteScroll();
    this.setupExternalLinks();
    this.initBookmarks();
  }

  // Configuration de la navigation
setupNavigation() {
   const switcher = document.querySelector('[data-switcher]');
   if (!switcher) return;

   const buttons = switcher.querySelectorAll('.switcher-btn');
   const indicator = switcher.querySelector('.switcher-indicator');
   
   buttons.forEach((button, index) => {
     button.addEventListener('click', () => {
       // Retirer la classe active de tous les boutons
       buttons.forEach(btn => btn.classList.remove('active'));
       button.classList.add('active');
       
       // Déplacer l'indicateur
       indicator.classList.toggle('slide-right', index === 1);
       
       // Changer le contenu avec animation
       this.switchContent(button.dataset.target);
     });
   });
 }

 switchContent(target) {
   const mainContent = document.querySelector('.tools-grid-section');
   if (!mainContent) return;

   // Animation de sortie
   mainContent.style.opacity = '0';
   mainContent.style.transform = 'translateY(20px)';
   
   setTimeout(() => {
     if (target === 'tools') {
       this.loadTools();
     } else {
       this.loadSimulators();
     }
     
     // Animation d'entrée
     mainContent.style.transition = 'all 0.4s ease';
     mainContent.style.opacity = '1';
     mainContent.style.transform = 'translateY(0)';
   }, 200);
 }

 async loadTools() {
   const container = document.querySelector('.tools-container');
   if (!container) return;

   try {
     const response = await fetch(`${window.location.origin}/ghost/api/content/posts/?key=${this.getGhostApiKey()}&filter=tag:outil&include=tags&limit=12`);
     const data = await response.json();
     
     this.renderTools(data.posts);
     this.updateResultsCount(data.posts.length);
   } catch (error) {
     console.error('Erreur lors du chargement des outils:', error);
   }
 }

 async loadSimulators() {
   const container = document.querySelector('.tools-container');
   if (!container) return;

   try {
     const response = await fetch(`${window.location.origin}/ghost/api/content/posts/?key=${this.getGhostApiKey()}&filter=tag:simulateur&include=tags&limit=12`);
     const data = await response.json();
     
     this.renderSimulators(data.posts);
     this.updateResultsCount(data.posts.length);
   } catch (error) {
     console.error('Erreur lors du chargement des simulateurs:', error);
   }
 }

 // Configuration de la recherche
 setupSearch() {
   const searchInput = document.querySelector('[data-search-input]');
   const searchBtn = document.querySelector('[data-search-btn]');
   
   if (!searchInput || !searchBtn) return;

   let debounceTimer;
   
   searchInput.addEventListener('input', (e) => {
     clearTimeout(debounceTimer);
     debounceTimer = setTimeout(() => {
       this.performSearch(e.target.value);
     }, 500);
   });

   searchBtn.addEventListener('click', () => {
     this.performSearch(searchInput.value);
   });

   // Recherche au clavier
   searchInput.addEventListener('keydown', (e) => {
     if (e.key === 'Enter') {
       e.preventDefault();
       this.performSearch(searchInput.value);
     }
   });

   // Auto-complétion simple
   searchInput.addEventListener('focus', () => {
     this.showSearchSuggestions();
   });

   document.addEventListener('click', (e) => {
     if (!e.target.closest('.search-container')) {
       this.hideSearchSuggestions();
     }
   });
 }

 async performSearch(query) {
   if (query.length < 2) {
     this.loadTools();
     return;
   }

   this.searchQuery = query;
   const resultsContainer = document.querySelector('.tools-container');
   const loadingIndicator = this.showLoading(resultsContainer);

   try {
     // Recherche dans les titres, excerpts et contenu
     const response = await fetch(`${window.location.origin}/ghost/api/content/posts/?key=${this.getGhostApiKey()}&filter=tag:outil&q=${encodeURIComponent(query)}&limit=20&include=tags`);
     const data = await response.json();

     this.renderSearchResults(data.posts);
     this.updateResultsCount(data.posts.length);
     this.trackSearch(query, data.posts.length);
   } catch (error) {
     console.error('Erreur de recherche:', error);
     this.showSearchError();
   } finally {
     this.hideLoading(loadingIndicator);
   }
 }

 showSearchSuggestions() {
   // Implémentation future: suggestions basées sur les tags populaires
   const suggestions = ['gestion de projet', 'productivité', 'design', 'marketing', 'CRM'];
   // TODO: Afficher les suggestions
 }

 hideSearchSuggestions() {
   const suggestionsContainer = document.querySelector('.search-suggestions');
   if (suggestionsContainer) {
     suggestionsContainer.style.display = 'none';
   }
 }

 // Configuration des filtres
 setupFilters() {
   const filterTabs = document.querySelectorAll('.filter-tab');
   
   filterTabs.forEach(tab => {
     tab.addEventListener('click', () => {
       // Retirer active de tous les onglets de même niveau
       const parentContainer = tab.closest('.filter-tabs');
       parentContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
       tab.classList.add('active');
       
       const filter = tab.dataset.filter;
       this.applyFilter(filter);
     });
   });

   // Gestion du tri
   const sortSelect = document.querySelector('[data-sort]');
   if (sortSelect) {
     sortSelect.addEventListener('change', (e) => {
       this.applySorting(e.target.value);
     });
   }
 }

 async applyFilter(filterType) {
   const container = document.querySelector('.tools-container');
   const loadingIndicator = this.showLoading(container);

   try {
     let filterQuery = 'tag:outil';
     
     switch (filterType) {
       case 'popular':
         filterQuery += '+tag:populaire';
         break;
       case 'new':
         filterQuery += '+published_at:>2024-12-01';
         break;
       case 'gratuit':
         filterQuery += '+tag:gratuit';
         break;
       case 'freemium':
         filterQuery += '+tag:freemium';
         break;
       case 'payant':
         filterQuery += '+tag:payant';
         break;
       case 'categories':
         this.showCategoryFilter();
         return;
       case 'platform':
         this.showPlatformFilter();
         return;
     }

     const response = await fetch(`${window.location.origin}/ghost/api/content/posts/?key=${this.getGhostApiKey()}&filter=${filterQuery}&limit=20&include=tags&order=published_at%20desc`);
     const data = await response.json();

     this.renderSearchResults(data.posts);
     this.updateResultsCount(data.posts.length);
     
     // Sauvegarder le filtre actif
     this.activeFilters = [filterType];
     this.updateURL();
   } catch (error) {
     console.error('Erreur de filtrage:', error);
   } finally {
     this.hideLoading(loadingIndicator);
   }
 }

 showCategoryFilter() {
   // Modal ou dropdown avec toutes les catégories
   // TODO: Implémenter l'interface de filtre par catégorie
 }

 showPlatformFilter() {
   // Modal ou dropdown avec toutes les plateformes
   // TODO: Implémenter l'interface de filtre par plateforme
 }

 async applySorting(sortType) {
   const container = document.querySelector('.tools-container');
   const loadingIndicator = this.showLoading(container);

   try {
     let orderParam = 'published_at desc';
     
     switch (sortType) {
       case 'popular':
         orderParam = 'featured desc,published_at desc';
         break;
       case 'recent':
         orderParam = 'published_at desc';
         break;
       case 'name':
         orderParam = 'title asc';
         break;
       case 'rating':
         orderParam = 'featured desc,published_at desc'; // Ghost n'a pas de système de rating natif
         break;
     }

     const baseFilter = this.searchQuery ? 
       `tag:outil&q=${encodeURIComponent(this.searchQuery)}` : 
       'tag:outil';

     const response = await fetch(`${window.location.origin}/ghost/api/content/posts/?key=${this.getGhostApiKey()}&filter=${baseFilter}&order=${orderParam}&limit=20&include=tags`);
     const data = await response.json();

     this.renderSearchResults(data.posts);
   } catch (error) {
     console.error('Erreur de tri:', error);
   } finally {
     this.hideLoading(loadingIndicator);
   }
 }

 // Actions des outils
 setupToolActions() {
   document.addEventListener('click', (e) => {
     // Gestion des favoris
     if (e.target.closest('[data-bookmark]')) {
       e.preventDefault();
       const button = e.target.closest('[data-bookmark]');
       const toolId = button.dataset.bookmark;
       this.toggleBookmark(toolId, button);
     }

     // Gestion du partage
     if (e.target.closest('[data-share]')) {
       e.preventDefault();
       const button = e.target.closest('[data-share]');
       const url = button.dataset.share;
       this.shareUrl(url);
     }

     // Gestion des onglets d'outil
     if (e.target.closest('.tab-btn')) {
       e.preventDefault();
       const button = e.target.closest('.tab-btn');
       this.switchTab(button);
     }

     // Gestion de la lecture vidéo
     if (e.target.closest('[data-video-play]')) {
       e.preventDefault();
       this.playVideo(e.target.closest('[data-video-play]'));
     }
   });
 }

 toggleBookmark(toolId, button) {
   const bookmarks = JSON.parse(localStorage.getItem('royaume_bookmarks') || '[]');
   const isBookmarked = bookmarks.includes(toolId);

   if (isBookmarked) {
     const index = bookmarks.indexOf(toolId);
     bookmarks.splice(index, 1);
     button.classList.remove('bookmarked');
     this.showNotification('Retiré des favoris', 'success');
   } else {
     bookmarks.push(toolId);
     button.classList.add('bookmarked');
     this.showNotification('Ajouté aux favoris', 'success');
   }

   localStorage.setItem('royaume_bookmarks', JSON.stringify(bookmarks));
   
   // Animation de feedback
   button.style.transform = 'scale(1.2)';
   setTimeout(() => {
     button.style.transform = 'scale(1)';
   }, 150);

   // Analytics
   this.trackEvent('bookmark', isBookmarked ? 'remove' : 'add', toolId);
 }

 shareUrl(url) {
   if (navigator.share) {
     navigator.share({
       title: document.title,
       url: url
     }).catch(err => console.log('Erreur de partage:', err));
   } else {
     // Fallback: copier dans le presse-papier
     navigator.clipboard.writeText(url).then(() => {
       this.showNotification('Lien copié dans le presse-papier', 'success');
     }).catch(() => {
       // Fallback ultime: ouvrir le modal de partage
       this.showShareModal(url);
     });
   }
 }

 showShareModal(url) {
   const modal = document.createElement('div');
   modal.className = 'share-modal';
   modal.innerHTML = `
     <div class="share-modal-content">
       <h3>Partager cet outil</h3>
       <div class="share-options">
         <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}" target="_blank" class="share-btn twitter">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
             <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
           </svg>
           Twitter
         </a>
         <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" class="share-btn linkedin">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
             <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
           </svg>
           LinkedIn
         </a>
         <button class="share-btn copy" data-copy-url="${url}">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
             <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
           </svg>
           Copier le lien
         </button>
       </div>
       <button class="share-modal-close">&times;</button>
     </div>
   `;

   document.body.appendChild(modal);
   
   // Event listeners
   modal.querySelector('.share-modal-close').addEventListener('click', () => {
     document.body.removeChild(modal);
   });

   modal.querySelector('[data-copy-url]').addEventListener('click', () => {
     navigator.clipboard.writeText(url).then(() => {
       this.showNotification('Lien copié!', 'success');
       document.body.removeChild(modal);
     });
   });

   modal.addEventListener('click', (e) => {
     if (e.target === modal) {
       document.body.removeChild(modal);
     }
   });
 }

 switchTab(button) {
   const tabContainer = button.closest('.tool-tabs');
   const tabs = tabContainer.querySelectorAll('.tab-btn');
   const targetTab = button.dataset.tab;

   // Changer l'onglet actif
   tabs.forEach(tab => tab.classList.remove('active'));
   button.classList.add('active');

   // Changer le contenu avec animation
   const sections = document.querySelectorAll('[data-tab-content]');
   sections.forEach(section => {
     if (section.dataset.tabContent === targetTab) {
       section.classList.remove('hidden');
       section.style.opacity = '0';
       section.style.transform = 'translateY(20px)';
       
       setTimeout(() => {
         section.style.transition = 'all 0.3s ease';
         section.style.opacity = '1';
         section.style.transform = 'translateY(0)';
       }, 50);
     } else {
       section.classList.add('hidden');
     }
   });

   // Analytics
   this.trackEvent('tab_switch', targetTab);
 }

 playVideo(button) {
   const container = button.closest('.video-container');
   const img = container.querySelector('.preview-image');
   
   if (img && img.dataset.videoUrl) {
     // Remplacer l'image par une iframe vidéo
     const iframe = document.createElement('iframe');
     iframe.src = img.dataset.videoUrl;
     iframe.width = '100%';
     iframe.height = '400';
     iframe.frameBorder = '0';
     iframe.allowFullscreen = true;
     
     container.innerHTML = '';
     container.appendChild(iframe);
   }
 }

 // Configuration des animations
 setupAnimations() {
   // Intersection Observer pour les animations au scroll
   const observerOptions = {
     threshold: 0.1,
     rootMargin: '0px 0px -50px 0px'
   };

   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         entry.target.classList.add('animate-fade-in-up');
         observer.unobserve(entry.target);
       }
     });
   }, observerOptions);

   // Observer les éléments animables
   document.querySelectorAll('.tool-card, .guide-card, .hero-section, .category-header').forEach(el => {
     observer.observe(el);
   });

   // Animation des icônes flottantes au chargement
   this.animateFloatingIcons();

   // Parallax scroll pour le hero
   this.setupParallaxScroll();
 }

 animateFloatingIcons() {
   const icons = document.querySelectorAll('.floating-icon');
   icons.forEach((icon, index) => {
     icon.style.animationDelay = `${index * 0.5}s`;
     icon.style.opacity = '0';
     
     setTimeout(() => {
       icon.style.transition = 'opacity 0.6s ease';
       icon.style.opacity = '1';
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
   
   if (hero && scrolled < window.innerHeight) {
     const speed = scrolled * 0.3;
     hero.style.transform = `translateY(${speed}px)`;
   }
 }

 // Scroll infini et pagination
 setupInfiniteScroll() {
   const loadMoreBtn = document.querySelector('[data-load-more]');
   if (!loadMoreBtn) return;

   loadMoreBtn.addEventListener('click', () => {
     this.loadMoreTools();
   });

   // Auto-load en approchant du bas de page
   window.addEventListener('scroll', () => {
     if (this.isNearBottom() && !this.isLoading) {
       this.loadMoreTools();
     }
   });
 }

 isNearBottom() {
   return window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
 }

 async loadMoreTools() {
   if (this.isLoading) return;
   
   this.isLoading = true;
   this.currentPage++;
   
   const loadMoreBtn = document.querySelector('[data-load-more]');
   if (loadMoreBtn) {
     loadMoreBtn.classList.add('loading');
     loadMoreBtn.textContent = 'Chargement...';
   }

   try {
     const baseFilter = this.searchQuery ? 
       `tag:outil&q=${encodeURIComponent(this.searchQuery)}` : 
       'tag:outil';

     const response = await fetch(`${window.location.origin}/ghost/api/content/posts/?key=${this.getGhostApiKey()}&filter=${baseFilter}&limit=12&page=${this.currentPage}&include=tags`);
     const data = await response.json();

     if (data.posts.length > 0) {
       this.appendTools(data.posts);
     } else {
       if (loadMoreBtn) loadMoreBtn.style.display = 'none';
     }
   } catch (error) {
     console.error('Erreur de chargement:', error);
     this.showNotification('Erreur lors du chargement', 'error');
   } finally {
     this.isLoading = false;
     if (loadMoreBtn) {
       loadMoreBtn.classList.remove('loading');
       loadMoreBtn.textContent = 'Charger plus d\'outils';
     }
   }
 }

 // Liens externes et tracking
 setupExternalLinks() {
   document.addEventListener('click', (e) => {
     const link = e.target.closest('[data-external-link]');
     if (link) {
       e.preventDefault();
       
       // Analytics
       this.trackEvent('external_click', 'tool_visit', link.textContent);
       
       // Ouvrir dans un nouvel onglet après un court délai
       setTimeout(() => {
         window.open(link.href || '#', '_blank', 'noopener');
       }, 100);
     }
   });
 }

 // Rendu des outils
 renderSearchResults(tools) {
   const container = document.querySelector('.tools-container');
   if (!container) return;

   // Garder la carte hero si on affiche tous les outils
   const heroCard = container.querySelector('.tool-hero-card');
   container.innerHTML = '';
   
   if (heroCard && !this.searchQuery && this.activeFilters.length === 0) {
     container.appendChild(heroCard);
   }

   tools.forEach((tool, index) => {
     const toolCard = this.createToolCard(tool);
     container.appendChild(toolCard);
     
     // Animation échelonnée
     setTimeout(() => {
       toolCard.style.opacity = '0';
       toolCard.style.transform = 'translateY(20px)';
       
       setTimeout(() => {
         toolCard.style.transition = 'all 0.4s ease';
         toolCard.style.opacity = '1';
         toolCard.style.transform = 'translateY(0)';
       }, 50);
     }, index * 50);
   });
 }

 renderTools(tools) {
   this.renderSearchResults(tools);
 }

 renderSimulators(simulators) {
   const container = document.querySelector('.tools-container');
   if (!container) return;

   container.innerHTML = '';

   simulators.forEach((simulator, index) => {
     const simulatorCard = this.createSimulatorCard(simulator);
     container.appendChild(simulatorCard);
     
     setTimeout(() => {
       simulatorCard.style.opacity = '0';
       simulatorCard.style.transform = 'translateY(20px)';
       
       setTimeout(() => {
         simulatorCard.style.transition = 'all 0.4s ease';
         simulatorCard.style.opacity = '1';
         simulatorCard.style.transform = 'translateY(0)';
       }, 50);
     }, index * 50);
   });
 }

 createToolCard(tool) {
   const card = document.createElement('article');
   card.className = 'tool-card';
   card.dataset.toolId = tool.id;

   const verified = tool.tags?.some(tag => tag.name === 'verifie') ? 
     '<div class="tool-verified"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2"/></svg></div>' : '';

   const sponsored = tool.tags?.some(tag => tag.name === 'sponsorise') ? 
     '<div class="tool-sponsored">Sponsorisé</div>' : '';

   const platforms = this.getPlatformBadges(tool.tags);
   const category = tool.primary_tag ? `<span class="category-badge">${tool.primary_tag.name}</span>` : '';

   card.innerHTML = `
     <div class="tool-card-header">
       ${tool.feature_image ? `<div class="tool-icon"><img src="${tool.feature_image}" alt="${tool.title}" class="tool-icon-img"></div>` : ''}
       <div class="tool-info">
         <h3 class="tool-name">${tool.title}</h3>
         ${tool.excerpt ? `<p class="tool-description">${tool.excerpt}</p>` : ''}
       </div>
       ${verified}
       ${sponsored}
     </div>
     <div class="tool-meta">
       <div class="tool-platforms">${platforms}</div>
       <div class="tool-category">${category}</div>
     </div>
     <div class="tool-card-actions">
       <a href="${tool.url}" class="btn btn-primary tool-visit">Visiter ${tool.title}</a>
       <button class="btn btn-icon" data-bookmark="${tool.id}" title="Ajouter aux favoris">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2"/></svg>
       </button>
       <button class="btn btn-icon" data-share="${tool.url}" title="Partager">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" stroke-width="2"/><polyline points="16,6 12,2 8,6" stroke="currentColor" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>
       </button>
     </div>
   `;

   return card;
 }

 createSimulatorCard(simulator) {
   const card = document.createElement('article');
   card.className = 'simulator-card';
   card.dataset.simulatorId = simulator.id;

   card.innerHTML = `
     <div class="simulator-header">
       ${simulator.feature_image ? `<div class="simulator-icon"><img src="${simulator.feature_image}" alt="${simulator.title}"></div>` : ''}
       <div class="simulator-info">
         <h3 class="simulator-name">${simulator.title}</h3>
         ${simulator.excerpt ? `<p class="simulator-description">${simulator.excerpt}</p>` : ''}
       </div>
     </div>
     <div class="simulator-actions">
       <a href="${simulator.url}" class="btn btn-primary">Utiliser le simulateur</a>
       <button class="btn btn-icon" data-bookmark="${simulator.id}">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2"/></svg>
       </button>
     </div>
   `;

   return card;
 }

 getPlatformBadges(tags) {
   if (!tags) return '';
   
   const platforms = [];
   const platformMap = {
     'mac': 'Mac',
     'windows': 'Windows', 
     'web': 'Web',
     'ios': 'iOS',
     'android': 'Android'
   };

   tags.forEach(tag => {
     if (platformMap[tag.slug]) {
       platforms.push(`<span class="platform-badge ${tag.slug}">${platformMap[tag.slug]}</span>`);
     }
   });

   return platforms.join('');
 }

appendTools(tools) {
   const container = document.querySelector('.tools-container');
   
   tools.forEach((tool, index) => {
     const toolCard = this.createToolCard(tool);
     toolCard.style.opacity = '0';
     toolCard.style.transform = 'translateY(20px)';
     container.appendChild(toolCard);
     
     setTimeout(() => {
       toolCard.style.transition = 'all 0.4s ease';
       toolCard.style.opacity = '1';
       toolCard.style.transform = 'translateY(0)';
     }, index * 100);
   });
 }

 // Gestion des favoris
 initBookmarks() {
   const bookmarks = JSON.parse(localStorage.getItem('royaume_bookmarks') || '[]');
   bookmarks.forEach(toolId => {
     const button = document.querySelector(`[data-bookmark="${toolId}"]`);
     if (button) {
       button.classList.add('bookmarked');
     }
   });
 }

 // Utilitaires
 showLoading(container) {
   const loader = document.createElement('div');
   loader.className = 'loading-overlay';
   loader.innerHTML = `
     <div class="loading-spinner">
       <div class="spinner"></div>
       <p>Chargement...</p>
     </div>
   `;
   container.style.position = 'relative';
   container.appendChild(loader);
   return loader;
 }

 hideLoading(loader) {
   if (loader && loader.parentNode) {
     loader.parentNode.removeChild(loader);
   }
 }

 showSearchError() {
   const container = document.querySelector('.tools-container');
   container.innerHTML = `
     <div class="search-error">
       <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
         <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
         <path d="M15 9L9 15" stroke="currentColor" stroke-width="2"/>
         <path d="M9 9L15 15" stroke="currentColor" stroke-width="2"/>
       </svg>
       <h3>Erreur de recherche</h3>
       <p>Impossible de charger les résultats. Veuillez réessayer.</p>
       <button class="btn btn-primary" onclick="location.reload()">Réessayer</button>
     </div>
   `;
 }

 updateResultsCount(count) {
   const counter = document.querySelector('[data-results-count]');
   if (counter) {
     // Animation du compteur
     this.animateCounter(counter, count);
   }
 }

 animateCounter(element, target) {
   const start = parseInt(element.textContent.replace(/\D/g, '')) || 0;
   const duration = 800;
   const startTime = performance.now();
   
   const updateCounter = (currentTime) => {
     const elapsed = currentTime - startTime;
     const progress = Math.min(elapsed / duration, 1);
     
     const current = Math.floor(start + (target - start) * progress);
     element.textContent = current.toLocaleString('fr-FR');
     
     if (progress < 1) {
       requestAnimationFrame(updateCounter);
     }
   };
   
   requestAnimationFrame(updateCounter);
 }

 showNotification(message, type = 'info') {
   const notification = document.createElement('div');
   notification.className = `notification notification-${type}`;
   notification.innerHTML = `
     <div class="notification-content">
       <span class="notification-message">${message}</span>
       <button class="notification-close">&times;</button>
     </div>
   `;

   document.body.appendChild(notification);

   // Auto-remove après 4 secondes
   setTimeout(() => {
     if (notification.parentNode) {
       notification.classList.add('notification-exit');
       setTimeout(() => {
         if (notification.parentNode) {
           document.body.removeChild(notification);
         }
       }, 300);
     }
   }, 4000);

   // Bouton de fermeture
   notification.querySelector('.notification-close').addEventListener('click', () => {
     notification.classList.add('notification-exit');
     setTimeout(() => {
       if (notification.parentNode) {
         document.body.removeChild(notification);
       }
     }, 300);
   });
 }

 updateURL() {
   const url = new URL(window.location);
   
   if (this.searchQuery) {
     url.searchParams.set('q', this.searchQuery);
   } else {
     url.searchParams.delete('q');
   }
   
   if (this.activeFilters.length > 0) {
     url.searchParams.set('filter', this.activeFilters.join(','));
   } else {
     url.searchParams.delete('filter');
   }
   
   window.history.replaceState({}, '', url);
 }

 // Analytics et tracking
 trackEvent(category, action, label = '') {
   if (typeof gtag !== 'undefined') {
     gtag('event', action, {
       event_category: category,
       event_label: label
     });
   }
   
   // Alternative: envoyer à votre propre système d'analytics
   // this.sendAnalytics({ category, action, label });
 }

 trackSearch(query, resultsCount) {
   this.trackEvent('search', 'query', `${query} (${resultsCount} résultats)`);
 }

 // Configuration
 getGhostApiKey() {
   // Remplacer par votre clé API Ghost
   return document.querySelector('meta[name="ghost-api-key"]')?.content || 'your-content-api-key';
 }

 // Gestionnaire d'erreurs global
 handleError(error, context = '') {
   console.error(`Erreur ${context}:`, error);
   this.trackEvent('error', context, error.message);
   this.showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
 }
}

// Initialisation du thème
document.addEventListener('DOMContentLoaded', () => {
 try {
   window.royaume = new RoyaumeTheme();
 } catch (error) {
   console.error('Erreur d\'initialisation du thème:', error);
 }
});

// Service Worker pour les performances (optionnel)
if ('serviceWorker' in navigator && 'caches' in window) {
 window.addEventListener('load', () => {
   navigator.serviceWorker.register('/sw.js')
     .then(registration => {
       console.log('SW registered:', registration);
     })
     .catch(error => {
       console.log('SW registration failed:', error);
     });
 });
}

// Optimisation des images lazy loading
document.addEventListener('DOMContentLoaded', () => {
 if ('IntersectionObserver' in window) {
   const imageObserver = new IntersectionObserver((entries, observer) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         const img = entry.target;
         img.src = img.dataset.src;
         img.classList.remove('lazy');
         observer.unobserve(img);
       }
     });
   });

   document.querySelectorAll('img[data-src]').forEach(img => {
     imageObserver.observe(img);
   });
 }
});

// Export pour utilisation dans d'autres fichiers
window.RoyaumeTheme = RoyaumeTheme;