const API_URL = 'http://localhost:5000/api/products';
const form = document.getElementById('product-form');
const grid = document.getElementById('store-grid');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit');
const submitBtn = document.getElementById('submit-btn');

const isSaleCheckbox = document.getElementById('isSale');
const discountInput = document.getElementById('discount');

// Show/hide discount input
isSaleCheckbox.addEventListener('change', () => {
  discountInput.style.display = isSaleCheckbox.checked ? 'block' : 'none';
});

// --- reusable function to render product cards ---
function renderProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

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

  card.innerHTML = `
    ${saleTag}
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    ${priceHTML}
    ${categoryTag}
    <div class="card-actions">
      <button class="edit-btn" onclick="editProduct(
        '${product._id}',
        '${product.name.replace(/'/g, "\\'")}',
        '${product.description.replace(/'/g, "\\'")}',
        ${product.price},
        '${product.image}',
        ${product.isSale || false},
        ${product.discount || 0},
        '${product.category || ''}'
      )">Edit</button>
      <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
    </div>
  `;

  return card;
}

// Load all products
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    grid.innerHTML = '';

    products.forEach(product => {
      const card = renderProductCard(product); // use reusable function
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading products:', err);
    grid.innerHTML = `<p class="error">Failed to load products. Check your backend connection.</p>`;
  }
}

// Add or update product
async function addOrUpdateProduct(e) {
  e.preventDefault();

  const id = document.getElementById('product-id').value;
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const image = document.getElementById('image').value;
  const isSale = document.getElementById('isSale').checked;
  const discount = isSale ? parseFloat(discountInput.value) || 0 : 0;
  const category = document.getElementById('category').value;

  const productData = { name, description, price, image, isSale, discount, category };

  try {
    let res;
    if (id) {
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
    }

    if (!res.ok) throw new Error('Request failed');

    form.reset();
    discountInput.style.display = 'none';
    document.getElementById('product-id').value = '';
    formTitle.textContent = 'Add New Product';
    cancelEditBtn.style.display = 'none';
    submitBtn.textContent = 'Add Product';

    loadProducts();
  } catch (err) {
    console.error('Error adding/updating product:', err);
    alert('Failed to save product. Check backend and input data.');
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    loadProducts();
  } catch (err) {
    console.error('Error deleting product:', err);
    alert('Failed to delete product.');
  }
}

// Edit product
window.editProduct = function (id, name, description, price, image, isSale, discount, category) {
  document.getElementById('product-id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('description').value = description;
  document.getElementById('price').value = price;
  document.getElementById('image').value = image;
  document.getElementById('isSale').checked = isSale === true || isSale === 'true';
  discountInput.style.display = isSale ? 'block' : 'none';
  discountInput.value = discount || 0;
  document.getElementById('category').value = category;

  formTitle.textContent = 'Edit Product';
  cancelEditBtn.style.display = 'inline-block';
  submitBtn.textContent = 'Update Product';
};

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('product-id').value = '';
  discountInput.style.display = 'none';
  formTitle.textContent = 'Add New Product';
  cancelEditBtn.style.display = 'none';
  submitBtn.textContent = 'Add Product';
});

// Event listeners
form.addEventListener('submit', addOrUpdateProduct);
document.addEventListener('DOMContentLoaded', loadProducts);
window.deleteProduct = deleteProduct;
