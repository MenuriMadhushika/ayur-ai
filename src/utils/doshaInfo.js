// =========================================================
// AYURAI DOSHA INFORMATION
// Use this file anywhere the app displays a Dosha result.
// =========================================================

export const DOSHA_INFO = {
  Vata: {
    label: "Vata · Ayurvedic pattern",
    shortLabel: "Vata pattern",
    color: "#6f8da8",
    description:
      "An Ayurvedic wellness pattern traditionally associated with movement, lightness, and change.",
  },

  Pitta: {
    label: "Pitta · Ayurvedic pattern",
    shortLabel: "Pitta pattern",
    color: "#c9785d",
    description:
      "An Ayurvedic wellness pattern traditionally associated with warmth, focus, and transformation.",
  },

  Kapha: {
    label: "Kapha · Ayurvedic pattern",
    shortLabel: "Kapha pattern",
    color: "#b48a42",
    description:
      "An Ayurvedic wellness pattern traditionally associated with steadiness, nourishment, and calm.",
  },
};

export const getPrimaryDosha = (dosha) => {
  const primary = String(dosha || "")
    .split(/\s*[-/]\s*/)[0]
    .trim();

  return DOSHA_INFO[primary] ? primary : "";
};

export const isMixedDosha = (dosha) =>
  String(dosha || "").split(/\s*[-/]\s*/).filter(Boolean).length > 1;

// Returns friendly information safely for single or blended Dosha results.
export const getDoshaInfo = (dosha) => {
  const primary = getPrimaryDosha(dosha);
  const patterns = String(dosha || "")
    .split(/\s*[-/]\s*/)
    .map((pattern) => pattern.trim())
    .filter((pattern) => DOSHA_INFO[pattern]);

  if (patterns.length > 1) {
    return {
      ...DOSHA_INFO[primary],
      label: `${patterns.join(" & ")} · Ayurvedic pattern`,
      shortLabel: "Blended pattern",
      description:
        "Your answers are close across these two Ayurvedic wellness patterns. This is common; use the result as gentle guidance rather than a fixed label.",
    };
  }

  return DOSHA_INFO[primary] || {
    label: "Your Ayurvedic pattern",
    shortLabel: "Balanced pattern",
    color: "#a58a55",
    description:
      "Your result combines your skin observations and assessment answers.",
  };
};
