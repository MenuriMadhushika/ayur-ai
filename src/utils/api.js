

const API_BASE_URL = "http://localhost:8081/api";

/* =========================================================
   SKIN SCAN
========================================================= */

export const createSkinScan = async (skinScanData) => {
  const response = await fetch(
    `${API_BASE_URL}/skin-scans`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skinScanData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Skin scan request failed: ${response.status}`
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
      errorText ||
        `Failed to load skin scans: ${response.status}`
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
      errorText ||
        `Failed to load latest skin scan: ${response.status}`
    );
  }

  return response.json();
};


/* =========================================================
   DOSHA ASSESSMENT
========================================================= */

export const createDoshaAssessment = async (
  assessmentData
) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessmentData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Dosha assessment request failed: ${response.status}`
    );
  }

  return response.json();
};


export const getUserDoshaAssessments = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments/user/${userId}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to load Dosha assessments: ${response.status}`
    );
  }

  return response.json();
};


export const getLatestDoshaAssessment = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/dosha-assessments/user/${userId}/latest`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to load latest Dosha assessment: ${response.status}`
    );
  }

  return response.json();
};


/* =========================================================
   HOME REMEDIES
========================================================= */

export const getAllHomeRemedies = async () => {
  const response = await fetch(
    `${API_BASE_URL}/home-remedies`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
      `Failed to load home remedies: ${response.status}`
    );
  }

  return response.json();
};


export const getHomeRemediesByDosha = async (dosha) => {
  const response = await fetch(
    `${API_BASE_URL}/home-remedies/dosha/${encodeURIComponent(dosha)}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
      `Failed to load Dosha remedies: ${response.status}`
    );
  }

  return response.json();
};


export const getPersonalizedHomeRemedies = async (
  dosha,
  skinType
) => {
  const response = await fetch(
    `${API_BASE_URL}/home-remedies/personalized?dosha=${encodeURIComponent(
      dosha
    )}&skinType=${encodeURIComponent(skinType)}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
      `Failed to load personalized remedies: ${response.status}`
    );
  }

  return response.json();
};


/* =========================================================
   API BASE URL
========================================================= */

export default API_BASE_URL;