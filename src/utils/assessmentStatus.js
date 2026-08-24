/* =========================================================
   AYURAI — ASSESSMENT STATUS
   =========================================================

   Central storage utility for:

   1. Skin Scan
   2. Dosha Test
   3. Overall Assessment

   IMPORTANT:
   This file must contain JavaScript only.
   Do NOT put React JSX inside this file.
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  doshaResult: "ayuraiDoshaResult",
  skinScanResult: "ayuraiSkinScanResult",

  /*
    Compatibility flags used by existing components.
  */
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
   =========================================================

   This allows UserProfile and other components to
   refresh immediately after an assessment is saved
   in the SAME browser tab.

   The normal "storage" event does not fire in the
   same tab that changes localStorage.
========================================================= */

const notifyAssessmentUpdated = () => {
  try {
    window.dispatchEvent(
      new CustomEvent(
        "ayuraiAssessmentUpdated"
      )
    );
  } catch (error) {
    /*
      Ignore notification errors.
      The localStorage save has already happened.
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


  /*
    Make sure the result has the expected structure.
  */

  const savedResult = {
    ...result,

    completed:
      result.completed !== false,

    completedAt:
      result.completedAt ||
      new Date().toISOString(),
  };


  /*
    Save complete Dosha result.
  */

  const resultSaved =
    writeJSON(
      STORAGE_KEYS.doshaResult,
      savedResult
    );


  /*
    Save compatibility completion flag.
  */

  saveBooleanFlag(
    STORAGE_KEYS.doshaCompleted,
    true
  );


  /*
    Notify components such as UserProfile.
  */

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


  /*
    Keep the actual AI-estimated observations.

    These values are NOT treated as medical diagnosis.
  */

  const savedResult = {
    ...result,

    completed:
      result.completed !== false,

    completedAt:
      result.completedAt ||
      new Date().toISOString(),
  };


  /*
    Save complete Skin Scan result.
  */

  const resultSaved =
    writeJSON(
      STORAGE_KEYS.skinScanResult,
      savedResult
    );


  /*
    Save compatibility completion flag.
  */

  saveBooleanFlag(
    STORAGE_KEYS.skinScanCompleted,
    true
  );


  /*
    Notify UserProfile and other components.
  */

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


  /*
    Check both the result itself and the
    compatibility completion flag.

    This makes the application more robust
    if older localStorage data exists.
  */

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

    /*
      Main names used by the new application.
    */

    doshaCompleted,

    skinScanCompleted,


    /*
      Compatibility name used by SkinScanCard.
    */

    doshaTestCompleted:
      doshaCompleted,

    doshaCompleted:


      doshaCompleted,

    skinScanCompleted:
      skinScanCompleted,


    /*
      Overall status.
    */

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
   =========================================================

   You can call:

   getAssessmentStorage()

   from the browser console to inspect
   exactly what AyurAI has saved.
========================================================= */

export const getAssessmentStorage = () => {

  return {

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