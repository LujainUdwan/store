// Header
document.body.insertAdjacentHTML('afterbegin', `
<section id="header">
    <a href="index.html"><img src="img/logo.png" class="logo" alt=""></a>
    <div>
        <ul id="navbar">
            <li><a href="index.html">Home</a></li>
            <li><a href="Shop.html">Shop</a></li>
            <li><a href="Contact.html">Contact</a></li>
            <li id="lg-bag"><a href="cart.html"><i class="fa-solid fa-cart-shopping"></i></a></li>
        </ul>
    </div>
    <div id="mobile">
        <a href="cart.html"><i class="fa-solid fa-cart-shopping"></i></a>
        <i id="bar" class="fas fa-outdent"></i>
    </div>
</section>
`);

// Footer
document.body.insertAdjacentHTML('beforeend', `
<footer class="section-p1">
    <div class="col">
        <img src="img/logo.png" alt="">
        <h4>Contact</h4>
        <p><strong>Address:</strong> 343 Amman, Street 10</p>
        <p><strong>Hours:</strong> 11:00 - 22:00, Sunday - Thursday</p>
        <div class="follow">
            <h4>Follow Us</h4>
            <div class="icon">
                <i class="fab fa-facebook-f"></i>
                <i class="fab fa-twitter"></i>
                <i class="fab fa-instagram"></i>
                <i class="fab fa-pinterest-p"></i>
                <i class="fab fa-youtube"></i>
            </div>
        </div>
    </div>
    <div class="col">
        <h4>About</h4>
        <a href="#">About Us</a>
        <a href="#">Delivery Information</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
        <a href="#">Contact Us</a>
    </div>
    <div class="col">
        <h4>My Account</h4>
        <a href="#">Sign In</a>
        <a href="#">View Cart</a>
        <a href="#">My Wishlist</a>
        <a href="#">Track My Order</a>
        <a href="#">Help</a>
    </div>
    <div class="col install">
        <h4>Install App</h4>
        <p>From App Store or Google Play</p>
        <div class="row">
            <a href="#"><i class="fab fa-apple"></i> App Store</a>
            <a href="#"><i class="fab fa-google-play"></i> Google Play</a>
        </div>
        <p>Secured Payment Gateways</p>
        <div class="pay-icons">
            <i class="fab fa-cc-visa"></i>
            <i class="fab fa-cc-mastercard"></i>
            <i class="fab fa-cc-amex"></i>
            <i class="fab fa-cc-paypal"></i>
        </div>
    </div>
</footer>
<div id="copyright">
    <p>© 2024, Your Store - All Rights Reserved</p>
</div>
`);

const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');

if (bar) {
  bar.addEventListener('click', () => nav.classList.add('active'));
}
document.addEventListener('click', (e) => {
  if (nav && !nav.contains(e.target) && e.target !== bar) {
    nav.classList.remove('active');
  }
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIcon();
}

function updateCartIcon() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll('.fa-cart-shopping, .fa-shopping-cart').forEach(icon => {
    const parent = icon.closest('a');
    if (!parent) return;

    if (parent.closest('#lg-bag') || parent.closest('#mobile')) {
      let badge = parent.querySelector('.cart-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.classList.add('cart-badge');
        parent.appendChild(badge);
      }
      badge.textContent = totalItems;
      badge.style.display = totalItems === 0 ? 'none' : 'flex';
    }
  });
}

document.querySelectorAll('.pro > a').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const pro = button.closest('.pro');
    const name = pro.querySelector('.des h5')?.textContent.trim() || 'Product';
    const priceText = pro.querySelector('.des h4')?.textContent.trim() || '0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const img = pro.querySelector('img')?.src || '';
    const id = name + '_' + price;

    let cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, img, qty: 1 });
    }

    saveCart(cart);

    const icon = button.querySelector('i');
    if (icon) {
      icon.style.color = '#088178';
      setTimeout(() => icon.style.color = '', 800);
    }
  });
});

document.querySelectorAll('.pro').forEach(pro => {
  pro.addEventListener('click', () => {
    const name = pro.querySelector('.des h5')?.textContent.trim();
    const price = pro.querySelector('.des h4')?.textContent.trim();
    const img = pro.querySelector('img')?.src;

    localStorage.setItem('selectedProduct', JSON.stringify({ name, price, img }));
    window.location.href = 'product.html';
  });
});

const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
if (selectedProduct && document.getElementById('MainImg')) {
  document.getElementById('MainImg').src = selectedProduct.img;
  document.querySelector('.single-pro-details h4').textContent = selectedProduct.name;
  document.querySelector('.single-pro-details h2').textContent = selectedProduct.price;
}

const addToCartBtn = document.querySelector('.single-pro-details button');

if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const name = document.querySelector('.single-pro-details h4')?.textContent.trim() || 'Product';
    const priceText = document.querySelector('.single-pro-details h2')?.textContent.trim() || '0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const img = document.getElementById('MainImg')?.src || '';
    const qty = parseInt(document.querySelector('.single-pro-details input')?.value) || 1;
    const id = name + '_' + price;

    let cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, name, price, img, qty });
    }

    saveCart(cart);

    addToCartBtn.textContent = 'Added!';
    setTimeout(() => addToCartBtn.textContent = 'Add To Cart', 1000);
  });
}

function renderCart() {
  const tbody = document.querySelector('#cart tbody');
  if (!tbody) return;

  const cart = getCart();
  tbody.innerHTML = '';

  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:50px; color:#8b5e3c; font-size:15px;">
          Your cart is empty - <a href="Shop.html" style="color:#8b5e3c; font-weight:700;">Shop Now</a>
        </td>
      </tr>`;
    updateTotal();
    return;
  }

  cart.forEach((item, index) => {
    const subtotal = (item.price * item.qty).toFixed(2);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <a href="#" class="remove-btn" data-index="${index}">
          <i class="fa-regular fa-circle-xmark" style="font-size:20px; color:#8b5e3c;"></i>
        </a>
      </td>
      <td><img src="${item.img}" alt="${item.name}" style="width:70px; border-radius:8px; background:#f0ebe0;"></td>
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" class="qty-input" data-index="${index}"
          style="width:70px; padding:8px; border:1px solid #ddd0ba; border-radius:4px; background:#fdfaf4;">
      </td>
      <td>$${subtotal}</td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cart = getCart();
      cart.splice(parseInt(btn.dataset.index), 1);
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const newQty = parseInt(input.value);
      if (newQty < 1) {
        input.value = 1;
        return;
      }

      const cart = getCart();
      cart[parseInt(input.dataset.index)].qty = newQty;
      saveCart(cart);
      renderCart();
    });
  });

  updateTotal();
}

function updateTotal() {
  const totalEl = document.getElementById('cart-total');
  if (!totalEl) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = '$' + total.toFixed(2);
}

const subscribeBtn = document.getElementById('subscribeBtn');
const emailInput = document.getElementById('emailInput');
const emailMsg = document.getElementById('email-msg');

if (subscribeBtn) {
  subscribeBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailMsg.textContent = 'Please enter your email!';
      emailMsg.style.color = 'red';
    } else if (!emailRegex.test(email)) {
      emailMsg.textContent = 'Please enter a valid email!';
      emailMsg.style.color = 'red';
    } else {
      emailMsg.textContent = 'Subscribed successfully!';
      emailMsg.style.color = 'green';
      emailInput.value = '';
    }
  });
}

updateCartIcon();
renderCart();