document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if(themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // RTL Toggle
  const rtlToggle = document.getElementById('rtl-toggle');
  const savedRtl = localStorage.getItem('rtl') || 'ltr';
  
  document.documentElement.setAttribute('dir', savedRtl);
  
    if(rtlToggle) {
      rtlToggle.innerText = savedRtl === 'ltr' ? 'RTL' : 'LTR';
      rtlToggle.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir');
        const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('rtl', newDir);
        rtlToggle.innerText = newDir === 'ltr' ? 'RTL' : 'LTR';
      });
    }

  // User Profile Dropdown Toggle
  const userToggle = document.getElementById('user-toggle');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');

  if (userToggle && userDropdownMenu) {
    userToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdownMenu.contains(e.target) && !userToggle.contains(e.target)) {
        userDropdownMenu.classList.remove('show');
      }
    });
  }

  // Mobile Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if(mobileMenuBtn && navLinks) {
    const menuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      if (isActive) {
        document.body.classList.add('no-scroll');
        if (menuIcon) { menuIcon.classList.replace('fa-bars', 'fa-times'); }
      } else {
        document.body.classList.remove('no-scroll');
        if (menuIcon) { menuIcon.classList.replace('fa-times', 'fa-bars'); }
      }
    });

    // Close mobile menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (menuIcon) { menuIcon.classList.replace('fa-times', 'fa-bars'); }
      });
    });
  }


  // Active Link Indication
  const currentPath = window.location.pathname;
  const allLinks = document.querySelectorAll('.nav-links a, .links-col a');
  
  allLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref || linkHref === '#') return;
    
    // Create a URL object to extract just the pathname for comparison
    // Handling potential relative paths by providing window.location as base
    const linkUrl = new URL(linkHref, window.location.origin + window.location.pathname);
    const linkPath = linkUrl.pathname;
    
    if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
      link.classList.add('active');
    }
  });

  // Quick View Modal Logic
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('quickViewModal');
  
  if (modal) {
    const closeBtn = modal.querySelector('.close-modal');
    
    // Close modal
    const closeModal = () => {
      modal.classList.remove('show');
      document.body.classList.remove('no-scroll');
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close on click outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Open modal and populate data
    quickViewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        if (!card) return;
        
        // Extract data
        const imgSrc = card.querySelector('img').src;
        const title = card.querySelector('h3').innerText;
        const price = card.querySelector('.price').innerText;
        const ratingHTML = card.querySelector('.rating').innerHTML;
        
        // Populate modal
        document.getElementById('qv-img').src = imgSrc;
        document.getElementById('qv-title').innerText = title;
        document.getElementById('qv-price').innerText = price;
        document.getElementById('qv-rating').innerHTML = ratingHTML;
        
        // Show modal
        modal.classList.add('show');
        document.body.classList.add('no-scroll');
      });
    });
  }

  // Accordion Logic for Buying Guide
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.guide-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all other accordions (optional, but good UX)
        accordionItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        // Toggle current one
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

});

// Back to Top functionality
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Universal Toast Notification
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// Global Form Submit Handler (Refreshes inputs, shows success message, prevents page reload)
document.addEventListener('submit', (e) => {
  const form = e.target;

  // Skip if custom inline validation (e.g. signup validateForm) handles submit
  if (form.getAttribute('onsubmit') && form.getAttribute('onsubmit').includes('validateForm')) {
    return;
  }

  // Prevent default page reload
  e.preventDefault();

  // Determine appropriate success message and redirect
  let msg = 'Submitted successfully!';
  let redirectUrl = null;

  if (form.classList.contains('auth-form')) {
    msg = 'Logged in successfully! Redirecting to Home...';
    redirectUrl = '../index.html';
  } else if (form.classList.contains('contact-form')) {
    msg = 'Thank you! Your message has been sent successfully.';
  } else if (form.closest('.footer-newsletter') || form.classList.contains('newsletter-form') || form.querySelector('input[type="email"]')) {
    msg = 'Subscribed successfully! Thank you for joining Sportivo.';
  } else if (form.closest('.booking-form-wrapper') || form.closest('.booking-card') || (form.action && form.action.includes('booking'))) {
    msg = 'Your booking request has been submitted successfully!';
  }

  // Refresh input column (reset all input fields)
  form.reset();

  // Display success message toast
  showToast(msg, 'success');

  // Perform redirect if applicable
  if (redirectUrl) {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
  }
});

