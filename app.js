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
  // Enhanced image optimization
  const optimizeImages = () => {
    const images = document.querySelectorAll('img[src]');
    images.forEach((img, index) => {
      // Add loading optimization
      if (index < 6) {
        img.setAttribute('fetchpriority', 'high');
      }
      
      // Add error handling
      img.addEventListener('error', function() {
        if (!this.dataset.fallbackApplied) {
          this.src = 'https://placehold.co/280x176/f9a8d4/ffffff?text=RioFestas';
          this.dataset.fallbackApplied = 'true';
        }
      });
      
      // Add loading animation
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        this.parentElement?.classList.remove('image-container');
      });
      
      // Add intersection observer for lazy loading
      if (index > 5) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.1
        });
        observer.observe(img);
      }
    });
  };

  const preloadFirstImages = (root) => {
    try {
      const head = document.head || document.getElementsByTagName('head')[0];
      const imgs = Array.from((root||document).querySelectorAll('img')).slice(0,3);
      imgs.forEach(im => {
        if (!im) return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = im.currentSrc || im.src;
        head.appendChild(link);
      });
    } catch(e){}
  };
  
  // Initial optimization
  optimizeImages();
  preloadFirstImages(document);
  
  // Observe new carousels and optimize
  const obs = new MutationObserver((muts)=>{
    muts.forEach(m=>{
      m.addedNodes && m.addedNodes.forEach(n=>{
        if(n.nodeType===1) {
          if(n.id && n.id.startsWith('carousel-')){ 
            preloadFirstImages(n); 
          }
          // Optimize any new images
          if(n.querySelectorAll) {
            const newImages = n.querySelectorAll('img');
            if(newImages.length > 0) {
              setTimeout(optimizeImages, 100);
            }
          }
        }
      });
    });
  });
  obs.observe(document.body, { childList: true, subtree: true });
});
