/**
 * Студия «Бровная культура» — Static Stable Editorial Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const bookingButtons = document.querySelectorAll('[data-action="open-booking"]');
  const bookingForm = document.getElementById('bookingForm');
  const modalBodyForm = document.getElementById('modalBodyForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const successCloseBtn = document.getElementById('successCloseBtn');

  // Pill & Nav Links
  const navLinks = document.querySelectorAll('.pill-nav-link, .nav-link');
  const viewWorksLink = document.getElementById('viewWorksLink');

  // Mobile Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerNavLinks = document.querySelectorAll('.drawer-nav-link:not(.drawer-nav-link-map)');

  // Header
  const siteHeader = document.getElementById('siteHeader');

  // --- Header Scroll Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      siteHeader.classList.add('is-scrolled');
      siteHeader.style.padding = '0.75rem 0';
      siteHeader.style.backgroundColor = 'rgba(239, 227, 215, 0.96)';
      siteHeader.style.boxShadow = '0 4px 20px rgba(56, 34, 25, 0.06)';
    } else {
      siteHeader.classList.remove('is-scrolled');
      siteHeader.style.padding = '';
      siteHeader.style.backgroundColor = '';
      siteHeader.style.boxShadow = '';
    }
  }, { passive: true });

  // --- Pill Nav Active State Switching & Feedback ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const navTarget = link.getAttribute('data-nav');
      if (navTarget === 'home') {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
        return;
      }

      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');

      const titles = {
        services: 'Услуги',
        works: 'Работы',
        reviews: 'Отзывы',
        contacts: 'Контакты'
      };
      const title = titles[navTarget] || 'Раздел';
      showToast(`Блок «${title}» будет добавлен на следующем этапе. Сейчас доступна запись к мастерам`);
    });
  });

  // "Смотреть работы"
  if (viewWorksLink) {
    viewWorksLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Галерея работ студии появится в следующем блоке. Запишитесь к топ-мастерам онлайн');
    });
  }

  // --- Drawer Nav Links Feedback ---
  drawerNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#hero') {
        closeMobileDrawer();
        return;
      }
      e.preventDefault();
      closeMobileDrawer();
      showToast('Раздел появится на следующем этапе. Оформите запись к мастерам онлайн');
    });
  });

  // --- Modal Open / Close Logic ---
  let previouslyFocusedElement = null;
  const modalDescription = document.querySelector('.modal-description');
  const defaultModalDesc = modalDescription ? modalDescription.textContent : '';

  function openBookingModal(masterName = null) {
    closeMobileDrawer();
    previouslyFocusedElement = document.activeElement;
    
    bookingModal.classList.add('is-active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Персонализация под выбранного мастера
    if (modalDescription) {
      if (masterName) {
        modalDescription.textContent = `Запись к мастеру ${masterName}. Выберите услугу и укажите телефон — администратор свяжется с вами.`;
      } else {
        modalDescription.textContent = defaultModalDesc;
      }
    }

    // Reset form view
    if (modalSuccessState && modalBodyForm) {
      modalSuccessState.style.display = 'none';
      modalBodyForm.style.display = 'block';
      bookingForm.reset();
      clearFormErrors();
    }

    setTimeout(() => {
      const nameInput = document.getElementById('userName');
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeBookingModal() {
    bookingModal.classList.remove('is-active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  // Делегирование кликов на кнопки записи
  document.addEventListener('click', (e) => {
    const bookingBtn = e.target.closest('[data-action="open-booking"]');
    if (bookingBtn) {
      e.preventDefault();
      const master = bookingBtn.getAttribute('data-master');
      openBookingModal(master);
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeBookingModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeBookingModal);

  // --- Mobile Drawer Logic ---
  function openMobileDrawer() {
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

  // --- Escape Key Listener ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookingModal.classList.contains('is-active')) {
        closeBookingModal();
      } else if (mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer();
      }
    }
  });

  // --- Phone Masking & Form Validation ---
  const userNameInput = document.getElementById('userName');
  const userPhoneInput = document.getElementById('userPhone');

  if (userPhoneInput) {
    userPhoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.substring(1);
      if (!val.startsWith('7')) val = '7' + val;

      let formatted = '+7';
      if (val.length > 1) {
        formatted += ' (' + val.substring(1, 4);
      }
      if (val.length >= 5) {
        formatted += ') ' + val.substring(4, 7);
      }
      if (val.length >= 8) {
        formatted += '-' + val.substring(7, 9);
      }
      if (val.length >= 10) {
        formatted += '-' + val.substring(9, 11);
      }
      e.target.value = formatted;
    });
  }

  function clearFormErrors() {
    if (userNameInput) userNameInput.classList.remove('is-invalid');
    if (userPhoneInput) userPhoneInput.classList.remove('is-invalid');
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      let hasError = false;
      const nameVal = userNameInput ? userNameInput.value.trim() : '';
      const phoneVal = userPhoneInput ? userPhoneInput.value.trim() : '';

      if (!nameVal) {
        userNameInput.classList.add('is-invalid');
        hasError = true;
      }

      const digitsOnly = phoneVal.replace(/\D/g, '');
      if (digitsOnly.length < 11) {
        userPhoneInput.classList.add('is-invalid');
        hasError = true;
      }

      if (!hasError) {
        modalBodyForm.style.display = 'none';
        modalSuccessState.style.display = 'block';
      }
    });
  }

  // --- Toast Notification Helper ---
  let toastTimeout = null;
  function showToast(message) {
    let toast = document.getElementById('studioToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'studioToast';
      toast.className = 'studio-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span class="toast-dot" aria-hidden="true"></span>
      <span class="toast-text">${message}</span>
      <button type="button" class="toast-action" data-action="open-booking">Записаться</button>
    `;

    const toastActionBtn = toast.querySelector('.toast-action');
    if (toastActionBtn) {
      toastActionBtn.addEventListener('click', () => {
        toast.classList.remove('is-visible');
        openBookingModal();
      });
    }

    clearTimeout(toastTimeout);
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4500);
  }
});
