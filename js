// main.js - Refactored for SparkShelf
// Goals: improve structure, avoid globals, add dark-mode, persist liked ideas, debounce/throttle, ready for future API integration.

(function(){
  'use strict';

  // Utility helpers
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function debounce(fn, wait=200){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(()=>fn.apply(this,args), wait);
    }
  }

  function throttle(fn, wait=200){
    let last=0;
    return function(...args){
      const now = Date.now();
      if (now - last >= wait){
        last = now;
        fn.apply(this,args);
      }
    }
  }

  // Local storage keys
  const LS_KEYS = {
    LIKED: 'sparkshelf_liked_ideas_v1',
    THEME: 'sparkshelf_theme_v1'
  };

  // Save liked ideas (array of idea ids or objects)
  function saveLikedIdeas(arr){
    try{
      localStorage.setItem(LS_KEYS.LIKED, JSON.stringify(arr || []));
    }catch(e){
      console.warn('Could not save liked ideas', e);
    }
  }

  function getLikedIdeas(){
    try{
      const raw = localStorage.getItem(LS_KEYS.LIKED);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.warn('Could not read liked ideas', e);
      return [];
    }
  }

  // Theme (dark/light) helpers
  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_KEYS.THEME, theme);
    const btn = $('#dark-toggle');
    if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  function toggleTheme(){
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }
  function initTheme(){
    const saved = localStorage.getItem(LS_KEYS.THEME);
    if(saved) setTheme(saved);
    else{
      // default based on prefers-color-scheme
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  // Example: convert cost objects in project data to TND (placeholder function)
  // Expects idea objects to have a 'costs' array [{amount: number, currency: 'USD'|'EUR'|'TND'}]
  function convertCostsToTND(ideaList, rates){
    // rates is an object like {USD:3.2, EUR:3.4, TND:1}
    return ideaList.map(idea=>{
      if(!idea.costs) return idea;
      const converted = idea.costs.map(c=>{
        const rate = rates[c.currency] || 1;
        return {...c, amountTND: +(c.amount * rate).toFixed(2)};
      });
      return {...idea, costsTND: converted};
    });
  }

  // Safe event listener attachment
  function safeAddEvent(selector, event, handler){
    const el = $(selector);
    if(el) el.addEventListener(event, handler);
  }

  // Main initializer
  function init(){
    // Theme init
    initTheme();
    const darkBtn = $('#dark-toggle');
    if(darkBtn) darkBtn.addEventListener('click', toggleTheme);

    // Restore liked ideas count in UI if element exists
    const liked = getLikedIdeas();
    const badge = $('#liked-count');
    if(badge) badge.textContent = liked.length;

    // Attach enter key handler for assistant chat input if present
    const chatInput = $('#chat-input');
    const sendBtn = $('#chat-send');
    if(chatInput){
      chatInput.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' && !e.shiftKey){
          e.preventDefault();
          if(sendBtn) sendBtn.click();
        }
      });
    }

    // Example: attach swipe action handlers (if cards are present)
    // This code assumes card elements have .idea-card and data-id attributes
    const cards = $$('.idea-card');
    if(cards.length){
      cards.forEach(card=>{
        // simple like button inside card
        const likeBtn = card.querySelector('.like-btn');
        if(likeBtn){
          likeBtn.addEventListener('click', ()=>{
            const id = card.getAttribute('data-id');
            const current = getLikedIdeas();
            if(!current.includes(id)) current.push(id);
            saveLikedIdeas(current);
            const badge = $('#liked-count'); if(badge) badge.textContent = current.length;
            // small visual feedback
            card.classList.add('liked');
          });
        }
      });
    }

    // Debounced resize handler (if you do layout changes on resize)
    window.addEventListener('resize', debounce(()=>{
      // placeholder for responsive recalculations
      // console.log('resize');
    }, 150));

    // Throttled scroll (if you track scroll for lazy loading)
    window.addEventListener('scroll', throttle(()=>{
      // placeholder for lazy loading or animations
    }, 120));
  }

  // Run when DOM is ready
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
