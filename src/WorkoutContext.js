// WorkoutContext.js
import React, { useEffect, useState } from "react";

export const WorkoutContext = React.createContext();

// Alphanumeric characters to use for the timer property or value.
const alphanumeric =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// To keep url short, map each timer property or string value to shorter character.
const timerValParamMap = {
  completed: "cmp",
  running: "rng",
  stopped: "stp",
  reset: "rst",
  countdown: "ctd",
  stopwatch: "stw",
  xy: "xy",
  tabata: "tbt",
};

export const WorkoutContextWrap = ({ children, initialTmrsParam }) => {
  let timersM = new Map();

  // The timers URL param.
  const [tmrsParam, setTmrsParam] = useState(initialTmrsParam);
  // Convert the timers URL param to a Map.
  if (tmrsParam) {
    // Remove the # at the beginning of the hash.
    let workoutStr = tmrsParam.replace("#", "");
    // Decompress the URL param.
    workoutStr = expandTimerPropVal(workoutStr);
    let tmrsP = workoutStr.split("&");
    tmrsP.forEach((tmrP) => {
      if (!tmrP) {
        return;
      }
      let [
        timerId,
        type,
        status,
        secondsPerRound,
        minutesPerRound,
        roundsTotal,
        secondsRest,
        minutesRest,
        description,
      ] = tmrP.split(",");
      const timerObj = {};
      timerObj.timerId = timerId;
      timerObj.type = type;
      timerObj.status = status;
      timerObj.secondsPerRound = Number(secondsPerRound);
      timerObj.minutesPerRound = Number(minutesPerRound);
      timerObj.roundsTotal = Number(roundsTotal);
      timerObj.secondsRest = Number(secondsRest);
      timerObj.minutesRest = Number(minutesRest);
      timerObj.description = unsanitizeDescription(description);
      // Use numeric ids for the Map.
      timersM.set(timerId, timerObj);
    });
  }

  // use a map
  const [timersMap, setTimersMap] = useState(timersM || new Map());
  // Id of the active timer.
  const [activeTimer, setActiveTimer] = useState(null);
  // States "ready", "running", "stopped", "reset
  const [mode, setMode] = useState("stopped");
  // The max total time of all timers.
  const [totalTime, setTotalTime] = useState(0);

  /**
   * @param {Map} tmrsMap map of timers to update the URL with.
   */
  function updateTimersUrlParam(tmrsMap) {
    if (!tmrsMap || !tmrsMap.size) {
      return;
    }
    let tmrs = getTimersUrlParam(tmrsMap);
    // Compress the URL param.
    tmrs = shortenTimerPropVal(tmrs);
    setTmrsParam("#" + tmrs);
  }
  useEffect(() => {
    updateTimersUrlParam(timersMap);
  });
  // Update the URL to match the tmrsParam.
  useEffect(() => {
    window.location.hash = tmrsParam;
  }, [tmrsParam, setTmrsParam]);
  /**
   * @param {Object} options
   * @param {Map} options.timersMap - for accessing timer directly by id.
   * @param {Object} options.timersObj - for timers persistence(JSON).
   * @param {boolean} options.isRunning - Whether the workout is running.
   * @param {string} options.activeTimer - The id of the active timer.
   * @param {number} options.secondsTotal - set time on all timers totalled.
   * @param {number} options.secondsLeft - time left on all timers totalled.
   */
  const [options, setOptions] = useState({
    timersObj: {},
    isRunning: false,
    activeTimer: null,
    secondsTotal: 0,
    secondsLeft: 0,
  });
  const [workout, setWorkout] = useState({
    mode: mode,
    options: options,
    timers: timersMap,
  });
  const workoutFns = {
    addTimer,
    removeTimer,
    nextTimer,
    setMode,
    getTotalTime,
  };

  const workoutProps = {
    workout,
    setWorkout,
    options,
    timers: timersMap,
    workoutFns,
    addTimer,
    tmrsParam,
  };

  useEffect(() => {
    if (mode === "running") {
      // If active timer is missing/deleted, replace it.
      if (!activeTimer || !timersMap.has(activeTimer)) {
        resetActiveTimer();
      }
    } else if (mode === "stopped") {
      stopAllTimers();
    } else if (mode === "reset") {
      resetWorkout();
    }
    function stopAllTimers() {
      for (let [, timer] of timersMap.entries()) {
        // stop any timers that are running.
        timer.status === "running" && (timer.status = "stopped");
        // if this is a reset, stop any timers that are completed.
        mode === "reset" &&
          timer.status === "completed" &&
          (timer.status = "stopped");
      }
      setTimersMap(new Map(timersMap));
    }

    function resetWorkout() {
      // Reset all timers to "stopped" so that "completed" timers will also be reset.
      setMode("stopped");
      stopAllTimers();
      resetActiveTimer();
    }
    // if (!undefined)  // TODO - causes error that is difficult to pinpoint
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Keep the options in sync with mode.
  useEffect(() => {
    options.mode = mode;
    options.activeTimer = activeTimer;
    setOptions({ ...options });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, activeTimer]);

  // Set update the status of the active timer to match the workout mode.
  useEffect(() => {
    const timerM = timersMap.get(activeTimer);
    if (timerM) {
      timerM.status = mode;
      setTimersMap(new Map(timersMap));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimer]);

  // Logic to add a timer and update the total times.
  function addTimer(timer) {
    const newTimersMap = new Map(timersMap);
    // Set the active timer if there isn't one already.
    (activeTimer && timersMap.get(activeTimer)) || resetActiveTimer();
    // Add the new time.
    timer.timerId = makeTimerId();
    newTimersMap.set(timer.timerId, timer);
    setTimersMap(newTimersMap);
    setWorkout({
      mode: mode,
      options: options,
      timers: newTimersMap,
      fns: { ...workout.fns },
    });
    // Update the URL with the new timer.
    updateTimersUrlParam(newTimersMap);
  }

  function makeTimerId() {
    const idLength = 3;
    let id = "";
    // Make a random id.
    for (let i = 0; i < idLength; i++) {
      id += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    // If the id is already in use, try again.
    if (timersMap.has(id)) {
      return makeTimerId();
    } else {
      return id;
    }
  }

  // Get a timers URL param from the timers Map.
  function getTimersUrlParam(newTmrsMap) {
    // If no timers, return empty string.
    let paramParts = "";
    for (let [, timer] of newTmrsMap.entries()) {
      // ***Important*** need to maintain exact order of properties for saving/restoring timers to/from URL.
      const [
        timerId,
        type,
        status,
        secondsPerRound,
        minutesPerRound,
        roundsTotal,
        secondsRest,
        minutesRest,
        description,
      ] = Object.values(timer);
      paramParts +=
        timerId +
        "," +
        type +
        "," +
        status +
        "," +
        secondsPerRound +
        "," +
        minutesPerRound +
        "," +
        roundsTotal +
        "," +
        secondsRest +
        "," +
        minutesRest +
        "," +
        sanitizeDescription(description) +
        "&";
    }

    paramParts = shortenTimerPropVal(paramParts);
    return `${paramParts}`;
  }

  // Shorten a string by replacing the timer property or value with a shorter character.
  function shortenTimerPropVal(str) {
    for (let prop in timerValParamMap) {
      str = str.replaceAll(prop, timerValParamMap[prop]);
    }
    return str;
  }
  // Expand a string by replacing the shorter character with the timer property or value.
  function expandTimerPropVal(str) {
    for (let prop in timerValParamMap) {
      str = str.replaceAll(timerValParamMap[prop], prop);
    }
    return str;
  }
  // // Make the description safe for URL.
  function sanitizeDescription(str) {
    // make url safe,
    return encodeURIComponent(str);
  }
  // Decode the description.
  function unsanitizeDescription(str) {
    return decodeURIComponent(str);
  }

  // Reset the active timer to the first timer in the queue that isn't completed.
  function resetActiveTimer() {
    for (let [id, timer] of timersMap) {
      if (timer.status !== "completed") {
        setActiveTimer(id);
        break;
      }
    }
  }

  /**
   * Calculate totals for the timers.
   *
   * @param {boolean} subtractElapsed If true, only add up the time for timers that have not yet completed.
   * @returns
   */
  function getTotalTime(subtractElapsed = false) {
    // Loop through the timers and add up the total time.
    let total = 0;
    const timersIterator = timersMap.entries();
    for (let [, value] of timersIterator) {
      total += value.roundsTotal * (
        value.minutesPerRound * 60 +
          value.secondsPerRound +
          value.minutesRest * 60 +
          value.secondsRest
      );
    }
    return total;
  }
  function getTotalTimeLeft() {
    // Loop through the timers and add up the total time.
    let total = 0;
    const timersIterator = timersMap.entries();
    for (let [, value] of timersIterator) {
      if (value.status !== "completed") {
        total +=
          value.roundsTotal *
          (value.minutesPerRound * 60 +
            value.secondsPerRound +
            value.minutesRest * 60 +
            value.secondsRest);
      }
    }
    return total;
  }

  // Move to the next timer.
  function nextTimer() {
    if (activeTimer === null || timersMap.size === 0) {
      setMode("reset");
      return;
    }
    let timersIterator = timersMap.entries();
    for (let [key, value] of timersIterator) {
      value.status = "completed";
      if (key === activeTimer) {
        const nextTimer = timersIterator.next().value;
        if (nextTimer) {
          // If there is another timer, set it as the active timer.
          setActiveTimer(nextTimer[0]);
          return;
        } else {
          // No "next" timers left.
          setMode("reset");
        }
      }
    }
  }

  // remove a timer by id.
  function removeTimer(timerId) {
    // account for removed active timer.
    if (activeTimer === timerId) {
      nextTimer();
    }
    let hasUncompletedTimers = false;
    // if no more timers, reset the workout.
    for (let [, timer] of timersMap.entries()) {
      if (timer.status !== "completed") {
        hasUncompletedTimers = true;
      }
    }
    // remove the timer.
    timersMap.delete(timerId);
    const newTimersMap = new Map(timersMap);
    // save updated state.
    setTimersMap(newTimersMap);
    if (!hasUncompletedTimers) {
      setMode("reset");
    }
    // Update the URL with the new timer.
    updateTimersUrlParam(newTimersMap);
  }

  return (
    <WorkoutContext.Provider value={workoutProps}>
      {children}
    </WorkoutContext.Provider>
  );
};
