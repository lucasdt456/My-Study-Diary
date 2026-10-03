const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Load the real browser logic (plain script, no modules so file:// keeps working).
const code = fs.readFileSync(path.join(__dirname, "logica.js"), "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(code, context);
const { mondayOfWeek, weekWindow } = context;

describe("mondayOfWeek", () => {
  it("returns the same day when it is already Monday", () => {
    assert.equal(mondayOfWeek("2026-09-28"), "2026-09-28");
  });

  it("goes back to Monday from a Saturday", () => {
    assert.equal(mondayOfWeek("2026-10-03"), "2026-09-28");
  });

  it("goes back to Monday from a Sunday", () => {
    assert.equal(mondayOfWeek("2026-10-04"), "2026-09-28");
  });
});

describe("weekWindow", () => {
  it("covers 84 days from Monday to Sunday", () => {
    const days = weekWindow("2026-10-03");
    assert.equal(days.length, 84);
    assert.equal(days[0], "2026-07-13");
    assert.equal(days[83], "2026-10-04");
  });

  it("crosses the new year keeping Monday to Sunday weeks", () => {
    const days = weekWindow("2026-01-01");
    assert.equal(days.length, 84);
    assert.equal(days[0], "2025-10-13");
    assert.equal(days[83], "2026-01-04");
  });

  it("has no future days when today is Sunday", () => {
    const days = weekWindow("2026-10-04");
    assert.equal(days[83], "2026-10-04");
    assert.ok(days.every((d) => d <= "2026-10-04"));
  });
});
