// =========================================================
// AYURAI SKIN TYPE INFORMATION
// Skin type is separate from the Ayurvedic wellness pattern.
// =========================================================

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
  {
    value: "Sensitive",
    label: "Sensitive",
    description: "Skin may easily feel uncomfortable or react to products.",
  },
];

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

// Historical API fields also hold acne-like severity estimates.
export const formatSkinType = (skinType, analysisStatus) => {
  if (String(analysisStatus || "").toUpperCase() === "UNCERTAIN") return "Uncertain";
  const value = String(skinType || "").trim();
  const severity = ["Mild", "Moderate", "Severe", "Very Severe"].find(
    (category) => category.toLowerCase() === value.toLowerCase()
  );
  if (severity) return `${severity} acne-like appearance`;
  if (value.toLowerCase() === "uncertain") return "Uncertain";
  return getSkinTypeInfo(skinType).label;
};
