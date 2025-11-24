import { getProducts } from "./api.js";

const container = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// --- MOCK PRODUCTS  ---
const mockProducts = [
  { 
    id: "mock_m1", 
    name: "Wireless Headphones", 
    price: 39.99, 
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=SmFOSTFzWmdkMW1XWjFUWXBDRzdBd2tuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T0huV2F0aExud1Z0YndiMUgwNXJZQnc", 
    category: "technology", 
    isSale: true, 
    discount: 20,
    description: "Experience high-quality sound with these wireless headphones. They provide deep bass and crisp treble for an immersive listening experience. Long battery life ensures uninterrupted use throughout the day. Sleek and comfortable design makes them perfect for travel or home use."
  },
  { 
    id: "mock_m2", 
    name: "Sports Sneakers", 
    price: 59.99, 
    image: "https://www.running-point.co.uk/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw899643dd/images/004/163/17270000_0_3.jpg?q=80&sw=2000", 
    category: "sports", 
    isSale: true, 
    discount: 50,
    description: "These sports sneakers are designed for comfort and performance. The breathable fabric keeps your feet cool during workouts. Cushioned soles absorb impact and reduce fatigue. Stylish design makes them suitable for both exercise and casual wear."
  },
  { 
    id: "mock_m3", 
    name: "Smart Watch", 
    price: 29.99, 
    image: "https://uribaba.co.in/wp-content/uploads/2023/07/SW-2865-12.jpg", 
    category: "technology", 
    isSale: true, 
    discount: 15,
    description: "Stay connected and track your health with this smart watch. It monitors heart rate, steps, and sleep patterns. Receive notifications from your phone directly on your wrist. Its sleek design makes it perfect for everyday wear."
  },
  { 
    id: "mock_m4", 
    name: "Makeup Kit", 
    price: 19.99, 
    image: "https://m.media-amazon.com/images/I/7181-vy8HUL._SL1500_.jpg", 
    category: "beauty", 
    isSale: false, 
    discount: 0,
    description: "This complete makeup kit has everything you need for a stunning look. High-quality pigments ensure long-lasting color. Compact and portable, ideal for travel. Suitable for both everyday wear and special occasions."
  },
  { 
    id: "mock_m5", 
    name: "Google Pixel 9a", 
    price: 499.99, 
    image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1698079944-google-pixel-tablet-with-charging-speaker-dock-6536a4c21d199.jpg?crop=1xw:1xh;center,top&resize=980:*", 
    category: "technology", 
    isSale: true, 
    discount: 10,
    description: "The Google Pixel 9a offers a seamless smartphone experience with a bright, high-resolution display. Capture crystal-clear photos with its advanced camera system. Enjoy fast performance and extended battery life for all-day use. Perfect for tech enthusiasts seeking reliability and style."
  },
  { 
    id: "mock_m6", 
    name: "Gold & Silver Earrings", 
    price: 79.99, 
    image: "https://media.gq-magazine.co.uk/photos/67a3758b2f73e97c9700040d/3:4/w_748%2Cc_limit/Best-women%25E2%2580%2599s-jewellery-brands-chosen-by-Jessie-Atkinson-Stories.jpg", 
    category: "jewelry", 
    isSale: true, 
    discount: 50,
    description: "These elegant gold and silver earrings add sophistication to any outfit. Crafted with high-quality materials for a lasting shine. Perfect for formal occasions or everyday wear. A versatile accessory that elevates your style."
  },
  { 
    id: "mock_m7", 
    name: "Gemstone Bracelets", 
    price: 59.99, 
    image: "https://static01.nyt.com/images/2024/01/31/multimedia/31sp-jewelry-women-inyt-01-lctk/31sp-jewelry-women-inyt-01-lctk-articleLarge.jpg?quality=75&auto=webp&disable=upscale", 
    category: "jewelry", 
    isSale: true, 
    discount: 50,
    description: "Beautiful gemstone bracelets featuring unique, vibrant stones. Each bracelet is handcrafted for quality and individuality. Lightweight and comfortable for all-day wear. Ideal as a gift or stylish personal accessory."
  },
  { 
    id: "mock_m8", 
    name: "Waterproof Fenty Foundation", 
    price: 35.99, 
    image: "https://sc04.alicdn.com/kf/Hee7af5da455c4fe2a49507b904e8c95a2.jpg_250x250.jpg", 
    category: "beauty", 
    isSale: true, 
    discount: 15,
    description: "Fenty Beauty's waterproof foundation provides flawless, long-lasting coverage. Blends seamlessly for a natural, radiant finish. Resistant to sweat and water, ideal for active lifestyles. Available in multiple shades for every skin tone."
  },
  { 
    id: "mock_m9", 
    name: "Workout Resistance Bands", 
    price: 19.99, 
    image: "https://strausssport.com/cdn/shop/files/71on1qvfF1L.jpg?v=1738741069", 
    category: "sports", 
    isSale: true, 
    discount: 50,
    description: "Durable resistance bands for strength training and stretching. Suitable for beginners and professionals alike. Portable and easy to use at home or the gym. Helps improve flexibility and tone muscles effectively."
  },
  { 
    id: "mock_m10", 
    name: "Black Jumping Rope", 
    price: 14.99, 
    image: "https://m.media-amazon.com/images/I/617-FZtUqUL.jpg", 
    category: "sports", 
    isSale: true, 
    discount: 10,
    description: "A sturdy black jumping rope perfect for cardio and coordination workouts. Lightweight and tangle-free design for easy use. Great for improving stamina and agility. Suitable for home, gym, or outdoor exercises."
  },
  { 
    id: "mock_m11", 
    name: "Large Expandable Suitcase", 
    price: 129.99, 
    image: "https://www.americantourister.com.au/dw/image/v2/AAWQ_PRD/on/demandware.static/-/Sites-American-Tourister/default/dw847738b5/images/light-max-spinner/hi-res/148200_1627_hi-res_FRONT34_1.JPG?sw=500&sh=750", 
    category: "others", 
    isSale: true, 
    discount: 20,
    description: "This large expandable suitcase is perfect for all your travel needs. Smooth wheels and a durable handle ensure easy transport. Expandable compartments provide extra packing space. Ideal for both short trips and long vacations."
  },
  { 
    id: "mock_m12", 
    name: "Black Meta Glasses", 
    price: 299.99, 
    image: "https://assets2.lenscrafters.ca/cdn-record-files-pi/f2d66bc3-3efe-4470-bce2-b07c006d00b3/187169b4-d138-4720-bdd6-b07c006d0348/0RW4006__601_SB__P21__shad__qt.png?impolicy=LC_grey", 
    category: "others", 
    isSale: true, 
    discount: 30,
    description: "Black Meta Glasses with a sleek design and AR features. Comfortable lightweight frames for all-day wear. Explore augmented reality in style and function. Perfect for tech enthusiasts and fashion-forward users."
  }
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
