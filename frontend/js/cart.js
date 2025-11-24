import { getProducts } from "./api.js"; 

document.addEventListener("DOMContentLoaded", async () => {
  const cartGrid = document.getElementById("cart-grid");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Fetch Products from the Backend
  let products = [];
  try {
    products = await getProducts();
  } catch (err) {
    console.error("Failed to fetch backend products:", err);
  }

  // MOCK PRODUCTS 
  const mockProducts = [
    { 
      id: "m1", 
      name: "Wireless Headphones", 
      price: 39.99, 
      image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc",
      category: "technology",
      isSale: true,
      discount: 20
    },
    { 
      id: "m2", 
      name: "Sports Sneakers", 
      price: 59.99, 
      image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000",
      category: "sports",
      isSale: false,
      discount: 0
    },
    { 
      id: "m3", 
      name: "Smart Watch", 
      price: 29.99, 
      image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg",
      category: "technology",
      isSale: true,
      discount: 15
    },
    { 
      id: "m4", 
      name: "Makeup Kit", 
      price: 19.99, 
      image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg",
      category: "beauty",
      isSale: false,
      discount: 0
    }
  ];

  // backend + mock
  const allProducts = [
    ...products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      isSale: p.isSale || false,
      discount: p.discount || 0
    })),
    ...mockProducts.map(p => ({
      id: p.id,               
      name: p.name,
      price: p.price,
      image: p.image,
      isSale: p.isSale,
      discount: p.discount
    }))
  ];

  // === RENDER CART ===
  function renderCart() {
    cartGrid.innerHTML = "";

    if (cart.length === 0) {
      cartGrid.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalEl.textContent = "0.00";
      return;
    }

    let total = 0;

    cart.forEach(item => {
      const latest = allProducts.find(p => p.id === item.id);

      let originalPrice = latest?.price || item.price;
      let isSale = latest?.isSale || false;
      let discount = latest?.discount || 0;

      let price = isSale
        ? (originalPrice * (1 - discount / 100))
        : originalPrice;

      const itemTotal = price * item.quantity;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "cart-item";

      const priceHTML = isSale
        ? `<span class="original-price" style="text-decoration: line-through;">$${originalPrice.toFixed(2)}</span>
           <span class="discounted-price">$${price.toFixed(2)}</span>`
        : `$${price.toFixed(2)}`;

      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>${priceHTML}</p>
        <div>
          <button class="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
          <button class="remove" data-id="${item.id}">Remove</button>
        </div>
      `;

      cartGrid.appendChild(div);
    });

    cartTotalEl.textContent = total.toFixed(2);

    // Quantity buttons
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, 1));
    });
    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, -1));
    });

    // Remove button
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        cart = cart.filter(i => i.id !== btn.dataset.id);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    // Save cart 
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return alert("Cart is empty!");
    localStorage.setItem("checkoutTotal", cartTotalEl.textContent);
    window.location.href = "https://sandbox.flutterwave.com/pay/shecommercepayment";
  });

  renderCart();
});
