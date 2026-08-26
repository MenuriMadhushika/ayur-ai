const API_URL = "http://localhost:8081/api/users";

// =========================================================
// GET USER
// =========================================================

export const getUserById = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  return await response.json();
};


// =========================================================
// UPDATE USER
// =========================================================

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Failed to update profile"
    );
  }

  return await response.json();
};