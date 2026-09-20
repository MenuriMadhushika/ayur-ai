const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

// =========================================================
// COMMON REQUEST HELPERS
// =========================================================

const getErrorMessage = async (response) => {
  const text = await response.text();
  if (!text) return `Request failed: ${response.status}`;
  try {
    const body = JSON.parse(text);
    return body.message || body.detail || text;
  } catch {
    return text;
  }
};

// Adds the saved login token to protected admin requests.
const getAdminHeaders = () => {
  const token = localStorage.getItem("ayuraiToken");

  if (!token) {
    throw new Error(
      "Your admin session has expired. Please log in again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const getAdminJsonHeaders = () => {
  return {
    ...getAdminHeaders(),
    "Content-Type": "application/json",
  };
};

// Adds the saved login token whenever a normal signed-in user calls the API.
// Unlike the admin helper, it does not throw: public pages can still load.
export const getAuthenticatedHeaders = () => {
  const token = localStorage.getItem("ayuraiToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAuthenticatedJsonHeaders = () => ({
  ...getAuthenticatedHeaders(),
  "Content-Type": "application/json",
});

// =========================================================
// SKIN SCAN
// =========================================================

export const createSkinScan = async (skinScanData) => {
  const response = await fetch(`${API_BASE_URL}/skin-scans`, {
    method: "POST",
    headers: getAuthenticatedJsonHeaders(),
    body: JSON.stringify(skinScanData),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getUserSkinScans = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/skin-scans/user/${userId}`, {
    headers: getAuthenticatedHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getLatestSkinScan = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/skin-scans/user/${userId}/latest`,
    { headers: getAuthenticatedHeaders() }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================================================
// DOSHA ASSESSMENT
// =========================================================

export const createDoshaAssessment = async (assessmentData) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments`,
    {
      method: "POST",
      headers: getAuthenticatedJsonHeaders(),
      body: JSON.stringify(assessmentData),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getUserDoshaAssessments = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments/user/${userId}`,
    { headers: getAuthenticatedHeaders() }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getLatestDoshaAssessment = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments/user/${userId}/latest`,
    { headers: getAuthenticatedHeaders() }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================================================
// HOME REMEDIES
// =========================================================

export const getAllHomeRemedies = async () => {
  const response = await fetch(`${API_BASE_URL}/home-remedies`, {
    headers: getAuthenticatedHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getHomeRemediesByDosha = async (dosha) => {
  const response = await fetch(
    `${API_BASE_URL}/home-remedies/dosha/${encodeURIComponent(dosha)}`,
    { headers: getAuthenticatedHeaders() }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================================================
// OVERALL RESULTS
// =========================================================

export const createOverallResult = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/overall-results`,
    {
      method: "POST",
      headers: getAuthenticatedJsonHeaders(),
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getLatestOverallResult = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/overall-results/user/${userId}/latest`,
    { headers: getAuthenticatedHeaders() }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const analyzeSkinPhoto = async (userId, image, sensitivityAnswers = null) => {
  const formData = new FormData();
  formData.append("image", image);
  if (sensitivityAnswers != null) formData.append("sensitivityAnswers", sensitivityAnswers);
  const response = await fetch(`${API_BASE_URL}/skin-scans/analyze/user/${userId}`, {
    method: "POST",
    headers: getAuthenticatedHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
  return response.json();
};

// =========================================================
// ADMIN DASHBOARD
// =========================================================

export const getAdminDashboard = async () => {
  const response = await fetch(
    `${API_BASE_URL}/admin/dashboard`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================================================
// ADMIN PLATFORM INSIGHTS
// Anonymous totals only; no photos or private user data.
// =========================================================

export const getAdminInsights = async () => {
  const response = await fetch(
    `${API_BASE_URL}/admin/insights`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================================================
// ADMIN USERS
// =========================================================

export const getAdminUsers = async () => {
  const response = await fetch(
    `${API_BASE_URL}/admin/users`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getAdminUserActivity = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}/activity`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// =========================================================
// ADMIN HOME REMEDY MANAGEMENT
// Only ADMIN users can create, edit, or remove remedies.
// =========================================================

export const getAdminRemedies = async () => {
  const response = await fetch(
    `${API_BASE_URL}/admin/remedies`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const createAdminRemedy = async (remedyData) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/remedies`,
    {
      method: "POST",
      headers: getAdminJsonHeaders(),
      body: JSON.stringify(remedyData),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const updateAdminRemedy = async (id, remedyData) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/remedies/${id}`,
    {
      method: "PUT",
      headers: getAdminJsonHeaders(),
      body: JSON.stringify(remedyData),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const deleteAdminRemedy = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/remedies/${id}`,
    {
      method: "DELETE",
      headers: getAdminHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};

export default API_BASE_URL;
