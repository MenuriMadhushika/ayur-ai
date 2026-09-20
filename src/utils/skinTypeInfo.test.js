import test from 'node:test';
import assert from 'node:assert/strict';
import { formatSkinType, getSkinTypeInfo } from './skinTypeInfo.js';

test('all model categories retain educational labels', () => {
  for (const severity of ['Mild', 'Moderate', 'Severe', 'Very Severe']) {
    assert.equal(formatSkinType(severity), `${severity} acne-like appearance`);
  }
});

test('uncertain scans are not displayed as missing results', () => {
  assert.equal(formatSkinType(null, 'UNCERTAIN'), 'Uncertain');
  assert.equal(formatSkinType('Uncertain'), 'Uncertain');
});

test('legacy skin types and absent results still work', () => {
  assert.equal(formatSkinType('Oily'), 'Oily');
  assert.equal(formatSkinType(null), 'Not available');
  assert.equal(getSkinTypeInfo('Moderate').value, 'Not available');
});
