const SEVERITY_LABELS = {
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
  "very severe": "Very Severe",
  uncertain: "Uncertain",
};

export const formatAcneSeverity = (value) => {
  const normalized = String(value || "")
    .replace(/acne-like appearance/gi, "")
    .replace(/ai-estimated/gi, "")
    .trim()
    .toLowerCase();

  return SEVERITY_LABELS[normalized] || "Not available";
};

export const isHigherAcneSeverity = (value) =>
  ["severe", "very severe"].includes(
    String(value || "").trim().toLowerCase()
  );
