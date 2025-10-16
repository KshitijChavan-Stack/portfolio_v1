// Portfolio Website JavaScript
// Handles animations, scroll effects, and image sliders

class PortfolioManager {
    constructor() {
        this.init();
    }

    init() {
        this.initAnimations();
        this.setupScrollEffects();
        this.setupNavigation();
        this.setupEducationTimeline();
        this.setupImageSliders();
    }

    // ========== ANIMATIONS ==========
    initAnimations() {
        // Add entrance animations to existing elements
        this.observeElements();
        
        // Add smooth scrolling to navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections for scroll animations
        document.querySelectorAll('section, .project-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollEffects() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class for navbar styling
            if (currentScroll > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    setupNavigation() {
        // Highlight active navigation item based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupEducationTimeline() {
        const timelineLine = document.querySelector('.timeline-line');
        const educationItems = document.querySelectorAll('.education-item');
        
        if (!timelineLine || !educationItems.length) return;

        // Create intersection observer for education timeline
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start timeline line animation
                    timelineLine.classList.add('animated');
                    
                    // Animate education items one by one
                    this.animateEducationItems(educationItems);
                    
                    // Disconnect observer after first trigger
                    timelineObserver.disconnect();
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe the education section
        const educationSection = document.querySelector('#education');
        if (educationSection) {
            timelineObserver.observe(educationSection);
        }
    }

    animateEducationItems(items) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
                
                // Add a subtle bounce effect to the dot
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    dot.style.animation = 'dotPulse 0.6s ease';
                }
            }, (index + 1) * 800); // 800ms delay between each item
        });
    }

    // ========== TAILWIND CAROUSEL WITH AUTO-SLIDE ==========
    setupImageSliders() {
        const carousels = document.querySelectorAll('[data-carousel="slide"]');
        
        carousels.forEach(carousel => {
            const slides = carousel.querySelectorAll('[data-carousel-item]');
            const indicators = carousel.querySelectorAll('[data-carousel-slide-to]');
            const prevBtn = carousel.querySelector('[data-carousel-prev]');
            const nextBtn = carousel.querySelector('[data-carousel-next]');
            const projectCard = carousel.closest('.project-card');
            
            let currentSlide = 0;
            let autoSlideInterval = null;
            let isHovering = false;
            
            // Function to show specific slide with smooth transition
            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    if (i === index) {
                        slide.classList.remove('hidden');
                        // Add smooth fade-in effect
                        slide.style.opacity = '0';
                        setTimeout(() => {
                            slide.style.opacity = '1';
                        }, 50);
                    } else {
                        slide.classList.add('hidden');
                        slide.style.opacity = '0';
                    }
                });
                
                // Update indicators
                indicators.forEach((indicator, i) => {
                    if (i === index) {
                        indicator.classList.remove('bg-white/30');
                        indicator.classList.add('bg-white/50');
                        indicator.setAttribute('aria-current', 'true');
                    } else {
                        indicator.classList.remove('bg-white/50');
                        indicator.classList.add('bg-white/30');
                        indicator.setAttribute('aria-current', 'false');
                    }
                });
            };
            
            // Function to go to next slide
            const nextSlide = () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            };
            
            // Function to go to previous slide
            const prevSlide = () => {
                currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                showSlide(currentSlide);
            };
            
            // Auto-slide functionality
            const startAutoSlide = () => {
                if (!autoSlideInterval) {
                    autoSlideInterval = setInterval(nextSlide, 2000); // 2 seconds
                }
            };
            
            const stopAutoSlide = () => {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }
            };
            
            // Start auto-slide on project card hover
            if (projectCard) {
                projectCard.addEventListener('mouseenter', () => {
                    isHovering = true;
                    startAutoSlide();
                });
                
                projectCard.addEventListener('mouseleave', () => {
                    isHovering = false;
                    stopAutoSlide();
                    // Reset to first slide after a short delay
                    setTimeout(() => {
                        if (!isHovering) {
                            currentSlide = 0;
                            showSlide(currentSlide);
                        }
                    }, 500);
                });
            }
            
            // Manual controls
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoSlide();
                    nextSlide();
                    if (isHovering) {
                        setTimeout(startAutoSlide, 1000); // Restart after 1 second
                    }
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoSlide();
                    prevSlide();
                    if (isHovering) {
                        setTimeout(startAutoSlide, 1000); // Restart after 1 second
                    }
                });
            }
            
            // Indicator click events
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoSlide();
                    currentSlide = index;
                    showSlide(currentSlide);
                    if (isHovering) {
                        setTimeout(startAutoSlide, 1000); // Restart after 1 second
                    }
                });
            });
            
            // Initialize first slide
            showSlide(currentSlide);
        });
    }
}

// Scroll navigation functions for bottom navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});
