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
                openLightbox(img.src);
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
    function openLightbox(imageSrc) {
        if (lightboxModal && lightboxImage) {
            lightboxImage.src = imageSrc;
            lightboxModal.classList.add('active');
        }
    }

    // Navigate to previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        lightboxImage.src = imageArray[currentImageIndex];
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        lightboxImage.src = imageArray[currentImageIndex];
    }

    // Initialize lightbox on page load
    initializeLightbox();

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
});