import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("result component renders normal, uncertain, and missing responses", async () => {
  const server = await createServer({ server: { middlewareMode: true }, configLoader: "runner" });
  try {
    const { default: Component } = await server.ssrLoadModule("/src/components/SkinTypeResult.jsx");
    const render = prediction => renderToStaticMarkup(React.createElement(Component, { prediction }));
    assert.match(render({ skinType: "oily", confidence: .84 }), /Oily/);
    assert.match(render({ skinType: "oily", confidence: .84 }), /84%/);
    const uncertain = render({ skinType: "uncertain", predictedClass: "combination", confidence: .46, requiresReview: true });
    assert.match(uncertain, /could not confidently estimate/);
    assert.doesNotMatch(uncertain, /Combination/);
    assert.match(render(null), /not available for this scan/);
  } finally {
    await server.close();
  }
});
