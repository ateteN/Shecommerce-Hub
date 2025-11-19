import { getProducts } from "./api.js";

const container = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// --- MOCK PRODUCTS (same as marketplace.js) ---
const mockProducts = [
  { id: "mock_m1", name: "Wireless Headphones", price: 39.99, image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc", category: "technology", isSale: true, discount: 20 },
  { id: "mock_m2", name: "Sports Sneakers", price: 59.99, image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000", category: "sports", isSale: false, discount: 0,     description: "Comfortable and durable sneakers for running and everyday activities."
},
  { id: "mock_m3", name: "Smart Watch", price: 29.99, image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg", category: "technology", isSale: true, discount: 15 },
  { id: "mock_m4", name: "Makeup Kit", price: 19.99, image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg", category: "beauty", isSale: false, discount: 0 }
];


async function renderProduct() {
  let backendProducts = [];
  try { backendProducts = await getProducts(); } catch(e) { console.error(e); }

  const allProducts = [
    ...backendProducts.map(p => ({ ...p, id: p._id })),
    ...mockProducts
  ];

  const product = allProducts.find(p => p.id === productId);
  if (!product) { container.innerHTML = "<p>Product not found.</p>"; return; }

  const finalPrice = product.isSale ? product.price * (1 - (product.discount || 0)/100) : product.price;
  const priceHTML = product.isSale ? `<span class="original-price">$${product.price.toFixed(2)}</span> $${finalPrice.toFixed(2)}` : `$${finalPrice.toFixed(2)}`;

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

  const qtyInput = document.getElementById("product-qty");
  document.getElementById("increase-qty").addEventListener("click", () => qtyInput.value = parseInt(qtyInput.value) + 1);
  document.getElementById("decrease-qty").addEventListener("click", () => qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1));

  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const quantity = parseInt(qtyInput.value);
    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: product.price,
      quantity,
      isSale: product.isSale,
      discount: product.discount || 0,
      image: product.image
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
