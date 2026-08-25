const API_BASE_URL = "http://localhost:8081/api";

export const createSkinScan = async (skinScanData) => {
  const response = await fetch(`${API_BASE_URL}/skin-scans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skinScanData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Skin scan request failed: ${response.status}`
    );
  }

  return response.json();
};

export const getUserSkinScans = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/skin-scans/user/${userId}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Failed to load skin scans: ${response.status}`
    );
  }

  return response.json();
};

export const getLatestSkinScan = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/skin-scans/user/${userId}/latest`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Failed to load latest skin scan: ${response.status}`
    );
  }

  return response.json();
};

export default API_BASE_URL;