// Pure logic for the study heatmap: no DOM, no localStorage.
// Dates are "YYYY-MM-DD" strings in the user's local time.
// "today" is always passed as a parameter so tests can fix it.

// Builds a local Date from "YYYY-MM-DD" (never UTC).
function parseLocalDay(text) {
  const parts = text.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  return new Date(year, month, day);
}

// Formats a local Date as "YYYY-MM-DD".
function formatLocalDay(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Returns the Monday ("YYYY-MM-DD") of the week containing the given day.
function mondayOfWeek(dateString) {
  const date = parseLocalDay(dateString);
  const daysSinceMonday = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  date.setDate(date.getDate() - daysSinceMonday);
  return formatLocalDay(date);
}

// Tells whether a text is a real calendar day ("YYYY-MM-DD" in local time).
function isRealDay(text) {
  if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return false;
  }
  return formatLocalDay(parseLocalDay(text)) === text;
}

// Reads the day of a session. Accepts current and legacy field names.
function sessionDay(session) {
  return session.fecha || session.date;
}

// Reads the minutes of a session. Accepts current and legacy field names.
function sessionMinutes(session) {
  const value = Number(session.minutos ?? session.minutes);
  return Number.isFinite(value) ? value : 0;
}

// Adds up the minutes of every day: { "YYYY-MM-DD": minutes }.
// Sessions with unreadable dates are skipped; stored data is never changed.
function minutesPerDay(sessions) {
  const total = {};
  sessions.forEach(function (session) {
    const day = sessionDay(session);
    if (!isRealDay(day)) {
      return;
    }
    total[day] = (total[day] || 0) + sessionMinutes(session);
  });
  return total;
}

// Maps daily minutes to an intensity level.
function levelForMinutes(minutes) {
  if (minutes >= 60) {
    return "intenso";
  }
  if (minutes >= 30) {
    return "medio";
  }
  if (minutes >= 1) {
    return "suave";
  }
  return "vacio";
}

// Adds up the minutes studied from the Monday of "today" to "today".
// Future and unreadable dates never count.
function weeklyMinutes(sessions, today) {
  const monday = mondayOfWeek(today);
  const minutes = minutesPerDay(sessions);
  let total = 0;
  Object.keys(minutes).forEach(function (day) {
    if (day >= monday && day <= today) {
      total = total + minutes[day];
    }
  });
  return total;
}

// Tells whether a value is a valid weekly goal: integer from 1 to 10080.
function isValidGoal(value) {
  return Number.isInteger(value) && value >= 1 && value <= 10080;
}

// Describes the goal state: { done, remaining }.
function goalStatus(minutes, goal) {
  if (minutes >= goal) {
    return { done: true, remaining: 0 };
  }
  return { done: false, remaining: goal - minutes };
}

// Builds one cell per day of the 12 weeks: { date, minutes, level }.
// Days after "today" are marked "futuro" instead of a level,
// even when they hold sessions.
function heatmapData(sessions, today) {
  const minutes = minutesPerDay(sessions);
  return weekWindow(today).map(function (date) {
    if (date > today) {
      return { date: date, minutes: 0, level: "futuro" };
    }
    const dayMinutes = minutes[date] || 0;
    return { date: date, minutes: dayMinutes, level: levelForMinutes(dayMinutes) };
  });
}

// Returns the 84 days ("YYYY-MM-DD") of the 12 natural weeks
// (current week plus the 11 previous ones), Monday to Sunday.
function weekWindow(today) {
  const start = parseLocalDay(mondayOfWeek(today));
  start.setDate(start.getDate() - 77); // back 11 full weeks
  const days = [];
  for (let i = 0; i < 84; i++) {
    days.push(formatLocalDay(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
}
