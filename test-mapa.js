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
const { mondayOfWeek, weekWindow, levelForMinutes, minutesPerDay, heatmapData } = context;

describe("levelForMinutes", () => {
  it("maps 0 minutes to empty", () => {
    assert.equal(levelForMinutes(0), "vacio");
  });

  it("maps 1 to 29 minutes to soft", () => {
    assert.equal(levelForMinutes(1), "suave");
    assert.equal(levelForMinutes(29), "suave");
  });

  it("maps 30 to 59 minutes to medium", () => {
    assert.equal(levelForMinutes(30), "medio");
    assert.equal(levelForMinutes(59), "medio");
  });

  it("maps 60 or more minutes to intense", () => {
    assert.equal(levelForMinutes(60), "intenso");
    assert.equal(levelForMinutes(120), "intenso");
  });
});

describe("minutesPerDay", () => {
  it("adds up sessions from the same day", () => {
    const total = minutesPerDay([
      { fecha: "2026-10-01", tema: "A", minutos: 20 },
      { fecha: "2026-10-01", tema: "B", minutos: 15 },
    ]);
    assert.equal(total["2026-10-01"], 35);
  });

  it("reads legacy field names", () => {
    const total = minutesPerDay([{ date: "2026-10-01", topic: "A", minutes: 25 }]);
    assert.equal(total["2026-10-01"], 25);
  });

  it("keeps days with 0 minutes", () => {
    const total = minutesPerDay([{ fecha: "2026-10-01", tema: "A", minutos: 0 }]);
    assert.equal(total["2026-10-01"], 0);
  });
});

describe("heatmapData", () => {
  const sessions = [
    { fecha: "2026-10-03", tema: "A", minutos: 65 },
    { fecha: "2026-10-02", tema: "B", minutos: 10 },
    { fecha: "2026-10-01", tema: "C", minutos: 30 },
    { fecha: "2026-10-01", tema: "D", minutos: 15 },
    { fecha: "2026-10-10", tema: "Futura", minutos: 60 },
  ];

  it("returns one cell per day of the 12 weeks", () => {
    const cells = heatmapData(sessions, "2026-10-03");
    assert.equal(cells.length, 84);
    assert.equal(cells[0].date, "2026-07-13");
    assert.equal(cells[83].date, "2026-10-04");
  });

  it("assigns levels from daily minutes", () => {
    const cells = heatmapData(sessions, "2026-10-03");
    const byDate = Object.fromEntries(cells.map((c) => [c.date, c]));
    assert.equal(byDate["2026-10-03"].level, "intenso");
    assert.equal(byDate["2026-10-02"].level, "suave");
    assert.equal(byDate["2026-10-01"].level, "medio");
    assert.equal(byDate["2026-10-01"].minutes, 45);
  });

  it("marks future days even when they hold sessions", () => {
    const cells = heatmapData(
      [{ fecha: "2026-10-04", tema: "Futura", minutos: 60 }],
      "2026-10-03"
    );
    const sunday = cells.find((c) => c.date === "2026-10-04");
    assert.equal(sunday.level, "futuro");
  });

  it("paints an empty window with empty levels", () => {
    const cells = heatmapData([], "2026-10-03");
    assert.ok(cells.every((c) => (c.date > "2026-10-03" ? c.level === "futuro" : c.level === "vacio")));
  });

  it("has no future cells when today is Sunday", () => {
    const cells = heatmapData([], "2026-10-04");
    assert.ok(cells.every((c) => c.level === "vacio"));
  });
});

  it("skips sessions with unreadable dates", () => {
    const total = minutesPerDay([
      { fecha: "no-fecha", tema: "A", minutos: 30 },
      { fecha: "2026-13-40", tema: "B", minutos: 30 },
      { fecha: "2026-10-01", tema: "C", minutos: 10 },
    ]);
    // NOTE: {...total} copies the result into this realm because vm objects
    // carry a different prototype and strict comparison would fail.
    assert.deepEqual({ ...total }, { "2026-10-01": 10 });
  });

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
