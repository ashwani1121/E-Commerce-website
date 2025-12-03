// ----- Product Data -----
    const products = [
      {
        id: 1,
        name: "Wireless Noise-Cancelling Headphones",
        category: "electronics",
        price: 129,
        rating: 4.7,
        image: "https://picsum.photos/seed/headphones/400/300",
        badge: "Best Seller",
        stock: "In stock"
      },
      {
        id: 2,
        name: "Mechanical RGB Gaming Keyboard",
        category: "gaming",
        price: 89,
        rating: 4.5,
        image: "https://picsum.photos/seed/keyboard/400/300",
        badge: "Trending",
        stock: "In stock"
      },
      {
        id: 3,
        name: "Minimalist Analog Wrist Watch",
        category: "fashion",
        price: 59,
        rating: 4.3,
        image: "https://picsum.photos/seed/watch/400/300",
        badge: "New",
        stock: "Few left"
      },
      {
        id: 4,
        name: "Smart LED Desk Lamp",
        category: "home",
        price: 45,
        rating: 4.2,
        image: "https://picsum.photos/seed/lamp/400/300",
        badge: "Popular",
        stock: "In stock"
      },
      {
        id: 5,
        name: "Ergonomic Office Chair",
        category: "home",
        price: 210,
        rating: 4.8,
        image: "https://picsum.photos/seed/chair/400/300",
        badge: "Premium",
        stock: "In stock"
      },
      {
        id: 6,
        name: "Classic White Sneakers",
        category: "fashion",
        price: 74,
        rating: 4.4,
        image: "https://picsum.photos/seed/shoes/400/300",
        badge: "Best Seller",
        stock: "In stock"
      },
      {
        id: 7,
        name: "4K Ultra HD Monitor 27\"",
        category: "electronics",
        price: 279,
        rating: 4.6,
        image: "https://picsum.photos/seed/monitor/400/300",
        badge: "Pro",
        stock: "Few left"
      },
      {
        id: 8,
        name: "Wireless Gaming Mouse",
        category: "gaming",
        price: 39,
        rating: 4.1,
        image: "https://picsum.photos/seed/mouse/400/300",
        badge: "Deal",
        stock: "In stock"
      }
    ];

    // ----- State -----
    let currentFilters = {
      category: "all",
      maxPrice: 300,
      search: "",
      sort: "default"
    };

    let cart = []; // {id, quantity}

    // ----- DOM Elements -----
    const productGrid = document.getElementById("productGrid");
    const productsSubtitle = document.getElementById("productsSubtitle");
    const searchInput = document.getElementById("searchInput");
    const priceRange = document.getElementById("priceRange");
    const priceRangeValue = document.getElementById("priceRangeValue");
    const sortSelect = document.getElementById("sortSelect");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const cartCloseBtn = document.getElementById("cartCloseBtn");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartBackdrop = document.getElementById("cartBackdrop");
    const cartItemsEl = document.getElementById("cartItems");
    const cartCountEl = document.getElementById("cartCount");
    const cartSubtotalEl = document.getElementById("cartSubtotal");
    const cartTotalEl = document.getElementById("cartTotal");
    const cartSubtitleEl = document.getElementById("cartSubtitle");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // ----- Utility Functions -----
    function formatPrice(value) {
      return "$" + value.toFixed(2);
    }

    function getFilteredProducts() {
      let filtered = [...products];

      // Category filter
      if (currentFilters.category !== "all") {
        filtered = filtered.filter(
          (p) => p.category === currentFilters.category
        );
      }

      // Max price filter
      filtered = filtered.filter((p) => p.price <= currentFilters.maxPrice);

      // Search
      if (currentFilters.search.trim() !== "") {
        const term = currentFilters.search.toLowerCase();
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(term)
        );
      }

      // Sort
      switch (currentFilters.sort) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating-desc":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
        // leave as is
      }

      return filtered;
    }

    function renderProducts() {
      const filtered = getFilteredProducts();
      productGrid.innerHTML = "";

      if (filtered.length === 0) {
        productGrid.innerHTML =
          "<p>No products found. Try adjusting your filters.</p>";
        productsSubtitle.textContent = "No products match your filters.";
        return;
      }

      productsSubtitle.textContent = `Showing ${filtered.length} product${
        filtered.length !== 1 ? "s" : ""
      }`;

      filtered.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
          <div class="product-badge">${product.badge}</div>
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-image"
          />
          <div class="product-title">${product.name}</div>
          <div class="product-category">${product.category}</div>
          <div class="product-meta">
            <div class="product-price">${formatPrice(
              product.price
            )} <span>USD</span></div>
            <div class="product-rating">★ ${product.rating}</div>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary" data-add-to-cart="${product.id}">
              <span>+ Add to cart</span>
            </button>
            <div class="stock">${product.stock}</div>
          </div>
        `;
        productGrid.appendChild(card);
      });

      // Add event listeners for buttons
      document
        .querySelectorAll("[data-add-to-cart]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-add-to-cart"), 10);
            addToCart(id);
          });
        });
    }

    function openCart() {
      cartDrawer.classList.add("open");
      cartBackdrop.classList.add("open");
    }

    function closeCart() {
      cartDrawer.classList.remove("open");
      cartBackdrop.classList.remove("open");
    }

    function addToCart(productId) {
      const item = cart.find((c) => c.id === productId);
      if (item) {
        item.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }
      updateCartUI();
      openCart();
    }

    function updateCartUI() {
      cartItemsEl.innerHTML = "";
      if (cart.length === 0) {
        cartItemsEl.innerHTML =
          '<div class="cart-empty">Your cart is empty. Start shopping!</div>';
        cartSubtitleEl.textContent = "No items added yet.";
        cartCountEl.textContent = "0";
        cartSubtotalEl.textContent = "$0.00";
        cartTotalEl.textContent = "$0.00";
        return;
      }

      let subtotal = 0;
      let totalCount = 0;

      cart.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (!product) return;
        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;
        totalCount += cartItem.quantity;

        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <div class="cart-item-title">${product.name}</div>
            <div class="cart-item-meta">${product.category}</div>
            <div class="cart-item-price">${formatPrice(itemTotal)}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn" data-decrease="${product.id}">−</button>
              <span>${cartItem.quantity}</span>
              <button class="qty-btn" data-increase="${product.id}">+</button>
            </div>
            <button class="remove-btn" data-remove="${product.id}">Remove</button>
          </div>
        `;
        cartItemsEl.appendChild(el);
      });

      cartSubtitleEl.textContent = `${totalCount} item${
        totalCount !== 1 ? "s" : ""
      } in your cart.`;
      cartCountEl.textContent = String(totalCount);
      cartSubtotalEl.textContent = formatPrice(subtotal);
      cartTotalEl.textContent = formatPrice(subtotal); // shipping free here

      // Attach qty / remove events
      cartItemsEl.querySelectorAll("[data-increase]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-increase"), 10);
          const item = cart.find((c) => c.id === id);
          if (item) item.quantity += 1;
          updateCartUI();
        });
      });

      cartItemsEl.querySelectorAll("[data-decrease]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-decrease"), 10);
          const item = cart.find((c) => c.id === id);
          if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
              cart = cart.filter((c) => c.id !== id);
            }
          }
          updateCartUI();
        });
      });

      cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-remove"), 10);
          cart = cart.filter((c) => c.id !== id);
          updateCartUI();
        });
      });
    }

    // ----- Event Listeners -----
    // Category change
    document.querySelectorAll('input[name="category"]').forEach((input) => {
      input.addEventListener("change", () => {
        currentFilters.category = input.value;
        renderProducts();
      });
    });

    // Search
    searchInput.addEventListener("input", () => {
      currentFilters.search = searchInput.value;
      renderProducts();
    });

    // Price range
    priceRange.addEventListener("input", () => {
      const value = parseInt(priceRange.value, 10);
      currentFilters.maxPrice = value;
      priceRangeValue.textContent = "$" + value;
      renderProducts();
    });

    // Sort
    sortSelect.addEventListener("change", () => {
      currentFilters.sort = sortSelect.value;
      renderProducts();
    });

    // Clear filters
    clearFiltersBtn.addEventListener("click", () => {
      currentFilters = {
        category: "all",
        maxPrice: 300,
        search: "",
        sort: "default"
      };
      // reset UI controls
      document.querySelector('input[name="category"][value="all"]').checked = true;
      priceRange.value = "300";
      priceRangeValue.textContent = "$300";
      searchInput.value = "";
      sortSelect.value = "default";
      renderProducts();
    });

    // Cart toggle
    cartToggleBtn.addEventListener("click", openCart);
    cartCloseBtn.addEventListener("click", closeCart);
    cartBackdrop.addEventListener("click", closeCart);

    // Checkout
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      alert("This is a demo checkout. In a real app, redirect to payment.");
    });

    // ----- Init -----
    renderProducts();
    updateCartUI();