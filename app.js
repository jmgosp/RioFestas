// --- Split from inline <script> blocks ---


    /* RF-normalize-taxonomy-lists v1 */
    document.addEventListener('DOMContentLoaded', function() {
      function normalizeTaxList(id) {
        var ul = document.getElementById(id);
        if (!ul) return;
        ul.querySelectorAll('li').forEach(function(li) {
          // If there's already a dedicated span as label, skip
          var hasSpan = li.querySelector('span');
          var btn = li.querySelector('button');
          if (!hasSpan) {
            // Derive label text from non-button nodes
            var labelText = "";
            li.childNodes.forEach(function(n) {
              if (n.nodeType === 3) labelText += n.textContent;
              if (n.nodeType === 1 && n.tagName !== 'BUTTON' && n.tagName !== 'SPAN') {
                labelText += n.textContent;
              }
            });
            labelText = (labelText || '').trim() || '—';
            var span = document.createElement('span');
            span.textContent = labelText;
            if (btn) {
              li.insertBefore(span, btn);
            } else {
              li.insertBefore(span, li.firstChild);
            }
            // Remove stray text nodes that would duplicate the label
            var leftovers = [];
            li.childNodes.forEach(function(n) {
              if (n.nodeType === 3 && n.textContent.trim() !== '') {
                leftovers.push(n);
              }
            });
            leftovers.forEach(function(n) { n.parentNode && n.parentNode.removeChild(n); });
          }
        });
      }
      function normalizeAll() { normalizeTaxList('bairro-list'); normalizeTaxList('genero-list'); }
      normalizeAll();
      // Keep normalized after changes
      var opts = { childList: true, subtree: true };
      ['bairro-list','genero-list'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) new MutationObserver(normalizeAll).observe(el, opts);
      });
    });
    

// --- next block ---


