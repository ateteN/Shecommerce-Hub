import { getProducts } from "./api.js"; // Your existing API helper

document.addEventListener("DOMContentLoaded", async () => {
  const cartGrid = document.getElementById("cart-grid");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // --- FETCH LATEST PRODUCTS ---
  let products = [];
  try {
    products = await getProducts(); // backend products
  } catch (err) {
    console.error("Failed to fetch backend products:", err);
  }

  // Mock products (same as marketplace.js)
  const mockProducts = [
    { id: "m1", name: "Wireless Headphones", price: 39.99, image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc", category: "technology" },
    { id: "m2", name: "Sports Sneakers", price: 59.99, image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000", category: "sports" },
    { id: "m3", name: "Smart Watch", price: 29.99, image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg", category: "technology" },
    { id: "m4", name: "Makeup Kit", price: 19.99, image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg", category: "beauty" }
  ];

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
      id: `mock_${p.id}`,
      name: p.name,
      price: p.price,
      image: p.image,
      isSale: p.isSale || false,
      discount: p.discount || 0
    }))
  ];

  function renderCart() {
    cartGrid.innerHTML = "";

    if (cart.length === 0) {
      cartGrid.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalEl.textContent = "0.00";
      return;
    }

    let total = 0;

    cart.forEach(item => {
      // Sync with latest product info
      const latest = allProducts.find(p => p.id === item.id);
      let price = item.price;
      let originalPrice = item.price;
      let isSale = false;
      let discount = 0;

      if (latest) {
        originalPrice = latest.price;
        isSale = latest.isSale;
        discount = latest.discount;
        price = isSale ? (originalPrice * (1 - discount / 100)) : originalPrice;
      }

      const itemTotal = price * item.quantity;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "cart-item";

      const priceHTML = isSale ? `<span class="original-price">$${originalPrice.toFixed(2)}</span> $${price.toFixed(2)}` : `$${price.toFixed(2)}`;

      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>${priceHTML}</p>
        <div>
          <button class="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
      `;

      cartGrid.appendChild(div);
    });

    cartTotalEl.textContent = total.toFixed(2);

    // Attach + / - buttons
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, 1));
    });
    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, -1));
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) return alert("Cart is empty!");
    alert(`Checking out $${cartTotalEl.textContent}`);
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  });

  renderCart();
});
