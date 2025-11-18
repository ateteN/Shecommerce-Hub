import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");

// --- EXTRA MOCK PRODUCTS ---
const mockProducts = [
  {
    id: "m1",
    name: "Wireless Headphones",
    price: 39.99,
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc"
  },
  {
    id: "m2",
    name: "Sports Sneakers",
    price: 59.99,
    image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000"
  },
  {
    id: "m3",
    name: "Smart Watch",
    price: 29.99,
    image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg"
  },
  {
    id: "m4",
    name: "Makeup Kit",
    price: 19.99,
    image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg"
  }
  
];

async function renderProducts() {
  let backendProducts = [];

  // GET BACKEND PRODUCTS
  try {
    backendProducts = await getProducts();
  } catch (err) {
    console.error("Failed to fetch backend products:", err);
  }

  // --- COMBINE BACKEND + MOCK ---
  const combined = [
    ...backendProducts.map(p => ({
      id: p._id,       // backend uses _id, convert to id
      name: p.name,
      price: p.price,
      image: p.image
    })),
    ...mockProducts
  ];

  // --- RENDER ALL PRODUCTS ---
  grid.innerHTML = combined.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <a href="product.html?id=${p.id}" class="view-product-btn">View Product</a>
    </div>
  `).join('');
}

renderProducts();


// BANNER

const track = document.querySelector(".carousel-track");
const dots = document.querySelectorAll(".carousel-dots .dot");
let index = 0;

function showSlide(i) {
  index = i;
  track.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach(dot => dot.classList.remove("active"));
  dots[i].classList.add("active");
}

// Auto scroll every 4 seconds
setInterval(() => {
  index = (index + 1) % dots.length;
  showSlide(index);
}, 3000);

// Clickable dots
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => showSlide(i));
});

