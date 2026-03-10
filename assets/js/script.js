'use strict';

// ===== 3D AVATAR TILT EFFECT =====
const avatarBox = document.getElementById('avatar-box');

if (avatarBox) {
    avatarBox.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = avatarBox.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the image
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate tilt amounts (max 15 degrees)
        const tiltX = ((y - centerY) / centerY) * -15; 
        const tiltY = ((x - centerX) / centerX) * 15;
        
        // Apply 3D transformation
        avatarBox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    avatarBox.addEventListener('mouseleave', () => {
        // Reset the transformation when mouse leaves
        avatarBox.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        avatarBox.style.transition = `transform 0.5s ease`;
    });

    avatarBox.addEventListener('mouseenter', () => {
        // Remove the transition lag immediately so it follows the mouse instantly
        avatarBox.style.transition = `transform 0.1s ease`;
    });
}

// ===== SIDEBAR CONTACTS TOGGLE =====
const infoMoreBtn = document.getElementById('info-more-btn');
const sidebarInfoMore = document.getElementById('sidebar-info-more');

infoMoreBtn.addEventListener('click', () => {
    infoMoreBtn.classList.toggle('active');
    sidebarInfoMore.classList.toggle('active');
    infoMoreBtn.querySelector('span').textContent =
        sidebarInfoMore.classList.contains('active') ? 'Hide Contacts' : 'Show Contacts';
});

// ===== PAGE NAVIGATION (Tab Switching) =====
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');
const overlay = document.getElementById('page-transition');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetPage = link.dataset.target;
        
        // Prevent re-clicking the same active link
        if (link.classList.contains('active')) return;

        // Trigger transition overlay
        if (overlay) {
            overlay.classList.add('active');
            
            setTimeout(() => {
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show target page
                pages.forEach(page => {
                    if (page.dataset.page === targetPage) {
                        page.classList.add('active');
                    } else {
                        page.classList.remove('active');
                    }
                });

                // Scroll to top of main content
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Hide overlay after switching
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 200); // short delay to show the new page rendering before pulling back
            }, 600); // 600ms matches the slide down animation duration in CSS
        } else {
            // Fallback if no overlay
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            pages.forEach(page => {
                if (page.dataset.page === targetPage) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('[data-filter]');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ===== TYPING ANIMATION =====
const typingEl = document.getElementById('typing-title');
if (typingEl) {
    const roles = ['Software Developer', 'ML Engineer', 'Full-Stack Dev'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const current = roles[roleIndex];
        typingEl.textContent = current.substring(0, charIndex);

        if (!isDeleting) {
            charIndex++;
            if (charIndex > current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1500);
                return;
            }
        } else {
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }

    typeEffect();
}

// ===== CONTACT FORM (AJAX) =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }
        })
        .catch(() => {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
        });
    });
}

// ===== 3D ANIMAL CURSOR FOLLOWER =====
const animal = document.createElement('div');
animal.id = 'cursor-animal';
animal.innerHTML = '<img src="assets/images/3d-avatar.png" alt="My 3D Character" style="width: 60px; height: 60px; object-fit: contain; filter: drop-shadow(0 0 12px #64ffda); transition: transform 0.1s; transform-origin: center;">'; // Neon glow cursor follower!
document.body.appendChild(animal);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let animalX = mouseX;
let animalY = mouseY;
let isMoving = false;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY; // adjust for scroll
    isMoving = true;
});

// Update animal Y pos when scrolling
window.addEventListener('scroll', () => {
    // Keep it physically near where the mouse is on the page
    mouseY = window.event ? window.event.clientY + window.scrollY : mouseY;
});

function animateAnimal() {
    // Calculate distance
    let dx = mouseX - animalX;
    let dy = mouseY - animalY;
    
    // Smooth interpolation (easing)
    animalX += dx * 0.1;
    animalY += dy * 0.1;
    
    // Calculate 3D movements
    // If moving down, it points down. If moving up, points up.
    let rotateX = dy * 0.15; // Vertical rotation
    // Flip horizontally based on X direction
    let scaleX = dx < 0 ? -1 : 1; 
    let rotateZ = dx < 0 ? -dy * 0.05 : dy * 0.05;

    // Apply movement with 3D transforms
    // Offset by 20px so it's slightly bottom-right of the actual cursor
    animal.style.transform = `translate3d(${animalX + 20}px, ${animalY + 20}px, 0) scaleX(${scaleX}) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
    
    requestAnimationFrame(animateAnimal);
}

// Start animation loop
animateAnimal();
