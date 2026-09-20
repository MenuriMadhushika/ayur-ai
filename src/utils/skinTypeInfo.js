const labels = { combination: "Combination", dry: "Dry", normal: "Normal", oily: "Oily" };

export function skinTypeLabel(type, requiresReview = false) {
  if (type === "unavailable" || !type) return "Not available";
  if (requiresReview || type === "uncertain") return "Uncertain";
  return labels[type] || "Not available";
}

export function sensitivityLabel(score) {
  if (score == null) return "Not assessed";
  return score >= 2 ? "Sensitivity reported" : "Few sensitivity signs reported";
}

export function confidenceLabel(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
    ? `${Math.round(value * 100)}%` : "Not available";
}
