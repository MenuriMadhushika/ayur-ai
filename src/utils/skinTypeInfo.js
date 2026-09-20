// =========================================================
// AYURAI SKIN TYPE INFORMATION
// Skin type is separate from the Ayurvedic wellness pattern.
// =========================================================

const labels = {
  combination: "Combination",
  dry: "Dry",
  normal: "Normal",
  oily: "Oily",
};

export const SKIN_TYPES = [
  {
    value: "Normal",
    label: "Normal",
    description: "Skin usually feels balanced and comfortable.",
  },
  {
    value: "Dry",
    label: "Dry",
    description: "Skin may feel tight, rough, or flaky in some areas.",
  },
  {
    value: "Oily",
    label: "Oily",
    description: "Skin may look shiny or feel oilier during the day.",
  },
  {
    value: "Combination",
    label: "Combination",
    description: "Some areas feel oily while other areas feel dry.",
  },
];

// =========================================================
// SKIN TYPE LABEL
// Used for AI skin-type classification result.
// =========================================================

export function skinTypeLabel(type, requiresReview = false) {
  if (type === "unavailable" || !type) {
    return "Not available";
  }

  if (requiresReview || type === "uncertain") {
    return "Uncertain";
  }

  return labels[String(type).toLowerCase()] || "Not available";
}

// =========================================================
// SKIN TYPE INFORMATION
// =========================================================

export const getSkinTypeInfo = (skinType) => {
  const normalized = String(skinType || "")
    .replace(/^AI-estimated\s*/i, "")
    .trim()
    .toLowerCase();

  return (
    SKIN_TYPES.find(
      (type) => type.value.toLowerCase() === normalized
    ) || {
      value: "Not available",
      label: "Not available",
      description: "Complete your skin check-in to add your skin type.",
    }
  );
};

// =========================================================
// ACNE-LIKE APPEARANCE FORMATTER
// Historical API fields may contain acne severity estimates.
// =========================================================

export const formatSkinType = (skinType, analysisStatus) => {
  if (String(analysisStatus || "").toUpperCase() === "UNCERTAIN") {
    return "Uncertain";
  }

  const value = String(skinType || "").trim();

  const severity = [
    "Mild",
    "Moderate",
    "Severe",
    "Very Severe",
  ].find(
    (category) =>
      category.toLowerCase() === value.toLowerCase()
  );

  if (severity) {
    return `${severity} acne-like appearance`;
  }

  if (value.toLowerCase() === "uncertain") {
    return "Uncertain";
  }

  return getSkinTypeInfo(skinType).label;
};

// =========================================================
// SENSITIVITY QUESTIONNAIRE LABEL
// Sensitivity is based on questionnaire answers,
// not the image classifier.
// =========================================================

export function sensitivityLabel(score) {
  if (score == null) {
    return "Not assessed";
  }

  return score >= 2
    ? "Sensitivity reported"
    : "Few sensitivity signs reported";
}

// =========================================================
// AI CONFIDENCE FORMATTER
// Example: 0.8137 -> 81%
// =========================================================

export function confidenceLabel(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  )
    ? `${Math.round(value * 100)}%`
    : "Not available";
}