'use strict';

// ===== AVATAR UPLOAD =====
const avatarBox = document.getElementById('avatar-box');
const avatarUpload = document.getElementById('avatar-upload');
const avatarImg = document.getElementById('avatar-img');

// Load saved avatar from localStorage
const savedAvatar = localStorage.getItem('portfolioAvatar');
if (savedAvatar) {
    avatarImg.src = savedAvatar;
    avatarImg.style.display = 'block';
    avatarBox.classList.remove('placeholder');
}

avatarBox.addEventListener('click', () => avatarUpload.click());

avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        avatarImg.src = event.target.result;
        avatarImg.style.display = 'block';
        avatarBox.classList.remove('placeholder');
        localStorage.setItem('portfolioAvatar', event.target.result);
    };
    reader.readAsDataURL(file);
});

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

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetPage = link.dataset.target;

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
