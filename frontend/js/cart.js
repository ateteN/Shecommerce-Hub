document.addEventListener("DOMContentLoaded", () => {
  const cartGrid = document.getElementById("cart-grid");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartGrid.innerHTML = "";

    if(cart.length === 0){
      cartGrid.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalEl.textContent = "0.00";
      return;
    }

    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)}</p>
        <div>
          <button class="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
      `;
      cartGrid.appendChild(div);
    });

    cartTotalEl.textContent = total.toFixed(2);

    // attach + and - buttons
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, 1));
    });
    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => changeQty(btn.dataset.id, -1));
    });

    // Save updated cart
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
    // Optionally, clear cart after checkout
    cart = [];
    renderCart();
  });

  renderCart();
});
