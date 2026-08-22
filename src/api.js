const API_URL = "http://localhost:5000";

export const testBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    throw error;
  }
};