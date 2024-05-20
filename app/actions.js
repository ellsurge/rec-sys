"use server";
import { cookies } from "next/headers";
import { useContext } from "react";
import { redirect } from "next/navigation";

// const API_URI = "https://rec-sys.onrender.com";
const API_URI = "http://127.0.0.1:5000";

export const getAllItems = async (limit = 0) => {
  const res = await fetch(`${API_URI}/get_all`, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};

export const getItem = async (id) => {
  const res = await fetch(`${API_URI}/recommendations?id=${id}`);
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};

export const getCart = async (id) => {
  const res = await fetch(`${API_URI}/get_cart?id=${id}`);
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
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
};

export const addToCart = async (payload) => {
  const res = await fetch(`${API_URI}/add_to_cart`, {
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
};

export const login = async (userName, password) => {
  try {
    const response = await fetch(
      `${API_URI}/validate?user=${userName}&password=${password}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to validate credentials: ${response.statusText}`);
    }

    const data = await response.json(); // Assuming the response is JSON data
    console.log("Response body:", data);
    if (data.result) {
      createSession(data.result);
      return data.result;
    } else {
      return false;
    }
    // Handle the response data here (e.g., validate login result)
    // Example: Check if login was successful based on response data

    return data; // Return response data or use it as needed
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export const signUp = async (payload) => {
  const response = await fetch(`${API_URI}/add_user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return response.statusText;
    // throw new Error(`Failed to create user: ${response.statusText}`);
  } else {
    redirect("/login");
  }
};
export const logout = async () => {
  cookies().delete("user");
  redirect("/login");
};
export async function createSession(user) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // 3. Store the session in cookies for optimistic auth checks
  cookies().set("user", user, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export const get_user = () => {
  const user = cookies().has("user");
  if (!user) {
    return false;
  }
  return cookies().get("user").value;
};
