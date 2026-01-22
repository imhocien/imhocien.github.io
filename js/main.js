
/* ===== contact-form.js ===== */
// Contact Form Handler with EmailJS
// Setup: 
// 1. Sign up at https://www.emailjs.com/ (FREE - 200 emails/month)
// 2. Create email service (Gmail/Outlook/etc)
// 3. Create email template
// 4. Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID below

// Initialize EmailJS (add your public key)
emailjs.init("BN9VBQ0ewCRF_7HdE"); // Get from EmailJS dashboard

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.querySelector('[name="inputName"]').value.trim();
    const email = document.querySelector('[name="inputEmail"]').value.trim();
    const phone = document.querySelector('[name="inputPhone"]').value.trim();
    const subject = document.querySelector('[name="inputSubject"]').value.trim();
    const message = document.querySelector('[name="inputMessage"]').value.trim();
    const captchaAnswer = document.querySelector('[name="captcha_answer"]').value.trim();
    const captchaA = parseInt(document.querySelector('[name="captcha_a"]').value);
    const captchaB = parseInt(document.querySelector('[name="captcha_b"]').value);
    
    // Validation
    if (!name || !email || !message) {
        alert('Please fill all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Invalid email address.');
        return;
    }
    
    // Captcha validation
    const expected = captchaA + captchaB;
    if (parseInt(captchaAnswer) !== expected) {
        alert('Captcha validation failed. Please answer the question correctly.');
        return;
    }
    
    // Prepare template parameters for EmailJS
    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        subject: subject,
        message: message,
        to_email: 'shahidhocien@gmail.com'
    };
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Send email using EmailJS
    emailjs.send('service_8j8hpie', 'template_fibdt5i', templateParams)
        .then(function(response) {
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset();
            // Regenerate captcha if you have that function
            if (typeof generateCaptcha === 'function') {
                generateCaptcha();
            }
        })
        .catch(function(error) {
            alert('Failed to send message. Please try again later.');
            console.error('EmailJS error:', error);
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
});

/* ===== init-animations.js ===== */
// Initialize AOS (Animate On Scroll)
function initAOSAnimations() {
    // Wait for AOS library to load with retry mechanism
    const tryInitAOS = (retries = 0) => {
        if (typeof AOS === 'undefined') {
            if (retries < 15) {
                setTimeout(() => tryInitAOS(retries + 1), 100);
            } else {
                console.warn('AOS library failed to load after 15 attempts');
            }
            return;
        }
        
        try {
            // Log AOS version
            console.log('AOS Library loaded, version:', AOS.version || 'unknown');
            
            AOS.init({
                duration: 800,
                once: false,
                offset: 50,
                easing: 'ease-in-out',
                disable: false,
                startEvent: 'load',
                initClassName: 'aos-init',
                animatedClassName: 'aos-animate',
                useClassNames: false,
                disableMutationObserver: false,
                debounceDelay: 50,
                throttleDelay: 99
            });
            
            // Manually trigger scroll detection
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
                if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
                    AOS.refresh();
                }
            }, 100);
            
            // Log statistics
            const aosElements = document.querySelectorAll('[data-aos]');
            console.log('AOS initialized successfully');
            console.log('Elements with data-aos attribute:', aosElements.length);
            
        } catch (e) {
            console.error('Error initializing AOS:', e);
        }
    };
    
    tryInitAOS();
}

// Initialize AOS when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOSAnimations);
} else {
    initAOSAnimations();
}

// Also initialize on window load
window.addEventListener('load', function() {
    if (typeof AOS !== 'undefined' && typeof AOS.refreshHard === 'function') {
        setTimeout(() => AOS.refreshHard(), 100);
    }
});

// Refresh AOS on window resize
window.addEventListener('resize', function() {
    if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
        AOS.refresh();
    }
});

// Listen to scroll events to trigger AOS animations
window.addEventListener('scroll', function() {
    if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
        // Don't refresh on every scroll for performance, but let AOS handle it
    }
}, { passive: true });

