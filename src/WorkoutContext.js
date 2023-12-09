// WorkoutContext.js
import React, { useCallback, useEffect, useState } from "react";

export const WorkoutContext = React.createContext();

const WorkoutContextWrap = ({ children }) => {
  // Id of the active timer.
  const [timersMap, setTimersMap] = useState(new Map());
  const [activeTimer, setActiveTimer] = useState(null);
  const [secondsTotal, setSecondsTotal] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // States "ready", "running", "stopped", "reset
  const [mode, setMode] = useState("stopped");
  const [options, setOptions] = useState({
    isRunning: false,
    activeTimer: null,
    secondsTotal: 0,
    secondsLeft: 0,
    timersMap: new Map(),
  });
  const [workout, setWorkout] = useState({
    mode: mode,
    options: options,
    timers: timersMap,
  });
  const workoutFns = { addTimer, removeTimer, nextTimer, setMode};

  const workoutProps = {  
    workout,
    setWorkout,
    options,
    timers: timersMap,
    workoutFns,
    addTimer,
  }
  // Keep the options in sync with mode.
  useEffect(() => {
    options.mode = mode;
    setOptions(options);
  }, [options, mode]);

  useEffect(() => {
    if (mode === "running") {
      setIsRunning(true);
      const timerMap = timersMap.get(activeTimer);
      // If the timer is missing, replace it.
      if (!activeTimer) {
        // if (!nonexistent) { // TODO - This causes error that is difficult to pinpoint
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
        timer.mode = "ready";
      });
      // setSecondsLeft(getRemainingTime(timersMap));
      setSecondsTotal(getTotalTimerTime(timersMap));
      setActiveTimer(
        timersMap.keys().next().value ? timersMap.keys().next().value : null
      );
    }
  }, [mode, activeTimer, setIsRunning, timersMap]);

  // Logic to add a timer and update the total times.
  function addTimer(timer) {
    const newTimersMap = new Map(timersMap);
    // Set the active timer if there isn't one already & recalculate the total time.
    setActiveTimer(activeTimer || timer.timerId);
    // Add the new time.
    newTimersMap.set(timer.timerId, timer);
    setTimersMap(newTimersMap);
    setWorkout({ mode: mode, options: options, timers: newTimersMap, fns: {...workout.fns} });  
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
      setTimersMap(timersMap);
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
