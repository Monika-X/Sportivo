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

  // Cart Dropdown Toggle
  const cartToggle = document.getElementById('cart-toggle');
  const cartDropdownMenu = document.getElementById('cart-dropdown-menu');

  if (cartToggle && cartDropdownMenu) {
    cartToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      cartDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!cartDropdownMenu.contains(e.target) && !cartToggle.contains(e.target)) {
        cartDropdownMenu.classList.remove('show');
      }
    });
  }

  // Wishlist Toggle
  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fas', btn.classList.contains('active'));
        icon.classList.toggle('far', !btn.classList.contains('active'));
      }
    });
  });

  // Add to Cart
  const cartCount = document.getElementById('cart-count');
  const cartEmpty = document.getElementById('cart-empty');
  const cartItems = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartItemsList = [];

  function updateCart() {
    const hasItems = cartItemsList.length > 0;
    if (cartEmpty) cartEmpty.style.display = hasItems ? 'none' : 'flex';
    if (cartFooter) cartFooter.style.display = hasItems ? 'flex' : 'none';
    if (cartCount) cartCount.textContent = cartItemsList.length;
    if (cartItems) {
      cartItems.innerHTML = '';
      cartItemsList.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'cart-item';

        const info = document.createElement('div');
        info.className = 'cart-item-info';

        const nameEl = document.createElement('span');
        nameEl.className = 'cart-item-name';
        nameEl.textContent = item.name;

        const priceEl = document.createElement('span');
        priceEl.className = 'cart-item-price';
        priceEl.textContent = '$' + item.price.toFixed(2);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-item-remove';
        removeBtn.setAttribute('aria-label', 'Remove ' + item.name);
        removeBtn.title = 'Remove from Cart';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', () => {
          cartItemsList.splice(idx, 1);
          updateCart();
        });

        info.appendChild(nameEl);
        info.appendChild(priceEl);
        el.appendChild(info);
        el.appendChild(removeBtn);
        cartItems.appendChild(el);
      });
    }
    const total = cartItemsList.reduce((sum, item) => sum + item.price, 0);
    if (cartTotalPrice) cartTotalPrice.textContent = '$' + total.toFixed(2);
  }

  function addToCart(button) {
    const name = button.dataset.name || 'Product';
    const price = parseFloat(button.dataset.price) || 0;
    cartItemsList.push({ name, price });
    updateCart();
    button.classList.add('added');
    const label = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    setTimeout(() => {
      button.classList.remove('added');
      button.innerHTML = label;
    }, 1500);
  }

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(btn));
  });

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
    const openQuickView = (card) => {
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

      const qvAddBtn = document.getElementById('qv-add-to-cart');
      if (qvAddBtn) {
        qvAddBtn.dataset.name = title;
        qvAddBtn.dataset.price = price.replace(/[^0-9.]/g, '');
      }
      
      // Show modal
      modal.classList.add('show');
      document.body.classList.add('no-scroll');
    };

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(btn.closest('.product-card'));
      });
    });

    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.wishlist-btn, .add-to-cart-btn, .buy-now-btn, .quick-view-btn, a')) return;
        openQuickView(card);
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

