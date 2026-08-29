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
    color: "#7f9b72",
    description:
      "An Ayurvedic wellness pattern traditionally associated with steadiness, nourishment, and calm.",
  },
};

// Returns friendly information safely for any Dosha name.
export const getDoshaInfo = (dosha) => {
  return DOSHA_INFO[dosha] || {
    label: "Your Ayurvedic pattern",
    shortLabel: "Balanced pattern",
    color: "#a58a55",
    description:
      "Your result combines your skin observations and assessment answers.",
  };
};
