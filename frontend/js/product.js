import { getProducts } from "./api.js"; // Use your existing API helper

const container = document.getElementById("product-detail");

// Get the product ID from the URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function renderProduct() {
  let products = [];
  try {
    products = await getProducts(); // Fetch all products from backend
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  const product = products.find(p => p._id === productId || p.id === productId);

  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // Calculate sale price
  let priceHTML = `$${product.price.toFixed(2)}`;
  if (product.isSale && product.discount) {
    const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
    priceHTML = `<span class="original-price">$${product.price.toFixed(2)}</span> $${discountedPrice}`;
  }

  container.innerHTML = `
    <div class="product-detail-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.description || "No description available"}</p>
        <p class="price">${priceHTML}</p>
        <div class="quantity-control">
          <button id="decrease-qty">-</button>
          <input type="number" id="product-qty" value="1" min="1" />
          <button id="increase-qty">+</button>
        </div>
        <button id="add-to-cart-btn" class="view-product-btn">Add to Cart</button>
      </div>
    </div>
  `;

  // Quantity buttons
  const qtyInput = document.getElementById("product-qty");
  document.getElementById("increase-qty").addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });
  document.getElementById("decrease-qty").addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
  });

  // Add to cart functionality
  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const quantity = parseInt(qtyInput.value);
    let finalPrice = product.price;
    if (product.isSale && product.discount) finalPrice = product.price * (1 - product.discount / 100);

    const cartItem = {
  id: product._id ? product._id : `mock_${product.id}`, // ensure unique
  name: product.name,
  price: finalPrice,
  originalPrice: product.price,
  image: product.image,
  quantity: quantity,
  isSale: product.isSale || false,
  discount: product.discount || 0
};


    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === cartItem.id);
    if (existing) existing.quantity += quantity;
    else cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${cartItem.name} (${quantity}) added to cart!`);
  });
}

renderProduct();
