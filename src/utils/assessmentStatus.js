
/* =========================================================
   AYURAI — ASSESSMENT STATUS
   =========================================================

   Central storage utility for:

   1. Current User
   2. Skin Scan
   3. Dosha Test
   4. Overall Assessment

   IMPORTANT:
   This file contains JavaScript only.
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  userId: "ayuraiUserId",

  doshaResult: "ayuraiDoshaResult",
  skinScanResult: "ayuraiSkinScanResult",

  doshaCompleted: "ayuraiDoshaTestCompleted",
  skinScanCompleted: "ayuraiSkinScanCompleted",
};


/* =========================================================
   SAFE JSON PARSER
========================================================= */

const readJSON = (key) => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      `AyurAI: Unable to read ${key}`,
      error
    );

    return null;
  }
};


/* =========================================================
   SAVE JSON
========================================================= */

const writeJSON = (key, value) => {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;

  } catch (error) {

    console.error(
      `AyurAI: Unable to save ${key}`,
      error
    );

    return false;
  }
};


/* =========================================================
   CURRENT USER
   =========================================================

   The backend currently uses Long user IDs.

   Example:

   userId = 5

   We store it as a string in localStorage and
   convert it back to Number when reading.
========================================================= */

export const saveCurrentUserId = (userId) => {

  if (
    userId === null ||
    userId === undefined ||
    userId === ""
  ) {

    console.warn(
      "AyurAI: Cannot save empty user ID."
    );

    return false;
  }

  try {

    localStorage.setItem(
      STORAGE_KEYS.userId,
      String(userId)
    );

    return true;

  } catch (error) {

    console.error(
      "AyurAI: Unable to save current user ID.",
      error
    );

    return false;
  }
};


/* =========================================================
   GET CURRENT USER ID
========================================================= */

export const getCurrentUserId = () => {

  try {

    const savedUserId =
      localStorage.getItem(
        STORAGE_KEYS.userId
      );

    if (
      savedUserId === null ||
      savedUserId === ""
    ) {
      return null;
    }

    const userId =
      Number(savedUserId);

    if (Number.isNaN(userId)) {
      return null;
    }

    return userId;

  } catch (error) {

    console.error(
      "AyurAI: Unable to read current user ID.",
      error
    );

    return null;
  }
};


/* =========================================================
   CLEAR CURRENT USER
========================================================= */

export const clearCurrentUserId = () => {

  try {

    localStorage.removeItem(
      STORAGE_KEYS.userId
    );

    return true;

  } catch (error) {

    console.error(
      "AyurAI: Unable to clear current user ID.",
      error
    );

    return false;
  }
};


/* =========================================================
   SAVE BOOLEAN FLAG
========================================================= */

const saveBooleanFlag = (key, value) => {

  try {

    localStorage.setItem(
      key,
      value ? "true" : "false"
    );

    return true;

  } catch (error) {

    console.error(
      `AyurAI: Unable to save ${key}`,
      error
    );

    return false;
  }
};


/* =========================================================
   READ BOOLEAN FLAG
========================================================= */

const readBooleanFlag = (key) => {

  try {

    return (
      localStorage.getItem(key) === "true"
    );

  } catch {

    return false;
  }
};


/* =========================================================
   NOTIFY REACT COMPONENTS
========================================================= */

const notifyAssessmentUpdated = () => {

  try {

    window.dispatchEvent(
      new CustomEvent(
        "ayuraiAssessmentUpdated"
      )
    );

  } catch {
    /*
      Ignore notification errors.
    */
  }
};


/* =========================================================
   GET DOSHA RESULT
========================================================= */

export const getDoshaResult = () => {

  return readJSON(
    STORAGE_KEYS.doshaResult
  );
};


/* =========================================================
   SAVE DOSHA RESULT
========================================================= */

export const saveDoshaResult = (result) => {

  if (!result) {

    console.warn(
      "AyurAI: Cannot save empty Dosha result."
    );

    return false;
  }


  const savedResult = {

    ...result,

    completed:
      result.completed !== false,

    completedAt:
      result.completedAt ||
      new Date().toISOString(),
  };


  const resultSaved =
    writeJSON(
      STORAGE_KEYS.doshaResult,
      savedResult
    );


  saveBooleanFlag(
    STORAGE_KEYS.doshaCompleted,
    true
  );


  notifyAssessmentUpdated();


  return resultSaved;
};


/* =========================================================
   CLEAR DOSHA RESULT
========================================================= */