document.addEventListener('DOMContentLoaded', function(){
  // Ultra-aggressive image optimization with extreme initial loading
  const imageCache = new Map();
  const loadingQueue = [];
  const preloadQueue = [];
  let isProcessingQueue = false;
  let isPreloading = false;
  let initialLoadComplete = false;
  
  // IntersectionObserver-based lazy loader (secure defaults)
  const lazyObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        // Security and perf defaults
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        img.setAttribute('referrerpolicy', 'no-referrer');
        img.setAttribute('crossorigin', 'anonymous');
        img.src = dataSrc;
        img.removeAttribute('data-src');
      }
      lazyObserver.unobserve(img);
    });
  }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });

  function observeLazyImages(root){
    try{
      (root||document).querySelectorAll('img[data-src]:not([data-lazy-observed])').forEach(img => {
        img.setAttribute('data-lazy-observed','1');
        lazyObserver.observe(img);
      });
    }catch(e){ /* no-op */ }
  }
  
  // Extreme preload for critical images
  const extremePreload = () => {
    const criticalImages = [
      'https://placehold.co/128x128/f472b6/ffffff?text=U',
      'https://placehold.co/280x176/f9a8d4/ffffff?text=RioFestas',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1600&auto=format&fit=crop'
    ];
    
    // Create all preload links immediately
    criticalImages.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('fetchpriority', index === 0 ? 'high' : 'auto');
      document.head.appendChild(link);
    });
    
    // Preload images in memory
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      imageCache.set(src, src);
    });
  };
  
  // Ultra-parallel image loading with connection optimization
  const processImageQueue = async () => {
    if (isProcessingQueue || loadingQueue.length === 0) return;
    isProcessingQueue = true;
    
    // Extreme parallel loading based on connection
    const maxConcurrent = navigator.connection ? 
      Math.min(navigator.connection.effectiveType === '4g' ? 12 : 6, loadingQueue.length) : 
      8;
    
    const batch = loadingQueue.splice(0, maxConcurrent);
    
    const promises = batch.map(async ({ img, src, priority }) => {
      try {
        // Check cache first
        if (imageCache.has(src)) {
          img.src = imageCache.get(src);
          img.classList.add('loaded');
          return;
        }
        
        // Ultra-fast loading with minimal timeout
        const loadPromise = new Promise((resolve, reject) => {
          const tempImg = new Image();
          tempImg.onload = () => resolve(tempImg.src);
          tempImg.onerror = reject;
          tempImg.src = src;
          
          // Ultra-short timeout for instant fallback
          setTimeout(() => reject(new Error('Timeout')), priority ? 1500 : 1000);
        });
        
        const loadedSrc = await loadPromise;
        imageCache.set(src, loadedSrc);
        img.src = loadedSrc;
        img.classList.add('loaded');
        
      } catch (error) {
        console.warn('Failed to load image:', src, error);
        img.src = 'https://placehold.co/280x176/f9a8d4/ffffff?text=RioFestas';
        img.classList.add('loaded');
      }
    });
    
    await Promise.all(promises);
    isProcessingQueue = false;
    
    // Process next batch immediately with no delay
    if (loadingQueue.length > 0) {
      processImageQueue();
    }
  };
  
  const optimizeImages = () => {
    const images = document.querySelectorAll('img[src]:not([data-optimized])');
    images.forEach((img, index) => {
      img.setAttribute('data-optimized', 'true');
      
      const src = img.src;
      const isHighPriority = index < 20; // Increase priority images significantly
      
      // Set loading attributes
      if (isHighPriority) {
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('loading', 'eager');
      } else {
        img.setAttribute('loading', 'lazy');
      }
      
      img.setAttribute('decoding', 'async');
      
      // Add to loading queue with priority
      loadingQueue.push({
        img,
        src,
        priority: isHighPriority
      });
      
      // Process queue if not already processing
      if (!isProcessingQueue) {
        processImageQueue();
      }
    });
    // Also observe newly added lazy images
    observeLazyImages(document);
  };

  const preloadCriticalImages = (root) => {
    try {
      const head = document.head || document.getElementsByTagName('head')[0];
      const imgs = Array.from((root||document).querySelectorAll('img')).slice(0, 12); // Increase preload count significantly
      
      imgs.forEach((img, index) => {
        if (!img || !img.src) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        link.setAttribute('fetchpriority', index < 6 ? 'high' : 'auto');
        head.appendChild(link);
      });
    } catch(e) {
      console.warn('Preload failed:', e);
    }
  };
  
  // Immediate extreme optimizations
  extremePreload();
  
  // Initial optimization with minimal delay
  setTimeout(() => {
    optimizeImages();
    preloadCriticalImages(document);
    initialLoadComplete = true;
  }, 10); // Ultra-fast initial load
  
  // Ultra-fast debounced optimization
  let optimizationTimeout;
  const debouncedOptimize = () => {
    clearTimeout(optimizationTimeout);
    optimizationTimeout = setTimeout(() => {
      optimizeImages();
    }, 10); // Ultra-fast debouncing
  };
  
  const obs = new MutationObserver((muts) => {
    let shouldOptimize = false;
    
    muts.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.id && n.id.startsWith('carousel-')) {
            preloadCriticalImages(n);
            shouldOptimize = true;
          }
          if (n.querySelectorAll && n.querySelectorAll('img').length > 0) {
            shouldOptimize = true;
            observeLazyImages(n);
          }
        }
      });
    });
    
    if (shouldOptimize) {
      debouncedOptimize();
    }
  });
  
  obs.observe(document.body, { childList: true, subtree: true });
  
  // Optimize on scroll with passive listener
  let scrollTimeout;
  document.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(optimizeImages, 10);
  }, { passive: true });
  
  // Optimize on visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      optimizeImages();
    }
  });
  
  // Optimize on window focus
  window.addEventListener('focus', () => {
    if (initialLoadComplete) {
      optimizeImages();
    }
  });
});
