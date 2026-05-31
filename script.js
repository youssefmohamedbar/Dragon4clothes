// ==========================
// LOCAL STORAGE
// ==========================

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ==========================
// ELEMENTS
// ==========================

const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");

const cartItems = document.getElementById("cartItems");
const wishlistItems = document.getElementById("wishlistItems");

const totalPrice = document.getElementById("totalPrice");

const cartSidebar = document.getElementById("cartSidebar");
const wishlistSidebar = document.getElementById("wishlistSidebar");

// ==========================
// INIT
// ==========================

updateBadges();
renderCart();
renderWishlist();

// ==========================
// PRODUCTS
// ==========================

document.querySelectorAll(".product-card").forEach((card) => {
  const name = card.querySelector("h3").innerText;

  const price = parseFloat(
    card.querySelector(".price").innerText.replace("$", ""),
  );

  const image = card.querySelector("img").src;

  card.querySelector(".cart-btn").addEventListener("click", () => {
    addToCart({
      name,
      price,
      image,
    });
  });

  card.querySelector(".wish-btn").addEventListener("click", () => {
    addToWishlist({
      name,
      price,
      image,
    });
  });
});

// ==========================
// CART
// ==========================

function addToCart(product) {
  const existing = cart.find((item) => item.name === product.name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  saveCart();
  renderCart();

  showToast(`${product.name} added to cart`);
}

function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartItems.innerHTML += `
    
    <div class="cart-item">

        <img src="${item.image}" 
             style="width:100%;border-radius:10px;margin-bottom:10px;">

        <h4>${item.name}</h4>

        <p>Price: $${item.price}</p>

        <p>Quantity: ${item.qty}</p>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">

            <button onclick="increaseQty(${index})">
                +
            </button>

            <button onclick="decreaseQty(${index})">
                -
            </button>

            <button onclick="removeCartItem(${index})">
                Remove
            </button>

        </div>

    </div>
    
    `;
  });

  totalPrice.textContent = "$" + total.toFixed(2);

  updateBadges();
}

function increaseQty(index) {
  cart[index].qty++;

  saveCart();
  renderCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);

  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ==========================
// WISHLIST
// ==========================

function addToWishlist(product) {
  const exists = wishlist.some((item) => item.name === product.name);

  if (!exists) {
    wishlist.push(product);

    saveWishlist();
    renderWishlist();

    showToast(`${product.name} added to wishlist`);
  }
}

function renderWishlist() {
  wishlistItems.innerHTML = "";

  wishlist.forEach((item, index) => {
    wishlistItems.innerHTML += `
    
    <div class="cart-item">

        <img src="${item.image}"
             style="width:100%;border-radius:10px;margin-bottom:10px;">

        <h4>${item.name}</h4>

        <p>$${item.price}</p>

        <button onclick="moveToCart(${index})">
            Add To Cart
        </button>

        <button onclick="removeWishlistItem(${index})">
            Remove
        </button>

    </div>
    
    `;
  });

  updateBadges();
}

function moveToCart(index) {
  addToCart(wishlist[index]);

  wishlist.splice(index, 1);

  saveWishlist();
  renderWishlist();
}

function removeWishlistItem(index) {
  wishlist.splice(index, 1);

  saveWishlist();
  renderWishlist();
}

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ==========================
// BADGES
// ==========================

function updateBadges() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  wishlistCount.textContent = wishlist.length;
}

// ==========================
// SIDEBARS
// ==========================

document.getElementById("cartBtn").addEventListener("click", () => {
  cartSidebar.classList.add("active");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartSidebar.classList.remove("active");
});

document.getElementById("wishlistBtn").addEventListener("click", () => {
  wishlistSidebar.classList.add("active");
});

document.getElementById("closeWishlist").addEventListener("click", () => {
  wishlistSidebar.classList.remove("active");
});

// ==========================
// SEARCH
// ==========================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach((card) => {
      const title = card.querySelector("h3").innerText.toLowerCase();

      if (title.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// ==========================
// MOBILE MENU
// ==========================

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const overlay = document.querySelector(".menu-overlay");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    overlay.classList.toggle("active");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    navLinks.classList.remove("active");

    overlay.classList.remove("active");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");

    overlay.classList.remove("active");
  });
});

// ==========================
// TOAST MESSAGE
// ==========================

function showToast(message) {
  const toast = document.createElement("div");

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";

  toast.style.background = "#111";
  toast.style.color = "#fff";

  toast.style.padding = "12px 20px";

  toast.style.borderRadius = "10px";

  toast.style.zIndex = "9999";

  toast.style.opacity = "0";

  toast.style.transition = "0.3s";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    toast.style.opacity = "0";

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
}

// ==========================
// CLEAR CART (OPTIONAL)
// ==========================

function clearCart() {
  cart.length = 0;

  saveCart();

  renderCart();
}

// ==========================
// CLEAR WISHLIST (OPTIONAL)
// ==========================

function clearWishlist() {
  wishlist.length = 0;

  saveWishlist();

  renderWishlist();
}