export const clearDoshaResult = () => {

  try {

    localStorage.removeItem(
      STORAGE_KEYS.doshaResult
    );

    localStorage.removeItem(
      STORAGE_KEYS.doshaCompleted
    );

    notifyAssessmentUpdated();

    return true;

  } catch (error) {

    console.error(
      "AyurAI: Unable to clear Dosha result.",
      error
    );

    return false;
  }
};


/* =========================================================
   GET SKIN SCAN RESULT
========================================================= */

export const getSkinScanResult = () => {

  return readJSON(
    STORAGE_KEYS.skinScanResult
  );
};


/* =========================================================
   SAVE SKIN SCAN RESULT
========================================================= */

export const saveSkinScanResult = (result) => {

  if (!result) {

    console.warn(
      "AyurAI: Cannot save empty Skin Scan result."
    );

    return false;
  }


  const savedResult = {

    ...result,

    completed:
      result.completed !== false,

    completedAt:
      result.completedAt ||
      new Date().toISOString(),
  };


  const resultSaved =
    writeJSON(
      STORAGE_KEYS.skinScanResult,
      savedResult
    );


  saveBooleanFlag(
    STORAGE_KEYS.skinScanCompleted,
    true
  );


  notifyAssessmentUpdated();


  return resultSaved;
};


/* =========================================================
   CLEAR SKIN SCAN RESULT
========================================================= */

export const clearSkinScanResult = () => {

  try {

    localStorage.removeItem(
      STORAGE_KEYS.skinScanResult
    );

    localStorage.removeItem(
      STORAGE_KEYS.skinScanCompleted
    );

    notifyAssessmentUpdated();

    return true;

  } catch (error) {

    console.error(
      "AyurAI: Unable to clear Skin Scan result.",
      error
    );

    return false;
  }
};


/* =========================================================
   GET ASSESSMENT STATUS
========================================================= */

export const getAssessmentStatus = () => {

  const doshaResult =
    getDoshaResult();

  const skinScanResult =
    getSkinScanResult();


  const doshaCompleted =
    Boolean(
      doshaResult?.completed ||
      readBooleanFlag(
        STORAGE_KEYS.doshaCompleted
      )
    );


  const skinScanCompleted =
    Boolean(
      skinScanResult?.completed ||
      readBooleanFlag(
        STORAGE_KEYS.skinScanCompleted
      )
    );


  return {

    userId:
      getCurrentUserId(),

    doshaCompleted,

    skinScanCompleted,

    doshaTestCompleted:
      doshaCompleted,

    bothCompleted:
      doshaCompleted &&
      skinScanCompleted,

    assessmentCompleted:
      doshaCompleted &&
      skinScanCompleted,
  };
};


/* =========================================================
   IS ASSESSMENT COMPLETE
========================================================= */

export const isAssessmentComplete = () => {

  const status =
    getAssessmentStatus();

  return Boolean(
    status.doshaCompleted &&
    status.skinScanCompleted
  );
};


/* =========================================================
   GET NEXT ASSESSMENT
========================================================= */

export const getNextAssessment = () => {

  const status =
    getAssessmentStatus();


  if (!status.skinScanCompleted) {
    return "skin-scan";
  }


  if (!status.doshaCompleted) {
    return "dosha-test";
  }


  return "overall-result";
};


/* =========================================================
   RESET ALL ASSESSMENTS
========================================================= */

export const clearAllAssessmentResults = () => {

  try {

    localStorage.removeItem(
      STORAGE_KEYS.doshaResult
    );

    localStorage.removeItem(
      STORAGE_KEYS.skinScanResult
    );

    localStorage.removeItem(
      STORAGE_KEYS.doshaCompleted
    );

    localStorage.removeItem(
      STORAGE_KEYS.skinScanCompleted
    );

    notifyAssessmentUpdated();

    return true;

  } catch (error) {

    console.error(
      "AyurAI: Unable to clear assessment results.",
      error
    );

    return false;
  }
};


/* =========================================================
   DEBUG HELPER
========================================================= */

export const getAssessmentStorage = () => {

  return {

    userId:
      getCurrentUserId(),

    doshaResult:
      getDoshaResult(),

    skinScanResult:
      getSkinScanResult(),

    status:
      getAssessmentStatus(),
  };
};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  saveCurrentUserId,
  getCurrentUserId,
  clearCurrentUserId,

  getDoshaResult,
  saveDoshaResult,
  clearDoshaResult,

  getSkinScanResult,
  saveSkinScanResult,
  clearSkinScanResult,

  getAssessmentStatus,
  isAssessmentComplete,
  getNextAssessment,

  clearAllAssessmentResults,
  getAssessmentStorage,
};