document.addEventListener('DOMContentLoaded', function() {

    // Parallax effect for hero scene
    const scene = document.getElementById('scene');
    if (scene) {
        if (typeof Parallax !== 'undefined') {
            // If Parallax library exists, use it
            const parallaxInstance = new Parallax(scene);
        } else {
            // Fallback: simple parallax with mouse movement
            document.addEventListener('mousemove', function(event) {
                const parallaxElements = scene.querySelectorAll('[data-depth]');
                parallaxElements.forEach(element => {
                    const depth = parseFloat(element.getAttribute('data-depth'));
                    const x = (event.clientX / window.innerWidth) * (depth * 60);
                    const y = (event.clientY / window.innerHeight) * (depth * 60);
                    element.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
                });
            });
        }
    }

    // Initialize Typer effect
    initTyperEffect();

    // Initialize Tilt effect for cards
    initTiltEffect();

    // Initialize Swiper carousels
    initSwiperCarousels();

    // Initialize Counter animation
    initCounterAnimation();
    // Initialize Circle Progress animation
    initCircleProgressAnimation();
    // Initialize rotation animations
    initRotationAnimations();

    // Mobile menu toggle
    initMobileMenu();

    // Smooth scroll for anchor links
    initSmoothScroll();

    // Initialize parallax on scroll
    initScrollParallax();
});

// Typer effect implementation
function initTyperEffect() {
    const typerElement = document.querySelector('#main.typer');
    if (typerElement && typerElement.dataset.words) {
        const words = typerElement.dataset.words.split(', ');
        const delay = typerElement.dataset.delay ? parseInt(typerElement.dataset.delay) : 100;
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typerElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typerElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeDelay = delay;

            if (!isDeleting && charIndex === currentWord.length) {
                typeDelay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeDelay = 500;
            }

            setTimeout(type, typeDelay);
        }

        type();
    }
}

// Tilt effect for cards
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length === 0) {
        return;
    }
    
    // Function to initialize tilt with retry mechanism
    const tryInitTilt = (retries = 0) => {
        if (typeof VanillaTilt === 'undefined') {
            if (retries < 10) {
                // Retry after a short delay if VanillaTilt isn't loaded yet
                setTimeout(() => tryInitTilt(retries + 1), 100);
            }
            console.warn('VanillaTilt library not loaded after retries');
            return;
        }
        
        tiltElements.forEach(element => {
            // Skip if already initialized
            if (element.vanillaTilt) return;
            
            try {
                VanillaTilt.init(element, {
                    max: 10,
                    scale: 1.05,
                    speed: 400,
                    transition: true
                });
            } catch (e) {
                console.warn('Failed to initialize VanillaTilt on element:', e);
            }
        });
    };
    
    // Initial attempt
    tryInitTilt();
}

// Swiper carousels initialization
function initSwiperCarousels() {
    // Check if Swiper is available
    const initSwiper = (retries = 0) => {
        if (typeof Swiper === 'undefined') {
            if (retries < 10) {
                setTimeout(() => initSwiper(retries + 1), 100);
            }
            return;
        }
        
        // Defer initialization to ensure DOM is fully ready
        setTimeout(initAllSwipers, 500);
    };
    
    initSwiper();
}

function initAllSwipers() {
    // Initialize all Swiper instances on the page
    try {
        // Find all elements with swiper-container or swiper class
        const swiperElements = document.querySelectorAll('.swiper-container, .swiper');
        
        if (swiperElements.length === 0) {
            return;
        }
        
        swiperElements.forEach((element, index) => {
            // Skip if already initialized
            if (element.swiper) {
                return;
            }
            
            try {
                new Swiper(element, {
                    loop: true,
                    pagination: {
                        el: element.querySelector('.swiper-pagination'),
                        clickable: true
                    },
                    navigation: {
                        nextEl: element.querySelector('.swiper-button-next'),
                        prevEl: element.querySelector('.swiper-button-prev')
                    },
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                    },
                    speed: 500,
                    effect: 'slide'
                });
            } catch (e) {
                console.warn('Failed to initialize Swiper:', e);
            }
        });
    } catch (e) {
        console.warn('Swiper initialization error:', e);
    }
}

