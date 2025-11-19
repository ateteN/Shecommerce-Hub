// js/productRenderer.js
export function renderProductCard(product) {
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
    <p>${product.description || ''}</p>
    ${priceHTML}
    ${categoryTag}
    <a href="product.html?id=${product.id || product._id}" class="view-product-btn">View Product</a>
  `;

  return card;
}
