const API_URL = "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function getUserProducts(userId) {
  const res = await fetch(`${API_URL}/products`);
  const allProducts = await res.json();
  return allProducts.filter(p => p.user === userId);
}
