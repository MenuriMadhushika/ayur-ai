import test from "node:test";
import assert from "node:assert/strict";

import {
  formatSkinType,
  getSkinTypeInfo,
  skinTypeLabel,
  sensitivityLabel,
  confidenceLabel,
} from "./skinTypeInfo.js";

test("all acne-like appearance categories retain educational labels", () => {
  for (const severity of ["Mild", "Moderate", "Severe", "Very Severe"]) {
    assert.equal(
      formatSkinType(severity),
      `${severity} acne-like appearance`
    );
  }
});

test("uncertain acne-like scans are not displayed as missing results", () => {
  assert.equal(formatSkinType(null, "UNCERTAIN"), "Uncertain");
  assert.equal(formatSkinType("Uncertain"), "Uncertain");
});

test("legacy skin types and absent results still work", () => {
  assert.equal(formatSkinType("Oily"), "Oily");
  assert.equal(formatSkinType(null), "Not available");
  assert.equal(getSkinTypeInfo("Moderate").value, "Not available");
});

test("valid, uncertain and unavailable skin types are formatted correctly", () => {
  assert.equal(skinTypeLabel("dry"), "Dry");
  assert.equal(skinTypeLabel("combination"), "Combination");
  assert.equal(skinTypeLabel("normal"), "Normal");
  assert.equal(skinTypeLabel("oily"), "Oily");

  assert.equal(skinTypeLabel("uncertain"), "Uncertain");
  assert.equal(skinTypeLabel("oily", true), "Uncertain");
  assert.equal(skinTypeLabel("unavailable", true), "Not available");
  assert.equal(skinTypeLabel(null), "Not available");

  assert.equal(skinTypeLabel("Moderate"), "Not available");
});

test("confidence formatting works correctly", () => {
  assert.equal(confidenceLabel(0.82), "82%");
  assert.equal(confidenceLabel(0), "0%");
  assert.equal(confidenceLabel(1), "100%");
  assert.equal(confidenceLabel(null), "Not available");
});

test("sensitivity questionnaire remains independent from skin type", () => {
  assert.equal(sensitivityLabel(null), "Not assessed");
  assert.equal(sensitivityLabel(0), "Few sensitivity signs reported");
  assert.equal(sensitivityLabel(2), "Sensitivity reported");
  assert.equal(sensitivityLabel(4), "Sensitivity reported");
});
