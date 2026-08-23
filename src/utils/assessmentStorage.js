const ASSESSMENT_KEY = "ayurai_assessment";

const DEFAULT_ASSESSMENT = {
  skinScanCompleted: false,
  doshaTestCompleted: false,

  skinAnalysis: null,
  doshaResult: null,
};

export const getAssessment = () => {
  try {
    const saved = localStorage.getItem(ASSESSMENT_KEY);

    if (!saved) {
      return { ...DEFAULT_ASSESSMENT };
    }

    return {
      ...DEFAULT_ASSESSMENT,
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.error("Unable to load AyurAI assessment:", error);

    return { ...DEFAULT_ASSESSMENT };
  }
};


export const saveSkinAnalysis = (skinAnalysis) => {
  const current = getAssessment();

  const updated = {
    ...current,
    skinScanCompleted: true,
    skinAnalysis,
  };

  localStorage.setItem(
    ASSESSMENT_KEY,
    JSON.stringify(updated)
  );

  return updated;
};


export const saveDoshaResult = (doshaResult) => {
  const current = getAssessment();

  const updated = {
    ...current,
    doshaTestCompleted: true,
    doshaResult,
  };

  localStorage.setItem(
    ASSESSMENT_KEY,
    JSON.stringify(updated)
  );

  return updated;
};


export const isAssessmentComplete = () => {
  const assessment = getAssessment();

  return (
    assessment.skinScanCompleted &&
    assessment.doshaTestCompleted
  );
};


export const getNextAssessmentStep = () => {
  const assessment = getAssessment();

  if (
    assessment.skinScanCompleted &&
    assessment.doshaTestCompleted
  ) {
    return "/overall-result";
  }

  if (!assessment.skinScanCompleted) {
    return "/skin-scan";
  }

  if (!assessment.doshaTestCompleted) {
    return "/dosha-test";
  }

  return "/";
};


export const clearAssessment = () => {
  localStorage.removeItem(ASSESSMENT_KEY);
};