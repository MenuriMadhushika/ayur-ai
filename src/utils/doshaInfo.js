// =========================================================
// AYURAI DOSHA INFORMATION
// Use this file anywhere the app displays a Dosha result.
// =========================================================

export const DOSHA_INFO = {
  Vata: {
    label: "Vata · Dry",
    shortLabel: "Dry & Delicate",
    color: "#6f8da8",
    description:
      "Vata skin can feel dry, fine, or easily dehydrated.",
  },

  Pitta: {
    label: "Pitta · Sensitive",
    shortLabel: "Sensitive & Reactive",
    color: "#c9785d",
    description:
      "Pitta skin can feel warm, sensitive, or prone to redness.",
  },

  Kapha: {
    label: "Kapha · Oily",
    shortLabel: "Oily & Composed",
    color: "#7f9b72",
    description:
      "Kapha skin can feel smooth, naturally oily, or prone to clogged pores.",
  },
};

// Returns friendly information safely for any Dosha name.
export const getDoshaInfo = (dosha) => {
  return DOSHA_INFO[dosha] || {
    label: "Your skin balance",
    shortLabel: "Balanced",
    color: "#a58a55",
    description:
      "Your result combines your skin observations and assessment answers.",
  };
};