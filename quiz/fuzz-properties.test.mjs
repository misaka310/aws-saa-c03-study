import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import fc from "fast-check";

const source = fs.readFileSync(new URL("./backup.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const { normalizePayload } = sandbox.window.SAA_BACKUP;

test("property: backup normalization either rejects non-objects or returns a stable object shape", () => {
  fc.assert(
    fc.property(fc.jsonValue(), (payload) => {
      const isObject = payload !== null && typeof payload === "object" && !Array.isArray(payload);
      if (!isObject) {
        assert.throws(() => normalizePayload(payload));
        return;
      }
      const normalized = normalizePayload(payload);
      assert.equal(typeof normalized, "object");
      assert.ok(normalized.results && typeof normalized.results === "object" && !Array.isArray(normalized.results));
      assert.ok(normalized.state === null || (typeof normalized.state === "object" && !Array.isArray(normalized.state)));
    }),
    { numRuns: 1000 },
  );
});
