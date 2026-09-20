import { test } from "node:test";
import assert from "node:assert/strict";
import { skinTypeLabel, sensitivityLabel, confidenceLabel } from "./skinTypeInfo.js";

test("valid, uncertain, unavailable and historical skin types", () => {
  assert.equal(skinTypeLabel("dry"), "Dry");
  assert.equal(skinTypeLabel("combination"), "Combination");
  assert.equal(skinTypeLabel("uncertain"), "Uncertain");
  assert.equal(skinTypeLabel("oily", true), "Uncertain");
  assert.equal(skinTypeLabel("unavailable", true), "Not available");
  assert.equal(skinTypeLabel(null), "Not available");
  assert.equal(skinTypeLabel("Moderate"), "Not available");
});
test("confidence formatting and sensitivity stay independent", () => {
  assert.equal(confidenceLabel(.82), "82%");
  assert.equal(confidenceLabel(null), "Not available");
  assert.equal(sensitivityLabel(null), "Not assessed");
  assert.equal(sensitivityLabel(0), "Few sensitivity signs reported");
  assert.equal(sensitivityLabel(2), "Sensitivity reported");
  assert.equal(sensitivityLabel(4), "Sensitivity reported");
});
