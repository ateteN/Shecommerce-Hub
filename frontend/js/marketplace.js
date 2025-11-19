import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");
const selectedCategory = localStorage.getItem("selectedCategory");

const mockProducts = [
  { id: "mock_m1", name: "Wireless Headphones", price: 39.99, image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc", category: "technology", isSale: true, discount: 20 },
  { id: "mock_m2", name: "Sports Sneakers", price: 59.99, image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000", category: "sports", isSale: true, discount: 50 },
  { id: "mock_m3", name: "Smart Watch", price: 29.99, image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg", category: "technology", isSale: true, discount: 15 },
  { id: "mock_m4", name: "Makeup Kit", price: 19.99, image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg", category: "beauty", isSale: false, discount: 0 },

  // Technology
  { id: "mock_m5", name: "Google Pixel 9a", price: 499.99, image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1698079944-google-pixel-tablet-with-charging-speaker-dock-6536a4c21d199.jpg?crop=1xw:1xh;center,top&resize=980:*", category: "technology", isSale: false, discount: 0 },

  // Jewelry
  { id: "mock_m6", name: "Gold & Silver Earrings", price: 79.99, image: "https://media.gq-magazine.co.uk/photos/67a3758b2f73e97c9700040d/3:4/w_748%2Cc_limit/Best-women%25E2%2580%2599s-jewellery-brands-chosen-by-Jessie-Atkinson-Stories.jpg", category: "jewelry", isSale: true, discount: 50 },
  { id: "mock_m7", name: "Gemstone Bracelets", price: 59.99, image: "https://static01.nyt.com/images/2024/01/31/multimedia/31sp-jewelry-women-inyt-01-lctk/31sp-jewelry-women-inyt-01-lctk-articleLarge.jpg?quality=75&auto=webp&disable=upscale", category: "jewelry", isSale: true, discount: 50 },

  // Beauty
  { id: "mock_m8", name: "Waterproof Fenty Foundation", price: 35.99, image: "https://sc04.alicdn.com/kf/Hee7af5da455c4fe2a49507b904e8c95a2.jpg_250x250.jpg", category: "beauty", isSale: false, discount: 0 },

  // Sports
  { id: "mock_m9", name: "Workout Resistance Bands", price: 19.99, image: "https://strausssport.com/cdn/shop/files/71on1qvfF1L.jpg?v=1738741069", category: "sports", isSale: true, discount: 50 },
  { id: "mock_m10", name: "Black Jumping Rope", price: 14.99, image: "https://m.media-amazon.com/images/I/617-FZtUqUL.jpg", category: "sports", isSale: true, discount: 10 },

  // Others
  { id: "mock_m11", name: "Large Expandable Suitcase", price: 129.99, image: "https://www.americantourister.com.au/dw/image/v2/AAWQ_PRD/on/demandware.static/-/Sites-American-Tourister/default/dw847738b5/images/light-max-spinner/hi-res/148200_1627_hi-res_FRONT34_1.JPG?sw=500&sh=750", category: "others", isSale: false, discount: 0 },
];


// --- CREATE PRODUCT CARD ---
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
    ...backendProducts.map(p => ({ ...p, id: p._id })), // backend IDs
    ...mockProducts                                  // mock IDs prefixed
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

  filtered.forEach(p => grid.appendChild(renderProductCard(p)));
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
