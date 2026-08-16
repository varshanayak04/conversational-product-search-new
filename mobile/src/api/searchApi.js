import { API_BASE_URL } from "./config";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function searchProducts(query) {
  const res = await fetch(`${API_BASE_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return handle(res);
}

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`);
  return handle(res);
}

export async function getProductsByCategory(category, limit = 20) {
  const res = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(category)}&limit=${limit}`);
  return handle(res);
}

export async function getTrending(limit = 10) {
  const res = await fetch(`${API_BASE_URL}/api/trending?limit=${limit}`);
  return handle(res);
}

export async function getRecommendations(history, limit = 10) {
  const res = await fetch(`${API_BASE_URL}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, limit }),
  });
  return handle(res);
}