// Counter animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) {
        return;
    }
    
    let animated = false;
    
    const startCounterAnimation = () => {
        if (animated) return;
        
        // Check if any counter is in viewport
        let anyInViewport = false;
        for (let counter of counters) {
            if (isElementInViewport(counter)) {
                anyInViewport = true;
                break;
            }
        }
        
        if (!anyInViewport) return;
        
        counters.forEach(counter => {
            // Get the target value from the counter text
            const targetText = counter.getAttribute('data-target') || counter.innerText;
            const target = parseInt(targetText.replace(/[^\d]/g, '')) || parseInt(counter.innerText.replace(/[^\d]/g, ''));
            
            if (isNaN(target)) return;
            
            // Extract suffix once (%, +, etc.)
            const originalText = counter.getAttribute('data-target') || counter.innerText;
            const suffix = originalText.replace(/[0-9\s]/g, '').trim();
            
            const duration = 2000;
            const startTime = performance.now();
            let currentValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                currentValue = Math.floor(target * progress);
                
                // Only show suffix at the end to avoid clipping issues
                if (progress < 1) {
                    counter.innerText = currentValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + suffix;
                }
            };

            requestAnimationFrame(updateCounter);
        });
        
        animated = true;
    };
    
    // Check on scroll
    window.addEventListener('scroll', startCounterAnimation, { passive: true });
    
    // Also check on load
    window.addEventListener('load', startCounterAnimation);
    
    // Initial check in case page is already scrolled
    startCounterAnimation();
}

// Circle Progress animation
function initCircleProgressAnimation() {
    const circleProgresses = document.querySelectorAll('.circle-progress');
    
    if (circleProgresses.length === 0) {
        return;
    }

    // Create Intersection Observer to detect when progress bars enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check if element is intersecting and hasn't been animated yet
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const circleProgress = entry.target;
                const svg = circleProgress.querySelector('svg');
                
                if (!svg) return;
                
                const circles = svg.querySelectorAll('circle');
                if (circles.length < 2) return;
                
                const circle = circles[circles.length - 1]; // Get the last circle (progress circle)
                
                // Get the percentage from parent or span
                const spanText = circleProgress.parentElement?.querySelector('span')?.innerText || circleProgress.getAttribute('data-progress') || '0';
                const percentage = parseInt(spanText) || 0;

                // SVG circumference (usually radius = 92 for Thames template)
                // Calculate based on actual circle radius
                const radius = parseFloat(circle.getAttribute('r')) || 92;
                const circumference = 2 * Math.PI * radius;
                
                // Set up the circle for animation
                circle.setAttribute('stroke-dasharray', circumference);
                circle.setAttribute('stroke-dashoffset', circumference);
                
                // Calculate the stroke-dashoffset for the given percentage
                const offset = circumference - (percentage / 100) * circumference;

                // Animate from full to target offset
                animateStrokeDashoffset(circle, circumference, offset, 1000);
                
                // Mark as animated to prevent re-animation
                entry.target.dataset.animated = 'true';

                // Stop observing this element once animated
                observer.unobserve(circleProgress);
            }
        });
    }, { threshold: 0.1 });

    // Observe all circle progress elements
    circleProgresses.forEach(progress => {
        observer.observe(progress);
    });
}

