const API_URI = "https://dummyjson.com";

export const getAllItems = async (limit=0) => {
  const res = await fetch(`${API_URI}/products?limit=${limit}`, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};

export const getItem = async (id) => {
  const res = await fetch(`${API_URI}/products/${id}`, {
    cache: "force-cache",
  });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};

export const addItem = async (payload) => {
  const res = await fetch(`${API_URI}/products/add`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("failed to add product");
  }
  return res.json();
}