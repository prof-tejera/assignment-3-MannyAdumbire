import React, { useEffect, useState, useRef } from "react";

export const WorkoutContext = React.createContext();

// Alphanumeric characters to use for the timer property or value.
const alphanumeric =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 *  Keeping readable URL for debug
 *  values not encoding/serializing.
 */
// mapping each timer property or string value to shorter unique strings.
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

  // use a map to keep the same order of the timers.
  const [timersMap, setTimersMap] = useState(timersM || new Map());
  // The timers URL param.
  const [tmrsParam, setTmrsParam] = useState(initialTmrsParam);
  // Id of the active timer running.
  const [activeTimer, setActiveTimer] = useState(false);
  // States "ready", "running", "stopped", "reset
  const [mode, setMode] = useState("reset");
  const didInit = useRef(false);

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
  if (!didInit.current) {
    // Convert the timers URL param to a Map.
    if (tmrsParam) {
      const retrievedUrlTimers = new Map();
      // Remove the # at the beginning of the hash.
      let workoutStr = tmrsParam.replace("#", "");
      // Decompress the URL param.
      workoutStr = expandTimerPropVal(workoutStr);
      let tmrsP = workoutStr.split("&");
      tmrsP.forEach((tmrP) => {
        // Skip empty strings.
        if (!tmrP) {
          return;
        }
        // ***Important*** need to maintain exact order of properties for saving/restoring timers to/from URL.
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
        // Add missing properties,
        timerObj.maxWorkRestTime = 0;
        timerObj.totalElapsedMs = 0;
        timerObj.isEditing = false;
        // Use numeric ids for the Map.
        retrievedUrlTimers.set(timerId, timerObj);
        // TODO why addTimer() ^ caused infinit loop?
      });
      setTimersMap(retrievedUrlTimers);
    }
    didInit.current = true;
  }
  // Recalculate relevant states & options whenever timersMap changes.
  useEffect(() => {
    // Update the URL when the timersMap changes.
    updateTimersUrlParam(timersMap);
    tagFirstLastTimers();
    resetActiveTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timersMap]);

  // Update the URL to match the tmrsParam.
  useEffect(() => {
    window.location.hash = tmrsParam;
  }, [tmrsParam, setTmrsParam]);
  /**
   * @param {Object} options
   * @param {Map} options.timersMap - for accessing timer directly by id.
   * @param {boolean} options.isRunning - Whether the workout is running.
   * @param {string} options.activeTimer - The id of the active timer.
   * @param {number} options.secondsTotal - set time on all timers totalled.
   * @param {number} options.secondsLeft - time left on all timers totalled.
   */
  const [options, setOptions] = useState({
    mode: mode,
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
    setMode,
    addTimer,
    removeTimer,
    swapTimers,
    nextTimer,
    getTotalTime,
    getTotalTimeLeft,
    totalsSetter: null,
  };

  const workoutProps = {
    workout,
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
      stopTimers();
    } else if (mode === "reset") {
      resetWorkout();
    }

    // Set timers to "stopped" or "completed" , depending on the timer mode.
    function stopTimers() {
      for (let [, timer] of timersMap.entries()) {
        // stop any timers that are running.
        if (timer.status === "running") {
          timer.status = "stopped";
        }
        if (mode === "reset") {
          timer.status = "reset";
          timer.totalElapsedMs = 0;
        }
        timer.isEditing = false;
      }
      setTimersMap(new Map(timersMap));
    }

    function resetWorkout() {
      // Reset all timers to "stopped" so that "completed" timers will also be reset.
      stopTimers();
      setMode("stopped");
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

  // Logic to add( or edit) a timer and update the total times.
  function addTimer(timer) {
    const newTimersMap = new Map(timersMap);
    // Set the active timer if there isn't one already.
    (activeTimer && timersMap.get(activeTimer)) || resetActiveTimer();
    // Edit existing timer or add a new one.
    const timerId = timer.timerId || makeTimerId();
    timer.timerId = timerId;
    timer.maxWorkRestTime = 0;
    timer.totalElapsedMs = 0;
    timer.isEditing = false;
    newTimersMap.set(timerId, timer);
    // Update the timers.
    setTimersMap(newTimersMap);
    setWorkout({
      ...workout,
      mode: mode,
      options: options,
      timers: newTimersMap,
    });
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
  // Tag first and last timers.
  function tagFirstLastTimers() {
    let firstTimer = false;
    let lastTimer = false;
    for (let [id, timer] of timersMap) {
      // Reset the first and last timers.
      timer.isLast = false;
      timer.isFirst = false;
      if (!firstTimer) {
        firstTimer = timer.isFirst = true;
      }
      lastTimer = id;
    }
    if (lastTimer) {
      timersMap.get(lastTimer).isLast = true;
    }
  }

  // Calculate totals for the timers.
  function getTotalTime() {
    // Tally the total time.
    let total = 0;
    const timersIterator = timersMap.entries();
    for (let [, value] of timersIterator) {
      total +=
      value.roundsTotal *(
        value.secondsPerRound +
        value.minutesPerRound * 60 +
        value.secondsRest +
        value.minutesRest * 60);
    }
    return total;
  }

  // Totals for timers that have not yet completed.
  function getTotalTimeLeft() {
    const total = getTotalTime();
    if ("reset" === mode) {
      return total;
    }
    // tally the total time left.
    let elapsed = 0;
    const timersIterator = timersMap.entries();
    for (let [, value] of timersIterator) {
      // Add the time left in the rounds that have not yet started.
      if ("completed" !== value.status) {
        elapsed += value.totalElapsedMs / 1000;
        break;
      } else {
        elapsed +=
          value.secondsPerRound +
          value.minutesPerRound * 60 +
          value.secondsRest +
          value.minutesRest * 60;
      }
      // Add the time left in the current round.
    }
    return total - elapsed;
  }

  // Move to the next timer.
  function nextTimer() {
    if (activeTimer === null || timersMap.size === 0) {
      setMode("reset");
      return;
    }
    let timersIterator = timersMap.entries();
    // Rely on the order of the timers in the Map
    for (let [key, value] of timersIterator) {
      // Mark each timer as completed, until we reach the active timer.
      value.status = "completed";
      nextTimer.isPrevCompleted = true;
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

  /**
   * Swap the timer with the given id with the timer before or after it.
   *
   * @param {*} timerId - the id of the timer to move.
   * @param {*} isForwardSwap  - if true, move the timer before the timer with the given id, otherwise move it after.
   * @returns
   */
  function swapTimers(timerId, isForwardSwap = true) {
    if (!timerId || !timersMap.size) {
      return;
    }
    let iterator = timersMap.entries();
    // Find the first and last timers.
    const firstTimer = iterator.next().value[0];
    // swapTimerKey to replace.
    let keyToSwap = false;
    let lastTimer = false;
    for (const [key] of iterator) {
      lastTimer = key;
    }
    // Can't move the first timer before itself or move the last timer forward.
    if (isForwardSwap ? lastTimer === timerId : firstTimer === timerId) {
      return;
    }
    const newMap = new Map();
    // Set timer to move.
    keyToSwap =
      (isForwardSwap && getNextKey(timersMap, timerId)) ||
      getPrevKey(timersMap, timerId);
    // Don't swap if the timer to swap is completed.
    if (timersMap.get(keyToSwap).status === "completed") {
      return;
    }
    if (!keyToSwap) {
      return;
    }
    iterator = timersMap.entries();
    const isfirst = timersMap.get(timerId).isFirst;
    for (const [key, value] of iterator) {
      // The first timer won't have a previous timer to swap with.
      if (isfirst && key === timerId) {
        const nextTimer = iterator.next().value;
        if (keyToSwap === nextTimer[0]) {
          newMap.set(keyToSwap, timersMap.get(keyToSwap));
          newMap.set(key, value);
          setTimersMap(newMap);
          continue;
        }
      }
      // Skip the timer to move if this is a forward swap.
      if (keyToSwap === key) {
        newMap.set(timerId, timersMap.get(timerId));
        // Don't double add timers.
        continue;
      } else if (timerId === key) {
        newMap.set(keyToSwap, timersMap.get(keyToSwap));
        continue;
      }
      newMap.set(key, value);
    }
    setTimersMap(newMap);
  }

  // remove a timer by id.
  function removeTimer(timerId) {
    // account for removed active timer.
    if (activeTimer === timerId) {
      nextTimer();
    }
    let hasIncompleteTimers = false;
    // if no more timers, reset the workout.
    for (let [, timer] of timersMap.entries()) {
      if (timer.status !== "completed") {
        hasIncompleteTimers = true;
      }
    }
    // remove the timer.
    timersMap.delete(timerId);
    const newTimersMap = new Map(timersMap);
    // save updated state.
    setTimersMap(newTimersMap);
    if (!hasIncompleteTimers) {
      setMode("reset");
    }
  }

  function getNextKey(map, currentKey) {
    let foundCurrentKey = false;

    for (const key of map.keys()) {
      if (foundCurrentKey) {
        return key; // Return the next key
      }
      if (key === currentKey) {
        foundCurrentKey = true;
      }
    }
    return null; // Current key not found or it's the last key
  }
  function getPrevKey(map, currentKey) {
    let previousKey = null;
    for (const key of map.keys()) {
      if (key === currentKey) {
        return previousKey; // Return the previous key
      }

      previousKey = key;
    }

    return null; // Current key not found or it's the first key
  }

  return (
    <WorkoutContext.Provider value={workoutProps}>
      {children}
    </WorkoutContext.Provider>
  );
};
