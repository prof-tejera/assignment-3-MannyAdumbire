// WorkoutContext.js
import React, { useCallback, useEffect, useState } from "react";

export const WorkoutContext = React.createContext();

const WorkoutContextWrap = ({ children }) => {
  // use a map
  const [timersMap, setTimersMap] = useState(new Map());
  // Id of the active timer.
  const [activeTimer, setActiveTimer] = useState(null);
  const [secondsTotal, setSecondsTotal] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // States "ready", "running", "stopped", "reset
  const [mode, setMode] = useState("stopped");

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
    timersMap: new Map(),
    timersObj: new Map(),
  });
  const [workout, setWorkout] = useState({
    mode: mode,
    options: options,
    timers: timersMap,
  });
  const workoutFns = { addTimer, removeTimer, nextTimer, setMode };

  const workoutProps = {
    workout,
    setWorkout,
    options,
    timers: timersMap,
    workoutFns,
    addTimer,
  };

  useEffect(() => {
    if (mode === "running") {
      setIsRunning(true);
      // If the timer is missing, replace it.
      if (!activeTimer) {
        // if (!undefined) { // TODO - This causes error that is difficult to pinpoint
        setActiveTimer(timersMap.entries().next().value);
      }
    } else if (mode === "stopped") {
      setIsRunning(false);
    } else if (mode === "reset") {
      setIsRunning(false);
      resetWorkout();
    }
    function resetWorkout() {
      setMode("stopped");
      timersMap.forEach((timer) => {
        timer.mode = "stopped";
      });
      // setSecondsLeft(getRemainingTime(timersMap));
      setSecondsTotal(getTotalTimerTime(timersMap));
      // set first timer in queue as active timer or null if none.
      setActiveTimer(
        !!timersMap.keys().next().value ? timersMap.keys().next().value : null
      );
    }
  }, [mode, activeTimer, setIsRunning, timersMap]);

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
    // Set the active timer if there isn't one already & recalculate the total time.
    setActiveTimer(activeTimer || timer.timerId);
    // Add the new time.
    newTimersMap.set(timer.timerId, timer);
    setTimersMap(newTimersMap);
    setWorkout({
      mode: mode,
      options: options,
      timers: newTimersMap,
      fns: { ...workout.fns },
    });
  }

  // Get the total time for all timers.
  function getTotalTimerTime(tmrs) {
    // Loop through the timers and add up the total time.
    let total = 0;
    tmrs.forEach((timer) => {
      total +=
        (timer.minutesPerRound * 60 + timer.secondsPerRound) *
          timer.roundsTotal +
        (timer.minutesRest * 60 + timer.secondsRest) * timer.roundsTotal;
    });
    return total;
  }

  function getRemainingTime() {
    // Get the total time for all timers that aren't completed.
    // Loop through the timers and add up the total time.
    let total = 0;
    const timersIterator = timersMap.entries();
    for (let [key, value] of timersIterator) {
      if (value.mode !== "completed") {
        total +=
          (value.minutesPerRound * 60 + value.secondsPerRound) *
            value.roundsTotal +
          (value.minutesRest * 60 + value.secondsRest) * value.roundsTotal;
      }
    }
    return total;
  }
  // Move to the next timer.
  function nextTimer() {
    if (activeTimer === null) {
      setMode("reset");
    } else {
      let timersIterator = timersMap.entries();
      for (let [key, value] of timersIterator) {
        if (key === activeTimer) {
          const nextTimer = timersIterator.next().value;
          if (nextTimer) {
            value.mode = "completed";
            // If there is another timer, set it as the active timer.
            setActiveTimer(nextTimer[0]);
            return;
          } else {
            // No more timers, so reset.
            setMode("reset");
          }
        }
      }
      setTimersMap( new Map(timersMap));
    }
  }

  // remove a timer by id.
  function removeTimer(timerId) {
    timersMap.delete(timerId);
    // create a new Map to trigger rerender.
    setTimersMap(new Map(timersMap));
    // Update the total time.
    setSecondsTotal(getTotalTimerTime(timersMap));
  }

  return (
    <WorkoutContext.Provider value={workoutProps}>
      {children}
    </WorkoutContext.Provider>
  );
};
export default WorkoutContextWrap;
