const API_URI = "https://rec-sys.onrender.com";

export const getAllItems = async (limit=0) => {
  const res = await fetch(`${API_URI}/get_all`, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json().result;
};

export const getItem = async (id) => {
  const res = await fetch(`${API_URI}/recommendations?id=${id}`, {
    cache: "force-cache",
  });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json().result;
};

export const addItem = async (payload) => {
  const res = await fetch(`${API_URI}/add_item`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("failed to add product");
  }
  return res.json();
}