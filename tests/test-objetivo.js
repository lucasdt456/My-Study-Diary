const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Load the real browser logic (plain script, no modules so file:// keeps working).
const code = fs.readFileSync(path.join(__dirname, "..", "js", "logica.js"), "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(code, context);
const { weeklyMinutes, isValidGoal, goalStatus } = context;

describe("weeklyMinutes", () => {
  it("adds up sessions from Monday to today", () => {
    const sessions = [
      { fecha: "2026-09-28", tema: "A", minutos: 20 },
      { fecha: "2026-10-02", tema: "B", minutos: 10 },
      { fecha: "2026-10-03", tema: "C", minutos: 15 },
    ];
    assert.equal(weeklyMinutes(sessions, "2026-10-03"), 45);
  });

  it("excludes the previous Sunday, future and unreadable dates", () => {
    const sessions = [
      { fecha: "2026-09-27", tema: "Viejo", minutos: 100 },
      { fecha: "2026-10-10", tema: "Futuro", minutos: 100 },
      { fecha: "no-fecha", tema: "Roto", minutos: 100 },
      { fecha: "2026-09-29", tema: "OK", minutos: 25 },
    ];
    assert.equal(weeklyMinutes(sessions, "2026-10-03"), 25);
  });

  it("returns 0 for an empty week", () => {
    assert.equal(weeklyMinutes([], "2026-10-03"), 0);
  });

  it("counts only that day when today is Monday", () => {
    const sessions = [
      { fecha: "2026-09-28", tema: "A", minutos: 40 },
      { fecha: "2026-09-27", tema: "Viejo", minutos: 40 },
    ];
    assert.equal(weeklyMinutes(sessions, "2026-09-28"), 40);
  });
});

describe("isValidGoal", () => {
  it("accepts 1 and 10080", () => {
    assert.equal(isValidGoal(1), true);
    assert.equal(isValidGoal(10080), true);
  });

  it("rejects 0, negatives, decimals, over max, text and empty", () => {
    assert.equal(isValidGoal(0), false);
    assert.equal(isValidGoal(-5), false);
    assert.equal(isValidGoal(2.5), false);
    assert.equal(isValidGoal(10081), false);
    assert.equal(isValidGoal("300"), false);
    assert.equal(isValidGoal(""), false);
  });
});

describe("goalStatus", () => {
  it("marks exact and exceeded goals as done with 0 remaining", () => {
    assert.deepEqual({ ...goalStatus(300, 300) }, { done: true, remaining: 0 });
    assert.deepEqual({ ...goalStatus(320, 300) }, { done: true, remaining: 0 });
  });

  it("shows remaining minutes when the goal is not met", () => {
    assert.deepEqual({ ...goalStatus(250, 300) }, { done: false, remaining: 50 });
  });
});
