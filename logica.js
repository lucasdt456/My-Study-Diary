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
