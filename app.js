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
  // Sistema avançado de otimização de imagens com foco em mobile
  const imageCache = new Map();
  const loadingQueue = [];
  const failedImages = new Set();
  let isProcessingQueue = false;
  let connectionType = 'unknown';
  let isMobile = window.innerWidth <= 768;
  
  // Detectar tipo de conexão
  const detectConnection = () => {
    if (navigator.connection) {
      connectionType = navigator.connection.effectiveType || 'unknown';
    } else if (navigator.connection && navigator.connection.type) {
      connectionType = navigator.connection.type;
    }
    
    // Detectar se é mobile
    isMobile = window.innerWidth <= 768;
    
    console.log('Connection type:', connectionType, 'Mobile:', isMobile);
  };
  
  // Configurações baseadas na conexão
  const getConnectionConfig = () => {
    const configs = {
      '4g': { maxConcurrent: 8, timeout: 3000, retryCount: 2 },
      '3g': { maxConcurrent: 4, timeout: 5000, retryCount: 3 },
      '2g': { maxConcurrent: 2, timeout: 8000, retryCount: 4 },
      'slow-2g': { maxConcurrent: 1, timeout: 10000, retryCount: 5 },
      'unknown': { maxConcurrent: 6, timeout: 4000, retryCount: 2 }
    };
    
    return configs[connectionType] || configs['unknown'];
  };
  
  // Preload crítico para imagens essenciais
  const preloadCriticalImages = () => {
    const criticalImages = [
      'https://placehold.co/128x128/f472b6/ffffff?text=U',
      'https://placehold.co/280x176/f9a8d4/ffffff?text=RioFestas'
    ];
    
    // Criar preload links
    criticalImages.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('fetchpriority', index === 0 ? 'high' : 'auto');
      document.head.appendChild(link);
    });
    
    // Pré-carregar em cache
    criticalImages.forEach(src => {
      const img = new Image();
      img.onload = () => imageCache.set(src, src);
      img.src = src;
    });
  };
  
  // Carregamento de imagem com retry e fallback
  const loadImageWithRetry = async (src, retryCount = 0) => {
    const config = getConnectionConfig();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        imageCache.set(src, src);
        resolve(src);
      };
      
      img.onerror = () => {
        if (retryCount < config.retryCount) {
          console.log(`Retrying image load: ${src} (attempt ${retryCount + 1})`);
          setTimeout(() => {
            loadImageWithRetry(src, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 1000 * (retryCount + 1)); // Backoff exponencial
        } else {
          failedImages.add(src);
          reject(new Error(`Failed to load image after ${config.retryCount} attempts`));
        }
      };
      
      img.src = src;
      
      // Timeout baseado na conexão
      setTimeout(() => {
        if (!img.complete) {
          img.onerror();
        }
      }, config.timeout);
    });
  };
  
  // Processamento da fila de carregamento
  const processImageQueue = async () => {
    if (isProcessingQueue || loadingQueue.length === 0) return;
    isProcessingQueue = true;
    
    const config = getConnectionConfig();
    const batch = loadingQueue.splice(0, config.maxConcurrent);
    
    const promises = batch.map(async ({ img, src, priority }) => {
      try {
        // Verificar cache primeiro
        if (imageCache.has(src)) {
          img.src = imageCache.get(src);
          img.classList.add('loaded');
          return;
        }
        
        // Verificar se já falhou
        if (failedImages.has(src)) {
          throw new Error('Image previously failed');
        }
        
        // Carregar imagem com retry
        const loadedSrc = await loadImageWithRetry(src);
        img.src = loadedSrc;
        img.classList.add('loaded');
        
      } catch (error) {
        console.warn('Failed to load image:', src, error);
        
        // Fallback inteligente baseado no contexto
        let fallbackSrc = 'https://placehold.co/280x176/f9a8d4/ffffff?text=RioFestas';
        
        // Fallbacks específicos baseados no tipo de imagem
        if (src.includes('avatar') || src.includes('user')) {
          fallbackSrc = 'https://placehold.co/128x128/f472b6/ffffff?text=U';
        } else if (src.includes('event') || src.includes('party')) {
          fallbackSrc = 'https://placehold.co/280x176/f9a8d4/ffffff?text=Evento';
        }
        
        img.src = fallbackSrc;
        img.classList.add('loaded');
        img.setAttribute('data-fallback', 'true');
      }
    });
    
    await Promise.all(promises);
    isProcessingQueue = false;
    
    // Processar próximo lote imediatamente
    if (loadingQueue.length > 0) {
      setTimeout(processImageQueue, 50); // Pequeno delay para não sobrecarregar
    }
  };
  
  // Otimização de imagens com priorização inteligente
  const optimizeImages = () => {
    const images = document.querySelectorAll('img[src]:not([data-optimized])');
    
    images.forEach((img, index) => {
      img.setAttribute('data-optimized', 'true');
      
      const src = img.src;
      
      // Determinar prioridade baseada na posição e contexto
      let priority = false;
      let loadingType = 'lazy';
      
      // Imagens de alta prioridade
      if (index < 10 || // Primeiras 10 imagens
          img.closest('.hero-section') || // Seção hero
          img.closest('.carousel-container') && index < 5 || // Primeiras 5 do carrossel
          img.hasAttribute('data-critical') || // Marcada como crítica
          src.includes('avatar') || // Avatares de usuário
          img.width > 300 || img.height > 200) { // Imagens grandes
        
        priority = true;
        loadingType = 'eager';
      }
      
      // Configurar atributos de carregamento
      img.setAttribute('loading', loadingType);
      img.setAttribute('decoding', 'async');
      
      if (priority) {
        img.setAttribute('fetchpriority', 'high');
      }
      
      // Adicionar container de loading se não existir
      if (!img.parentElement.classList.contains('image-container')) {
        const container = document.createElement('div');
        container.className = 'image-container';
        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
      }
      
      // Adicionar à fila de carregamento
      loadingQueue.push({
        img,
        src,
        priority
      });
    });
    
    // Processar fila se não estiver processando
    if (!isProcessingQueue) {
      processImageQueue();
    }
  };
  
  // Otimização para novos elementos
  const optimizeNewImages = (root) => {
    const newImages = root.querySelectorAll('img[src]:not([data-optimized])');
    if (newImages.length > 0) {
      optimizeImages();
    }
  };
  
  // Observer para novos elementos
  const observer = new MutationObserver((mutations) => {
    let hasNewImages = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'IMG' && node.src) {
            hasNewImages = true;
          } else if (node.querySelectorAll) {
            const images = node.querySelectorAll('img[src]');
            if (images.length > 0) {
              hasNewImages = true;
            }
          }
        }
      });
    });
    
    if (hasNewImages) {
      setTimeout(optimizeImages, 100);
    }
  });
  
  // Inicialização
  const initImageOptimization = () => {
    detectConnection();
    preloadCriticalImages();
    
    // Otimização inicial
    setTimeout(() => {
      optimizeImages();
    }, 50);
    
    // Observer para mudanças no DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Otimização no scroll (throttled)
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(optimizeImages, 200);
    }, { passive: true });
    
    // Otimização quando a página volta a ficar visível
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        optimizeImages();
      }
    });
    
    // Re-detecta conexão quando a janela é redimensionada
    window.addEventListener('resize', () => {
      detectConnection();
    });
    
    // Otimização periódica para garantir que todas as imagens sejam processadas
    setInterval(() => {
      if (document.querySelectorAll('img[src]:not([data-optimized])').length > 0) {
        optimizeImages();
      }
    }, 5000);
  };
  
  // Iniciar otimização
  initImageOptimization();
  
  // Registrar Service Worker com otimizações
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
          
          // Verificar atualizações do Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível
                console.log('Nova versão do Service Worker disponível');
              }
            });
          });
        })
        .catch((error) => {
          console.warn('Falha ao registrar Service Worker:', error);
        });
    });
  }
});
