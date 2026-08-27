const API_BASE_URL = "http://localhost:8081/api";

// SKIN SCAN
export const createSkinScan = async (skinScanData) => {
  const response = await fetch(`${API_BASE_URL}/skin-scans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skinScanData),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getUserSkinScans = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/skin-scans/user/${userId}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getLatestSkinScan = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/skin-scans/user/${userId}/latest`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

// DOSHA ASSESSMENT
export const createDoshaAssessment = async (assessmentData) => {
  const response = await fetch(`${API_BASE_URL}/dosha-assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assessmentData),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getUserDoshaAssessments = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments/user/${userId}`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getLatestDoshaAssessment = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments/user/${userId}/latest`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

// HOME REMEDIES
export const getAllHomeRemedies = async () => {
  const response = await fetch(`${API_BASE_URL}/home-remedies`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getHomeRemediesByDosha = async (dosha) => {
  const response = await fetch(
    `${API_BASE_URL}/home-remedies/dosha/${encodeURIComponent(dosha)}`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getPersonalizedHomeRemedies = async (dosha, skinType) => {
  const response = await fetch(
    `${API_BASE_URL}/home-remedies/personalized?dosha=${encodeURIComponent(
      dosha
    )}&skinType=${encodeURIComponent(skinType)}`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

// OVERALL RESULT
export const createOverallResult = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/overall-results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getLatestOverallResult = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/overall-results/user/${userId}/latest`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export default API_BASE_URL;