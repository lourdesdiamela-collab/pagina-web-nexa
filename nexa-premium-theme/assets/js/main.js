document.addEventListener("DOMContentLoaded", () => {
    
    // Initialize Lucide Icons
    lucide.createIcons();

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Navbar Scroll Effect
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenu.classList.contains('active') ? 'x' : 'menu';
        mobileToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileToggle.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // 3. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 4. GSAP Animations (Replicating Framer Motion)
    
    // Fade In Up (Generic)
    gsap.utils.toArray('.gsap-fade-in-up').forEach(element => {
        const delay = element.getAttribute('data-delay') || 0;
        gsap.fromTo(element, 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: delay,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Fade In Left
    gsap.utils.toArray('.gsap-fade-in-left').forEach(element => {
        const delay = element.getAttribute('data-delay') || 0;
        gsap.fromTo(element, 
            { opacity: 0, x: -40 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.8, 
                delay: delay,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%"
                }
            }
        );
    });

    // Fade In Right
    gsap.utils.toArray('.gsap-fade-in-right').forEach(element => {
        const delay = element.getAttribute('data-delay') || 0;
        gsap.fromTo(element, 
            { opacity: 0, x: 40 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.8, 
                delay: delay,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%"
                }
            }
        );
    });

    // Stagger Up (Collections like Clients, Services, Methodology)
    const staggerUpGroups = document.querySelectorAll('.clients-row, .services-grid, .method-grid');
    staggerUpGroups.forEach(group => {
        const items = group.querySelectorAll('.gsap-stagger-up');
        if (items.length > 0) {
            gsap.fromTo(items,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: group,
                        start: "top 85%"
                    }
                }
            );
        }
    });

    // Stagger Scale (Pills, Transformation Cards)
    const staggerScaleGroups = document.querySelectorAll('.about-pills, .transform-grid');
    staggerScaleGroups.forEach(group => {
        const items = group.querySelectorAll('.gsap-stagger-scale');
        if (items.length > 0) {
            gsap.fromTo(items,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: group,
                        start: "top 85%"
                    }
                }
            );
        }
    });

});
