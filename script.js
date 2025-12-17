const scriptElement = document.currentScript || Array.from(document.querySelectorAll('script[src]')).find(script => script.src.includes('script.js'));
const scriptURL = scriptElement ? new URL(scriptElement.getAttribute('src'), window.location.href) : new URL('script.js', window.location.href);
const assetsBaseURL = new URL('.', scriptURL);

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');

            // Only prevent default and smooth scroll if it's an anchor link (starts with #)
            if (targetHref.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetHref);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Close mobile menu after clicking a link
            const mobileNav = document.querySelector('.mobile-nav');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileNav && mobileToggle) {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });

    // Mobile hamburger menu functionality
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }

    // Button click handlers
    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Handle different button actions based on context
            const buttonText = this.textContent.trim();

            if (buttonText === 'Know More') {
                // Scroll to next section or show more info
                const nextSection = this.closest('section').nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else if (buttonText === 'More Pictures') {
                // Handle gallery expansion
                console.log('Expanding gallery...');
                // You can add gallery expansion logic here
            }
        });
    });



    // Gallery item hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Header hide/show on scroll (disabled on mobile)
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only hide header on desktop screens (wider than 768px)
        if (window.innerWidth > 768) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
        } else {
            // On mobile, always keep header visible
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    let imageArray = [];

    // Load gallery data from JSON and populate grid
    async function loadGalleryData() {
        try {
            const response = await fetch(new URL('gallery-data.json', assetsBaseURL));
            const data = await response.json();
            const normalizedWorks = data.works.map(work => ({
                ...work,
                src: new URL(work.src, assetsBaseURL).href
            }));
            const galleryGrid = document.getElementById('gallery-grid');
            
            // Clear existing content
            galleryGrid.innerHTML = '';
            
            // Store works data globally for lightbox
            window.galleryWorks = normalizedWorks;
            
            // Populate gallery from JSON data
            normalizedWorks.forEach((work, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'works-gallery-item-wrapper';
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'works-gallery-item';
                
                const img = document.createElement('img');
                img.src = work.src;
                img.alt = work.title;
                img.style.cursor = 'pointer';
                img.dataset.index = index;
                
                imgContainer.appendChild(img);
                
                // Create info section
                const infoSection = document.createElement('div');
                infoSection.className = 'gallery-item-info';
                infoSection.innerHTML = `
                    <div class="gallery-item-title">${work.title}</div>
                    <div class="gallery-item-meta">
                        <strong>Kind:</strong> ${work.kind || 'N/A'}
                    </div>
                    <div class="gallery-item-meta">
                        <strong>Year:</strong> ${work.year || 'N/A'}
                    </div>
                    <div class="gallery-item-meta">
                        <strong>Size:</strong> ${work.size || 'N/A'}
                    </div>
                `;
                
                galleryItem.appendChild(imgContainer);
                galleryItem.appendChild(infoSection);
                galleryGrid.appendChild(galleryItem);
                
                // Add click event to image
                img.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentImageIndex = index;
                    openLightbox(index);
                });
            });
            
            // Re-initialize lightbox with new images
            initializeLightbox();
        } catch (error) {
            console.error('Error loading gallery data:', error);
        }
    }

    // Load gallery data on page load
    loadGalleryData();

    // Function to initialize lightbox
    function initializeLightbox() {
        const galleryItems = document.querySelectorAll('.works-gallery-item img');
        
        // Clear and rebuild image array
        imageArray = Array.from(galleryItems).map(img => img.src);
        
        // Remove old listeners and add new ones
        galleryItems.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                currentImageIndex = index;
                openLightbox(index);
            });
        });
    }

    // Close lightbox
    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    }

    // Open lightbox
    function openLightbox(imageIndex) {
        if (lightboxModal && lightboxImage && window.galleryWorks) {
            const work = window.galleryWorks[imageIndex];
            
            lightboxImage.src = work.src;
            
            // Set artwork details
            document.getElementById('lightbox-title').textContent = work.title;
            document.querySelector('#lightbox-kind span').textContent = work.kind || 'N/A';
            document.querySelector('#lightbox-year span').textContent = work.year || 'N/A';
            document.querySelector('#lightbox-size span').textContent = work.size || 'N/A';
            document.getElementById('lightbox-description').textContent = work.description || '';
            
            // Handle comments (can be array or string)
            const commentsDiv = document.getElementById('lightbox-comments');
            commentsDiv.innerHTML = '';
            
            if (work.comments) {
                if (Array.isArray(work.comments)) {
                    work.comments.forEach(comment => {
                        const p = document.createElement('p');
                        p.textContent = comment;
                        commentsDiv.appendChild(p);
                    });
                } else if (typeof work.comments === 'string' && work.comments.trim()) {
                    const p = document.createElement('p');
                    p.innerHTML = work.comments; // Supports HTML like <br>
                    commentsDiv.appendChild(p);
                }
            }
            
            lightboxModal.classList.add('active');
        }
    }

    // Navigate to previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + window.galleryWorks.length) % window.galleryWorks.length;
        openLightbox(currentImageIndex);
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % window.galleryWorks.length;
        openLightbox(currentImageIndex);
    }

    // Initialize lightbox on page load
    // initializeLightbox(); // This line is now handled by loadGalleryData()

    // Event listeners for lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox when clicking outside the image
    if (lightboxModal) {
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Timeline Gallery Lightbox (for gallery.html)
    const timelineImages = document.querySelectorAll('.timeline-content img');
    let timelineImageArray = [];
    
    if (timelineImages.length > 0) {
        // Store timeline images and their descriptions for lightbox navigation
        timelineImageArray = Array.from(timelineImages).map(img => {
            // Get the caption from the parent timeline-content div
            const captionElement = img.closest('.timeline-content').querySelector('.gallery-item-caption p');
            return {
                src: img.src,
                alt: img.alt,
                description: captionElement ? captionElement.textContent : ''
            };
        });
        
        timelineImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                currentImageIndex = index;
                openTimelineLightbox(index);
            });
        });
    }
    
    // Open timeline lightbox
    function openTimelineLightbox(imageIndex) {
        if (lightboxModal && lightboxImage && timelineImageArray.length > 0) {
            const image = timelineImageArray[imageIndex];
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            
            // Update description
            const descriptionDiv = document.getElementById('lightbox-description');
            if (descriptionDiv) {
                descriptionDiv.textContent = image.description;
            }
            
            lightboxModal.classList.add('active');
        }
    }
    
    // Override navigation for timeline gallery
    if (timelineImages.length > 0) {
        // Replace the existing event listeners with timeline-specific ones
        if (lightboxPrev) {
            lightboxPrev.removeEventListener('click', showPrevImage);
            lightboxPrev.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex - 1 + timelineImageArray.length) % timelineImageArray.length;
                openTimelineLightbox(currentImageIndex);
            });
        }
        if (lightboxNext) {
            lightboxNext.removeEventListener('click', showNextImage);
            lightboxNext.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex + 1) % timelineImageArray.length;
                openTimelineLightbox(currentImageIndex);
            });
        }
        
        // Update keyboard navigation for timeline
        document.addEventListener('keydown', function(e) {
            if (lightboxModal && lightboxModal.classList.contains('active') && timelineImages.length > 0) {
                if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + timelineImageArray.length) % timelineImageArray.length;
                    openTimelineLightbox(currentImageIndex);
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % timelineImageArray.length;
                    openTimelineLightbox(currentImageIndex);
                } else if (e.key === 'Escape') {
                    closeLightbox();
                }
            }
        });
    }
});