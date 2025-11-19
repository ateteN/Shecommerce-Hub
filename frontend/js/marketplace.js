import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");

// --- SELECTED CATEGORY FROM LOCALSTORAGE ---
const selectedCategory = localStorage.getItem("selectedCategory");

// --- MOCK PRODUCTS WITH CATEGORY AND SALE EXAMPLES ---
const mockProducts = [
  { id: "m1", name: "Wireless Headphones", price: 39.99, image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc", category: "technology", isSale: true, discount: 20 },
  { id: "m2", name: "Sports Sneakers", price: 59.99, image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000", category: "sports", isSale: false, discount: 0 },
  { id: "m3", name: "Smart Watch", price: 29.99, image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg", category: "technology", isSale: true, discount: 15 },
  { id: "m4", name: "Makeup Kit", price: 19.99, image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg", category: "beauty", isSale: false, discount: 0 }
];

// --- HELPER: CREATE PRODUCT CARD ---
function renderProductCard(product) {
  let saleTag = '';
  let priceHTML = `<p class="price">$${parseFloat(product.price).toFixed(2)}</p>`;

  if (product.isSale && product.discount) {
    const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
    saleTag = `<div class="sale-tag">SALE -${product.discount}%</div>`;
    priceHTML = `
      <p class="price">
        <span class="original-price" style="text-decoration: line-through; color: #888;">$${parseFloat(product.price).toFixed(2)}</span>
        <span class="discounted-price">$${discountedPrice}</span>
      </p>
    `;
  }

  const categoryTag = product.category ? `<p class="category-tag">${product.category.toUpperCase()}</p>` : '';

  const card = document.createElement('div');
  card.classList.add('product-card');
  card.innerHTML = `
    ${saleTag}
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    ${priceHTML}
    ${categoryTag}
    <a href="product.html?id=${product.id || product._id}" class="view-product-btn">View Product</a>
  `;
  return card;
}

// --- RENDER PRODUCTS ---
async function renderProducts() {
  let backendProducts = [];

  try {
    backendProducts = await getProducts();
  } catch (err) {
    console.error("Failed to fetch backend products:", err);
  }

  const combined = [
    ...backendProducts.map(p => ({ ...p, id: p._id })),
    ...mockProducts
  ];

  let filtered = combined;
  if (selectedCategory) {
    filtered = combined.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<p>No products found in this category.</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = renderProductCard(p);
    grid.appendChild(card);
  });
}

// --- INITIAL RENDER ---
renderProducts();

// --- BANNER LOGIC ---
const track = document.querySelector(".carousel-track");
const dots = document.querySelectorAll(".carousel-dots .dot");
let index = 0;

function showSlide(i) {
  index = i;
  track.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach(dot => dot.classList.remove("active"));
  dots[i].classList.add("active");
}

setInterval(() => {
  index = (index + 1) % dots.length;
  showSlide(index);
}, 3000);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => showSlide(i));
});
