const API_URL = 'http://localhost:5000/api/products';
const form = document.getElementById('product-form');
const grid = document.getElementById('store-grid');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit');
const submitBtn = document.getElementById('submit-btn');

// Load all products
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    grid.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const saleTag = product.isSale ? '<div class="sale-tag">SALE</div>' : '';

      card.innerHTML = `
        ${saleTag}
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${parseFloat(product.price).toFixed(2)}</p>
        <div class="card-actions">
          <button class="edit-btn" onclick="editProduct(
            '${product._id}',
            '${product.name.replace(/'/g, "\\'")}',
            '${product.description.replace(/'/g, "\\'")}',
            ${product.price},
            '${product.image}',
            ${product.isSale || false}
          )">Edit</button>
          <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
        </div>
      `;
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
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;
  const isSale = document.getElementById('isSale').checked;

  const productData = { name, description, price, image, isSale };

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

// Edit product (global for inline onclick)
window.editProduct = function (id, name, description, price, image, isSale) {
  document.getElementById('product-id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('description').value = description;
  document.getElementById('price').value = price;
  document.getElementById('image').value = image;
  document.getElementById('isSale').checked = isSale === true || isSale === 'true';

  formTitle.textContent = 'Edit Product';
  cancelEditBtn.style.display = 'inline-block';
  submitBtn.textContent = 'Update Product';
};

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('product-id').value = '';
  formTitle.textContent = 'Add New Product';
  cancelEditBtn.style.display = 'none';
  submitBtn.textContent = 'Add Product';
});

// Event listeners
form.addEventListener('submit', addOrUpdateProduct);
document.addEventListener('DOMContentLoaded', loadProducts);
window.deleteProduct = deleteProduct;
