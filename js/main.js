/**
 * CAFFÈ ITALIANO MILANO — Bespoke Interactive Experience
 * Webflow-Grade Physics, 3D Tilt, Floating Hover Previews, Cart & Reservation Engines
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM MAGNETIC FLUID CURSOR
     ========================================================================== */
  const cursorFollower = document.getElementById('cursorFollower');
  const cursorDot = document.getElementById('cursorDot');
  const cursorText = document.getElementById('cursorText');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isHoveringInteractive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Smooth lerp loop for follower
  function updateCursor() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    if (cursorFollower) {
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
    }
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Dynamic cursor label assignments
  function setCursorState(label = 'EXPLORE') {
    if (!cursorFollower) return;
    cursorFollower.classList.add('is-hovering');
    if (cursorText) cursorText.textContent = label;
  }

  function resetCursorState() {
    if (!cursorFollower) return;
    cursorFollower.classList.remove('is-hovering');
  }

  // Attach hover events
  document.querySelectorAll('.menu-item-row').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorState('TASTE'));
    el.addEventListener('mouseleave', resetCursorState);
  });

  document.querySelectorAll('.experience-card').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorState('EXPLORE'));
    el.addEventListener('mouseleave', resetCursorState);
  });

  document.querySelectorAll('.btn').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorState('SELECT'));
    el.addEventListener('mouseleave', resetCursorState);
  });

  document.querySelectorAll('.cart-trigger-btn').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorState('BAG'));
    el.addEventListener('mouseleave', resetCursorState);
  });

  /* ==========================================================================
     2. FLOATING HOVER IMAGE PREVIEW (Menu Item Follower)
     ========================================================================== */
  const menuHoverPreview = document.getElementById('menuHoverPreview');
  const hoverPreviewImg = document.getElementById('hoverPreviewImg');
  const hoverPreviewBadge = document.getElementById('hoverPreviewBadge');

  let previewTargetX = 0;
  let previewTargetY = 0;
  let previewCurrentX = 0;
  let previewCurrentY = 0;

  function updateHoverPreview() {
    previewCurrentX += (previewTargetX - previewCurrentX) * 0.15;
    previewCurrentY += (previewTargetY - previewCurrentY) * 0.15;

    if (menuHoverPreview && menuHoverPreview.classList.contains('active')) {
      menuHoverPreview.style.left = `${previewCurrentX}px`;
      menuHoverPreview.style.top = `${previewCurrentY}px`;
    }
    requestAnimationFrame(updateHoverPreview);
  }
  requestAnimationFrame(updateHoverPreview);

  document.querySelectorAll('.interactive-menu-item').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const imgSrc = item.getAttribute('data-image');
      const tagText = item.getAttribute('data-tag') || 'Signature';

      if (hoverPreviewImg && imgSrc) {
        hoverPreviewImg.src = imgSrc;
      }
      if (hoverPreviewBadge) {
        hoverPreviewBadge.textContent = tagText;
      }

      previewTargetX = e.clientX + 40;
      previewTargetY = e.clientY - 20;
      previewCurrentX = previewTargetX;
      previewCurrentY = previewTargetY;

      if (menuHoverPreview) {
        menuHoverPreview.classList.add('active');
      }
    });

    item.addEventListener('mousemove', (e) => {
      // Offset slightly from cursor so it doesn't obstruct reading
      previewTargetX = e.clientX + 30;
      previewTargetY = e.clientY - 30;
    });

    item.addEventListener('mouseleave', () => {
      if (menuHoverPreview) {
        menuHoverPreview.classList.remove('active');
      }
    });
  });

  /* ==========================================================================
     3. HERO SLIDER CONTROLLER
     ========================================================================== */
  const slides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot, .indicator-pill');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlideIndex = 0;
  let slideInterval = null;
  const SLIDE_DURATION = 6500; // 6.5 seconds per slide

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });

    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentSlideIndex = index;
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-slide-target'), 10);
      goToSlide(target);
      startAutoPlay();
    });
  });

  // Pause on hover over hero content
  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();

  /* ==========================================================================
     4. 3D TILT PHYSICS & SPECULAR GLARE ON CARDS
     ========================================================================== */
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(card => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // max 10deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  /* ==========================================================================
     5. INTERACTIVE ROAST & FLAVOR PROFILE EXPLORER
     ========================================================================== */
  const roastData = {
    alba: {
      title: "Alba Toscana • Light Roast",
      meta: "ETHIOPIA YIRGACHEFFE & COLOMBIA HUILA",
      desc: "A radiant morning blend with floral jasmine blossoms, bright Meyer lemon acidity, and a delicate wild mountain honey finish. Perfect for pour-over, Aeropress, and silky milk cortados.",
      notes: ["Jasmine Flower", "Meyer Lemon", "Wild Honey", "Bergamot"],
      process: "Washed & Sun-Dried",
      altitude: "1,950m — 2,200m",
      ideal: "V60 Pour Over & Cortado",
      intensity: "6 / 10",
      acidity: "85%",
      sweetness: "70%",
      body: "55%",
      crema: "60%",
      price: "$18.50",
      bagName: "Alba Toscana Roast (250g)"
    },
    milano: {
      title: "Milano Riserva • Medium-Dark Signature",
      meta: "BRAZIL CERRADO, GUATEMALA ANTIGUA & INDIA MONSOONED",
      desc: "Our legendary 1984 house roast. Velvety, low-acidity profile dominated by rich 85% bittersweet cocoa, toasted Piedmontese hazelnuts, and a warm caramel finish. The benchmark for Italian espresso.",
      notes: ["Dark Cocoa", "Toasted Hazelnut", "Orange Blossom", "Caramelized Sugar"],
      process: "Natural & Honey Process",
      altitude: "1,400m — 1,750m",
      ideal: "9-Bar Espresso & Cappuccino",
      intensity: "8 / 10",
      acidity: "45%",
      sweetness: "85%",
      body: "88%",
      crema: "92%",
      price: "$19.50",
      bagName: "Milano Riserva Roast (250g)"
    },
    napoli: {
      title: "Napoli Scura • Dark Intenso Traditional",
      meta: "SOUTHERN ITALIAN BLEND • 80% ARABICA + 20% HIGH-GROWN ROBUSTA",
      desc: "Bold, viscous, and unapologetic. Roasty notes of molten dark molasses, cracked black pepper, tobacco leaf, and a dense persistent crema that easily supports a spoon of demerara sugar.",
      notes: ["Smoky Cacao", "Black Molasses", "Roasted Walnut", "Spiced Cedar"],
      process: "Full Drum Roasted at 225°C",
      altitude: "1,100m — 1,500m",
      ideal: "Moka Pot & Ristretto Double",
      intensity: "10 / 10",
      acidity: "20%",
      sweetness: "65%",
      body: "98%",
      crema: "99%",
      price: "$17.50",
      bagName: "Napoli Scura Roast (250g)"
    }
  };

  const roastTabBtns = document.querySelectorAll('.roast-tab-btn');
  const roastTitle = document.getElementById('roastTitle');
  const roastMetaBadge = document.getElementById('roastMetaBadge');
  const roastDescription = document.getElementById('roastDescription');
  const roastNotesTags = document.getElementById('roastNotesTags');
  const specProcess = document.getElementById('specProcess');
  const specAltitude = document.getElementById('specAltitude');
  const specIdeal = document.getElementById('specIdeal');
  const roastIntensityNumber = document.getElementById('roastIntensityNumber');

  const meterAcidityFill = document.getElementById('meterAcidityFill');
  const meterAcidityVal = document.getElementById('meterAcidityVal');
  const meterSweetnessFill = document.getElementById('meterSweetnessFill');
  const meterSweetnessVal = document.getElementById('meterSweetnessVal');
  const meterBodyFill = document.getElementById('meterBodyFill');
  const meterBodyVal = document.getElementById('meterBodyVal');
  const meterCremaFill = document.getElementById('meterCremaFill');
  const meterCremaVal = document.getElementById('meterCremaVal');
  const orderRoastBtn = document.getElementById('orderRoastBtn');

  function updateRoastCard(roastKey) {
    const data = roastData[roastKey];
    if (!data) return;

    if (roastTitle) roastTitle.textContent = data.title;
    if (roastMetaBadge) roastMetaBadge.textContent = data.meta;
    if (roastDescription) roastDescription.textContent = data.desc;
    if (specProcess) specProcess.textContent = data.process;
    if (specAltitude) specAltitude.textContent = data.altitude;
    if (specIdeal) specIdeal.textContent = data.ideal;
    if (roastIntensityNumber) roastIntensityNumber.textContent = data.intensity;

    // Update tags
    if (roastNotesTags) {
      roastNotesTags.innerHTML = data.notes.map(n => `<span class="note-pill">${n}</span>`).join('');
    }

    // Update sliders
    if (meterAcidityFill) meterAcidityFill.style.width = data.acidity;
    if (meterAcidityVal) meterAcidityVal.textContent = data.acidity;

    if (meterSweetnessFill) meterSweetnessFill.style.width = data.sweetness;
    if (meterSweetnessVal) meterSweetnessVal.textContent = data.sweetness;

    if (meterBodyFill) meterBodyFill.style.width = data.body;
    if (meterBodyVal) meterBodyVal.textContent = data.body;

    if (meterCremaFill) meterCremaFill.style.width = data.crema;
    if (meterCremaVal) meterCremaVal.textContent = data.crema;

    if (orderRoastBtn) {
      orderRoastBtn.setAttribute('data-name', data.bagName);
      orderRoastBtn.setAttribute('data-price', data.price.replace('$', ''));
      const textSpan = orderRoastBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = `Order Whole Bean Bag (250g) — ${data.price}`;
      }
    }
  }

  roastTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roastTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const roast = btn.getAttribute('data-roast');
      updateRoastCard(roast);
    });
  });

  /* ==========================================================================
     6. MENU FILTERING SYSTEM
     ========================================================================== */
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuRows = document.querySelectorAll('.menu-item-row');

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      menuRows.forEach(row => {
        const itemCat = row.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          row.style.display = 'flex';
          row.style.opacity = '0';
          row.style.transform = 'translateY(15px)';
          setTimeout(() => {
            row.style.transition = 'all 0.35s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, 30);
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. SHOPPING CART / ORDER DRAWER ENGINE
     ========================================================================== */
  let cart = [];
  const cartTrigger = document.getElementById('cartTrigger');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartBadge = document.getElementById('cartBadge');
  const cartDrawerSub = document.getElementById('cartDrawerSub');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('open');
  }

  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  document.querySelectorAll('.close-cart-link').forEach(link => {
    link.addEventListener('click', closeCart);
  });

  function addToCart(title, price, image = '') {
    const existing = cart.find(item => item.title === title);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        title,
        price: parseFloat(price),
        image: image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=85',
        quantity: 1
      });
    }
    renderCart();
    showToast(`Added "${title}" to your order bag!`);

    // Trigger badge pulse
    if (cartBadge) {
      cartBadge.classList.add('pulse');
      setTimeout(() => cartBadge.classList.remove('pulse'), 350);
    }
  }

  function changeQuantity(title, delta) {
    const item = cart.find(i => i.title === title);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.title !== title);
    }
    renderCart();
  }

  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartBadge) cartBadge.textContent = totalItems;
    if (cartDrawerSub) cartDrawerSub.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'} selected`;
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <span class="empty-icon">☕</span>
          <h4>Your bag is currently empty</h4>
          <p>Explore our menu and click "+" on any specialty coffee, pasticceria or whole bean bag to begin.</p>
          <a href="#menu" class="btn btn-gold btn-sm magnetic-btn close-cart-link">Explore Menu</a>
        </div>
      `;
      cartItemsContainer.querySelectorAll('.close-cart-link').forEach(l => l.addEventListener('click', closeCart));
      return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-card">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="decrease" data-title="${item.title}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-title="${item.title}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-action="remove" data-title="${item.title}" title="Remove">&times;</button>
      </div>
    `).join('');

    // Attach listeners
    cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const action = btn.getAttribute('data-action');
        changeQuantity(title, action === 'increase' ? 1 : -1);
      });
    });

    cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        cart = cart.filter(i => i.title !== title);
        renderCart();
      });
    });
  }

  // Quick add buttons on menu rows
  document.querySelectorAll('.menu-item-row .quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.menu-item-row');
      const title = parent.getAttribute('data-title');
      const price = parent.getAttribute('data-price');
      const image = parent.getAttribute('data-image');
      addToCart(title, price, image);
    });
  });

  // Clicking anywhere on menu row opens side cart after adding
  document.querySelectorAll('.interactive-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.quick-add-btn')) return;
      const title = item.getAttribute('data-title');
      const price = item.getAttribute('data-price');
      const image = item.getAttribute('data-image');
      addToCart(title, price, image);
      openCart();
    });
  });

  // Roast Whole Bean Bag button
  if (orderRoastBtn) {
    orderRoastBtn.addEventListener('click', () => {
      const name = orderRoastBtn.getAttribute('data-name');
      const price = orderRoastBtn.getAttribute('data-price');
      const img = orderRoastBtn.getAttribute('data-img');
      addToCart(name, price, img);
      openCart();
    });
  }

  // Checkout Button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast("Your bag is empty. Please select coffee or dolci first.");
        return;
      }
      closeCart();
      showConfirmationModal(
        "Grazie Mille! Your Order is Placed",
        "Your artisanal order is being freshly prepared by our Milan baristas and pasticcieri.",
        `Items: ${cart.map(i => `${i.quantity}x ${i.title}`).join(', ')}<br><strong>Total: ${cartSubtotal.textContent}</strong>`
      );
      cart = [];
      renderCart();
    });
  }

  /* ==========================================================================
     8. TABLE RESERVATIONS & BOOKING SYSTEM
     ========================================================================== */
  const reservationForm = document.getElementById('reservationForm');
  const resDateInput = document.getElementById('resDate');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  let selectedTimeSlot = "08:30 AM";

  // Default date to tomorrow
  if (resDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    resDateInput.value = tomorrow.toISOString().split('T')[0];
    resDateInput.min = new Date().toISOString().split('T')[0];
  }

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeSlot = btn.textContent.trim();
    });
  });

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const expSelect = document.getElementById('resExperience');
      const expName = expSelect.options[expSelect.selectedIndex].text;
      const name = document.getElementById('resName').value;
      const date = document.getElementById('resDate').value;
      const guests = document.getElementById('resGuests').value;

      showConfirmationModal(
        "Perfetto! Your Table is Reserved",
        `Benvenuto ${name}. We look forward to hosting you at our Brera flagship.`,
        `<strong>Experience:</strong> ${expName}<br><strong>Date:</strong> ${date} at ${selectedTimeSlot}<br><strong>Party Size:</strong> ${guests} Guest(s)<br><strong>Location:</strong> Via Montenapoleone 18, Milano`
      );

      reservationForm.reset();
      if (resDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        resDateInput.value = tomorrow.toISOString().split('T')[0];
      }
    });
  }

  /* ==========================================================================
     9. CONFIRMATION MODAL & TOAST SYSTEM
     ========================================================================== */
  const confirmModalOverlay = document.getElementById('confirmModalOverlay');
  const closeConfirmModal = document.getElementById('closeConfirmModal');
  const modalOkBtn = document.getElementById('modalOkBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalDetailsBox = document.getElementById('modalDetailsBox');

  function showConfirmationModal(title, message, detailsHtml = '') {
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.textContent = message;
    if (modalDetailsBox) {
      modalDetailsBox.innerHTML = detailsHtml;
      modalDetailsBox.style.display = detailsHtml ? 'block' : 'none';
    }
    if (confirmModalOverlay) confirmModalOverlay.classList.add('open');
  }

  function hideConfirmationModal() {
    if (confirmModalOverlay) confirmModalOverlay.classList.remove('open');
  }

  if (closeConfirmModal) closeConfirmModal.addEventListener('click', hideConfirmationModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', hideConfirmationModal);
  if (confirmModalOverlay) {
    confirmModalOverlay.addEventListener('click', (e) => {
      if (e.target === confirmModalOverlay) hideConfirmationModal();
    });
  }

  // Toast Function
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3500);
  }

  // Open reservation modal trigger links
  document.querySelectorAll('.open-reserve-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const resSection = document.getElementById('reservation');
      if (resSection) {
        resSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('resName');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  });

  /* ==========================================================================
     10. REVIEWS & TESTIMONIALS SLIDER
     ========================================================================== */
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewDots = document.querySelectorAll('.review-dot');
  let currentReview = 0;

  function showReview(index) {
    reviewCards.forEach((c, i) => c.classList.toggle('active', i === index));
    reviewDots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentReview = index;
  }

  reviewDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-target-review'), 10);
      showReview(target);
    });
  });

  setInterval(() => {
    showReview((currentReview + 1) % reviewCards.length);
  }, 6500);

  /* ==========================================================================
     11. SCROLL REVEAL & ANIMATED METRICS COUNTERS
     ========================================================================== */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-from-left, .reveal-from-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Metrics counter animation
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const metricsGrid = document.getElementById('metricsGrid');
  if (metricsGrid) counterObserver.observe(metricsGrid);

  // Sticky navbar shadow and shrink on scroll
  const mainHeader = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     12. AMBIENT CAFE SOUNDSCAPE (Synthetic Web Audio API)
     ========================================================================== */
  const soundToggle = document.getElementById('soundToggle');
  let audioCtx = null;
  let isPlayingSound = false;
  let soundNodes = [];

  function createAmbientCafeSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Warm vinyl hum & gentle pink noise generator
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noiseSource.start(0);
      soundNodes.push(noiseSource, gain);
      isPlayingSound = true;
      if (soundToggle) soundToggle.classList.add('playing');
      showToast("Café Milano ambiance audio active ☕🎶");
    } catch (err) {
      console.warn("AudioContext init error:", err);
    }
  }

  function stopAmbientSound() {
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close();
      audioCtx = null;
    }
    soundNodes = [];
    isPlayingSound = false;
    if (soundToggle) soundToggle.classList.remove('playing');
    showToast("Café ambiance muted");
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!isPlayingSound) {
        createAmbientCafeSound();
      } else {
        stopAmbientSound();
      }
    });
  }

  /* ==========================================================================
     13. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.classList.toggle('active', !isOpen);
      mobileDrawer.classList.toggle('open', !isOpen);
    });

    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     14. NEWSLETTER & PDF DOWNLOAD TRIGGERS
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Grazie! You've joined the Milanese Journal circle.");
      newsletterForm.reset();
    });
  }

  const downloadMenuBtn = document.getElementById('downloadMenuBtn');
  if (downloadMenuBtn) {
    downloadMenuBtn.addEventListener('click', () => {
      showToast("Downloading Caffè Italiano Tasting Menu (PDF)...");
    });
  }

});