// Helper function to animate stroke-dashoffset
function animateStrokeDashoffset(element, startValue, endValue, duration) {
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        element.setAttribute('stroke-dashoffset', currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Rotation animations
function initRotationAnimations() {
    const rotatingElements = document.querySelectorAll('.rotate-animation, .zoom-animation, .rotate-hover');
    
    if (rotatingElements.length === 0) {
        return;
    }
    
    rotatingElements.forEach(element => {
        // Check if element already has animation
        const computedStyle = window.getComputedStyle(element);
        const hasAnimation = computedStyle.animation && computedStyle.animation !== 'none';
        
        if (!hasAnimation && !element.style.animation) {
            // Apply rotation animation
            if (element.classList.contains('rotate-animation') || element.classList.contains('rotate')) {
                element.style.animation = 'rotate 20s linear infinite';
            }
            
            // Apply zoom animation
            if (element.classList.contains('zoom-animation')) {
                element.style.animation = 'zoom 3s ease-in-out infinite';
            }
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBar = document.querySelector('.mobile-menubar');
    const sideMenu = document.querySelector('.side-mobile-menu');
    const closeIcon = document.querySelector('.close-icon');
    const bodyOverlay = document.querySelector('.body-overlay');

    if (mobileMenuBar && sideMenu) {
        mobileMenuBar.addEventListener('click', function(e) {
            e.preventDefault();
            sideMenu.classList.add('open-menubar');
            if (bodyOverlay) {
                bodyOverlay.classList.add('show');
            }
        });
    }

    if (closeIcon && sideMenu) {
        closeIcon.addEventListener('click', function(e) {
            e.preventDefault();
            sideMenu.classList.remove('open-menubar');
            if (bodyOverlay) {
                bodyOverlay.classList.remove('show');
            }
        });
    }

    if (bodyOverlay && sideMenu) {
        bodyOverlay.addEventListener('click', function() {
            sideMenu.classList.remove('open-menubar');
            bodyOverlay.classList.remove('show');
        });
    }

    // Close menu when a link is clicked
    if (sideMenu) {
        const menuLinks = sideMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                sideMenu.classList.remove('open-menubar');
                if (bodyOverlay) {
                    bodyOverlay.classList.remove('show');
                }
            });
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax on scroll
function initScrollParallax() {
    const parallaxBg = document.querySelector('.experience-bg-img');
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            parallaxBg.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Re-initialize AOS on page updates
if (typeof MutationObserver !== 'undefined') {
    function setupMutationObserver() {
        var target = document.body || document.documentElement;
        if (!target) {
            document.addEventListener('DOMContentLoaded', setupMutationObserver);
            return;
        }

        try {
            const observer = new MutationObserver(function(mutations) {
                if (typeof AOS !== 'undefined' && typeof AOS.refreshHard === 'function') {
                    AOS.refreshHard();
                }
            });

            observer.observe(target, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.warn('MutationObserver setup failed:', e);
        }
    }

    setupMutationObserver();
}

// Runtime fallback: replace unsupported Font Awesome light-style `fal` with `fas`
document.addEventListener('DOMContentLoaded', function() {
    try {
        document.querySelectorAll('i.fal').forEach(function(el) {
            el.classList.remove('fal');
            el.classList.add('fas');
        });
    } catch (e) {
        console.warn('Icon class fallback failed:', e);
    }
});

/* ===== projects-data.js ===== */
// Portfolio projects data
const projectsData = [
    {
        category: 'Shopify',
        title: 'Urban Threads - Fashion Store',
        image: 'images/port-img5.jpg',
        alt: 'Urban Threads Fashion Store Shopify theme customization project',
        imageTitle: 'Urban Threads - Shopify Fashion Store',
        url: 'https://urbthread.com/',
        linkTitle: 'View Urban Threads Fashion Store Project'
    },
    {
        category: 'WordPress SaaS',
        title: 'CloudWise - B2B Platform',
        image: 'images/port-img6.jpg',
        alt: 'CloudWise B2B SaaS marketing website built on WordPress',
        imageTitle: 'CloudWise - B2B SaaS Website',
        url: 'https://www.cloudwise.co.ke/',
        linkTitle: 'View CloudWise SaaS Website Project'
    },
    {
        category: 'WordPress Learnpress',
        title: 'EOKK OÜ e-koolituskeskus - LMS',
        image: 'images/port-img7.jpg',
        alt: 'EOKK OÜ e-koolituskeskus LMS WordPress solution with quizzes and certificates',
        imageTitle: 'EOKK OÜ - LMS WordPress',
        url: 'https://ohutus.edu.ee/',
        linkTitle: 'View EOKK OÜ e-koolituskeskus LMS Project'
    },
    {
        category: 'squarespace Corporate',
        title: 'Nova Consulting - Corporate Site',
        image: 'images/port-img8.jpg',
        alt: 'Nova Consulting corporate Squarespace site with performance optimization',
        imageTitle: 'Nova Consulting - Corporate Squarespace',
        url: 'https://www.novabrandconsulting.com/',
        linkTitle: 'View Nova Consulting Corporate Project'
    }
];

// Function to get projects (mimics the PHP response structure)
function getProjects() {
    return {
        success: true,
        projects: projectsData
    };
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

