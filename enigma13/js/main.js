// ============================================
// Main JavaScript - Initialization & Utilities
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    console.log('ENIGMA XIII - Website Initialized');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // YouTube Hero Video Autoplay & Mobile Fallback Controller
    const ytIframe = document.getElementById('yt-hero-player');
    
    function sendYtCommand(func) {
        if (ytIframe && ytIframe.contentWindow) {
            ytIframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: func,
                args: []
            }), '*');
        }
    }

    // Try to trigger playback automatically
    if (ytIframe) {
        // Repeated play attempt on load
        setTimeout(function() {
            sendYtCommand('mute');
            sendYtCommand('playVideo');
        }, 800);
        
        setTimeout(function() {
            sendYtCommand('playVideo');
        }, 2000);

        // Mobile autoplay fallback: first touch on screen starts playback
        const triggerPlayOnTouch = function() {
            sendYtCommand('mute');
            sendYtCommand('playVideo');
            window.removeEventListener('touchstart', triggerPlayOnTouch);
            window.removeEventListener('click', triggerPlayOnTouch);
        };

        window.addEventListener('touchstart', triggerPlayOnTouch, { passive: true });
        window.addEventListener('click', triggerPlayOnTouch, { passive: true });
    }
    
    // Keyboard navigation for mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }
    
    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
    
    // Optimized lazy load images with better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // Use Image object for better loading control
                        const newImg = new Image();
                        newImg.decoding = 'async';
                        newImg.onload = function() {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        };
                        newImg.onerror = function() {
                            img.removeAttribute('data-src');
                            img.style.display = 'none';
                        };
                        newImg.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px', // Start loading 50px before visible
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});


