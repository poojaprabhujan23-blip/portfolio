/**
 * ============================================================================
 * POOJA PRABHU - PORTFOLIO INTERACTIVE CONTROLLER
 * Vanilla JavaScript (ES6+) | Accessible, Lightweight, Zero-Dependencies
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Theme)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Initial Theme: Default to 'light' per design requirements
  const savedTheme = localStorage.getItem('pooja_portfolio_theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else {
    // Default appearance is Light Theme
    htmlRoot.setAttribute('data-theme', 'light');
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('pooja_portfolio_theme', newTheme);
    themeToggleBtn.setAttribute('aria-label', `Switch to ${currentTheme} theme`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Sticky Header
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');

  function updateScrollState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update progress bar
    if (scrollProgressBar && docHeight > 0) {
      const scrollPercentage = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
    }

    // Toggle header shadow on scroll
    if (siteHeader) {
      if (scrollTop > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // --------------------------------------------------------------------------
  // 3. Navigation Links & Active Scrollspy
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --------------------------------------------------------------------------
  // 4. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (!mobileDrawer || !mobileDrawerOverlay) return;
    mobileDrawer.classList.add('open');
    mobileDrawerOverlay.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileDrawer.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileDrawerOverlay) return;
    mobileDrawer.classList.remove('open');
    mobileDrawerOverlay.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openDrawer);
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }
  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeDrawer);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --------------------------------------------------------------------------
  // 5. Project Filtering Tabs
  // --------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.project-tabs .tab-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');

      // Update active tab button
      filterTabs.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Copy Email to Clipboard with Animated Toast
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const studentEmail = 'poojaprabhujan23@gmail.com';
  let toastTimeout = null;

  function showToast(message) {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(studentEmail);
        } else {
          // Fallback for older contexts
          const tempInput = document.createElement('textarea');
          tempInput.value = studentEmail;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.focus();
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('Email copied: ' + studentEmail);
      } catch (err) {
        showToast('Email: ' + studentEmail);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Contact Form Handling & Direct Mailto Launch
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactSubject = document.getElementById('contactSubject');
  const contactMessage = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');
  const formSuccessToast = document.getElementById('formSuccessToast');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous error messages
      nameError.textContent = '';
      emailError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';

      // Validate Name
      if (!contactName.value.trim()) {
        nameError.textContent = 'Please provide your name.';
        isValid = false;
      }

      // Validate Email
      if (!contactEmail.value.trim()) {
        emailError.textContent = 'Please provide your email address.';
        isValid = false;
      } else if (!validateEmail(contactEmail.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Subject
      if (!contactSubject.value.trim()) {
        subjectError.textContent = 'Please specify a subject.';
        isValid = false;
      }

      // Validate Message
      if (!contactMessage.value.trim()) {
        messageError.textContent = 'Please enter your message.';
        isValid = false;
      } else if (contactMessage.value.trim().length < 8) {
        messageError.textContent = 'Message is too short (min 8 characters).';
        isValid = false;
      }

      if (!isValid) return;

      // Construct mailto URI
      const subjectEncoded = encodeURIComponent(contactSubject.value.trim());
      const bodyContent = `Hello Pooja,\n\n${contactMessage.value.trim()}\n\nBest regards,\n${contactName.value.trim()}\nEmail: ${contactEmail.value.trim()}`;
      const bodyEncoded = encodeURIComponent(bodyContent);
      const mailtoUrl = `mailto:${studentEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`;

      if (formSuccessToast) {
        formSuccessToast.style.display = 'block';
        setTimeout(() => {
          formSuccessToast.style.display = 'none';
        }, 5000);
      }

      // Launch default email client
      window.location.href = mailtoUrl;
    });
  }

  // --------------------------------------------------------------------------
  // 8. Modals (Resume Modal & Project Details Modal)
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const mobileResumeBtn = document.getElementById('mobileResumeBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  const projectModal = document.getElementById('projectModal');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalContent = document.getElementById('projectModalContent');
  const viewProjectBtns = document.querySelectorAll('.view-project-modal-btn');

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalEl.focus();
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Resume Modal Event Handlers
  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', () => openModal(resumeModal));
  }
  if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener('click', () => {
      closeDrawer();
      openModal(resumeModal);
    });
  }
  if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', () => closeModal(resumeModal));
  }
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Project Details Modal Data & Handlers
  const projectData = {
    kms: {
      title: 'Knowledge Management System',
      category: 'Web Development & Information Architecture',
      status: 'Completed',
      overview: 'The Knowledge Management System is a centralized digital format engineered to store, organize, catalog, and view academic and technical resources seamlessly in one unified interface.',
      problemSolved: 'Academic materials, code snippets, reference guides, and developmental notes often end up fragmented across drives, bookmarks, and chat histories. This project provides a centralized, easy-to-browse knowledge repository for efficient access.',
      features: [
        'Centralized Resource Repository for storing reference materials',
        'Categorized topic navigation and structured directory hierarchy',
        'Intuitive resource viewer designed for quick document inspection',
        'Responsive layout adapting cleanly across desktop and mobile screens',
        'Clean client-side indexing for swift access to frequently used guides'
      ],
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Centralized Resource Architecture']
    }
  };

  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-project');
      const data = projectData[pKey];
      if (data && projectModal && projectModalContent) {
        projectModalTitle.textContent = data.title;
        projectModalContent.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom: 0.75rem;">
              <span class="badge badge-primary">${data.category}</span>
              <span class="badge badge-success">&#10003; ${data.status}</span>
            </div>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
              ${data.overview}
            </p>
          </div>

          <div style="background-color: var(--bg-subtle); padding: 1.25rem; border-radius: 8px; margin-bottom: 1.25rem; border: 1px solid var(--border-light);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">The Objective</h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55;">
              ${data.problemSolved}
            </p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Key Capabilities</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem; padding-left:0;">
              ${data.features.map(f => `<li style="font-size:0.88rem; color:var(--text-secondary); padding-left:1.2rem; position:relative;"><span style="position:absolute; left:0; color:var(--primary-orange);">&#9656;</span> ${f}</li>`).join('')}
            </ul>
          </div>

          <div style="border-top: 1px solid var(--border-light); padding-top: 1rem;">
            <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom: 0.5rem;">Technologies Used</h4>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        `;
        openModal(projectModal);
      }
    });
  });

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => closeModal(projectModal));
  }

  // Close modals on clicking backdrop
  [resumeModal, projectModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close modals & drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (resumeModal && resumeModal.classList.contains('open')) closeModal(resumeModal);
      if (projectModal && projectModal.classList.contains('open')) closeModal(projectModal);
    }
  });

  // --------------------------------------------------------------------------
  // 9. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic Current Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 11. Subtle Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const animatedElements = document.querySelectorAll(
      '.hero-content, .code-card, .about-bio-card, .attribute-card, .timeline-card, .skill-meter-card, .project-card, .experience-card, .cert-card, .ambition-card, .contact-card'
    );

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
      observer.observe(el);
    });
  }
});
