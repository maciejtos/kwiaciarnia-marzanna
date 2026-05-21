/*
   Kwiaciarnia Marzanna - Interactive Engine
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. SELEKTORY
    ======================================================== */
    const header        = document.getElementById('header');
    const toast         = document.getElementById('toast-notification');
    const toastMsg      = document.getElementById('toast-message');

    const mobileNavToggle  = document.getElementById('mobile-nav-toggle');
    const mobileDrawer     = document.getElementById('mobile-drawer');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const drawerOverlay    = document.getElementById('drawer-overlay');
    const mobileLinks      = document.querySelectorAll('.mobile-link');

    /* ========================================================
       2. SCROLL EFFECTS & SCROLL SPY
    ======================================================== */
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        highlightActiveSection();
    };

    const highlightActiveSection = () => {
        const sections  = document.querySelectorAll('section[id]');
        const navLinks  = document.querySelectorAll('.nav-link');
        let current     = '';

        sections.forEach(section => {
            const top = section.offsetTop - 130;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });

        mobileLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ========================================================
       3. MOBILE NAVIGATION DRAWER
    ======================================================== */
    const openMobileDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    mobileNavToggle.addEventListener('click', openMobileDrawer);
    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    drawerOverlay.addEventListener('click', closeMobileDrawer);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    /* ========================================================
       4. TOAST NOTIFICATION
    ======================================================== */
    const showToast = (message) => {
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
    };

    /* ========================================================
       5. GALLERY FILTERS & SKELETON LOADER
    ======================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryMasonry = document.getElementById('gallery-masonry');
    const gallerySkeleton = document.getElementById('gallery-skeleton');

    // Helper to control skeleton transition state
    const showGallerySkeleton = (duration, callback) => {
        if (!galleryMasonry || !gallerySkeleton) {
            if (callback) callback();
            return;
        }

        // Switch visible views
        galleryMasonry.classList.add('hidden');
        gallerySkeleton.classList.remove('hidden');

        setTimeout(() => {
            gallerySkeleton.classList.add('hidden');
            galleryMasonry.classList.remove('hidden');
            if (callback) callback();
        }, duration);
    };

    // Initial Load Skeleton simulation
    if (galleryMasonry && gallerySkeleton) {
        // Initialize item visual states to prepare for fade-in transition
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92)';
            item.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
        });

        showGallerySkeleton(750, () => {
            galleryItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
        });
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Trigger skeleton load before showing filtered items
                showGallerySkeleton(500, () => {
                    galleryItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hidden');
                            // Delay slightly to trigger CSS transition correctly
                            requestAnimationFrame(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            });
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.92)';
                            item.classList.add('hidden');
                        }
                    });
                });
            });
        });
    }

    /* ========================================================
       6. HERO PARALLAX (mousemove micro-interaction)
    ======================================================== */
    const heroSection = document.getElementById('home');
    const heroTitle   = document.getElementById('hero-title');
    let ticking = false;

    if (heroSection && heroTitle) {
        heroSection.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const x = (window.innerWidth  / 2 - e.pageX) / 45;
                    const y = (window.innerHeight / 2 - e.pageY) / 45;
                    heroTitle.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${x / 10}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            heroTitle.style.transform = '';
        });
    }

    /* ========================================================
       7. INTERSECTION OBSERVER — animacje wejścia
    ======================================================== */
    const observeTargets = document.querySelectorAll(
        '.service-card, .gallery-item, .value-item, .contact-card, .strip-stat'
    );

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay na podstawie pozycji w rodzeństwie
                const siblings = Array.from(entry.target.parentElement.children);
                const i = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${i * 60}ms`;
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observeTargets.forEach(el => {
        el.classList.add('fade-in-up');
        fadeInObserver.observe(el);
    });

    /* ========================================================
       8. COOKIE BANNER
    ======================================================== */
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    const cookieRejectBtn = document.getElementById('cookie-reject-btn');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
            showToast('Zaakceptowano pliki cookies.');
        });

        if (cookieRejectBtn) {
            cookieRejectBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'rejected');
                cookieBanner.classList.remove('show');
                showToast('Odrzucono opcjonalne pliki cookies.');
            });
        }
    }



    /* ========================================================
       9. SCROLL TO TOP
    ======================================================== */
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ========================================================
       10. LIGHTBOX
    ======================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (lightbox) {
        let activeItems = [];
        let currentIndex = -1;

        // Unified click handler to open lightbox
        const openLightbox = (item, itemsArray) => {
            const imgElement = item.querySelector('img');
            if (!imgElement) return;

            activeItems = itemsArray;
            currentIndex = activeItems.indexOf(item);

            updateLightboxContent();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const updateLightboxContent = () => {
            if (currentIndex < 0 || currentIndex >= activeItems.length) return;
            const currentItem = activeItems[currentIndex];
            const imgElement = currentItem.querySelector('img');
            if (!imgElement) return;

            // Smooth fade out/in effect
            lightboxImg.classList.add('changing');
            
            setTimeout(() => {
                lightboxImg.src = imgElement.src;
                lightboxCaption.textContent = imgElement.alt || currentItem.querySelector('.gallery-cat')?.textContent || '';
                
                // Once loaded, fade back in
                lightboxImg.onload = () => {
                    lightboxImg.classList.remove('changing');
                };
                
                // Fallback in case loading is instant or cached
                setTimeout(() => {
                    lightboxImg.classList.remove('changing');
                }, 100);
            }, 150);
        };

        const nextImage = () => {
            if (activeItems.length <= 1) return;
            currentIndex = (currentIndex + 1) % activeItems.length;
            updateLightboxContent();
        };

        const prevImage = () => {
            if (activeItems.length <= 1) return;
            currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
            updateLightboxContent();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => { 
                lightboxImg.src = ''; 
                lightboxImg.classList.remove('changing');
            }, 300);
        };

        // Attach event listeners to standard gallery items (realizacje.html)
        if (galleryItems.length > 0) {
            galleryItems.forEach(item => {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    // Gather only visible gallery items at the moment of click
                    const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
                    openLightbox(item, visibleItems);
                });
            });
        }

        // Attach event listeners to teaser items (index.html)
        const teaserItems = document.querySelectorAll('.teaser-item');
        if (teaserItems.length > 0) {
            teaserItems.forEach(item => {
                item.addEventListener('click', () => {
                    const teaserArray = Array.from(teaserItems);
                    openLightbox(item, teaserArray);
                });
            });
        }

        // Nav click events
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                nextImage();
            });
        }
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                prevImage();
            });
        }

        // Overlay click to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });

        // Keyboard control
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        });

        // Mobile touch swipe gestures
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50; // pixels
            const deltaX = touchEndX - touchStartX;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX < 0) {
                    nextImage(); // Swiped left, show next
                } else {
                    prevImage(); // Swiped right, show previous
                }
            }
        };
    }

});
