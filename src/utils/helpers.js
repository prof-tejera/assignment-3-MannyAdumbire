// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

// get the remainder seconds after counting out the whole minutes.
export function secsPartFromSecs(seconds) {
  return seconds % 60;
}

// Format the time display.
export function formatSeconds(time) {
  time = time < 10 ? `0${time}` : time;
  return time;
}

// get seconds difference between two dates.
export function getMsDiff(startDate, endDate) {
  return endDate.getTime() - startDate.getTime();
}

// get the total number of seconds from minutes and seconds.
export function secsFromMinsSecs(minutes, seconds) {
  return minutes * 60 + seconds;
}

export function minsFromSecs(seconds) {
  return Math.trunc(seconds / 60);
}

// get the total number of minutes from seconds.
export function minsPartFromMs(ms) {
  return Math.trunc(ms / 1000 / 60);
}

// get the total number of seconds from seconds.
export function secsPartFromMs(ms) {
  return Math.trunc(ms / 1000 % 60);
}

// Get the minutes part from seconds.
export function minsPartFromSecs(secs) {
  return Math.trunc(secs / 60);
}

// Get milliseconds from minutes and seconds.
export function msFromMinsSecs(minutes, seconds) {
  return (minutes * 60 + seconds) * 1000;
}

// Get minutes and seconds from milliseconds.
export function minsSecsFromMs(ms) {
  return [ minsPartFromMs(ms), secsPartFromMs(ms) ];
}
// Get minutes and seconds from milliseconds.
export function minsSecsFromSecs(secs) {
  secs = secs * 1000;
  return [ minsPartFromMs(secs), secsPartFromMs(secs) ];
}
