// TimerQueueContext.js
import React, { useCallback, useEffect, useState } from "react";

export const TimerQueueContext = React.createContext();

const TimerQueueContextWrap = ({ children }) => {
  const [timers, setTimers] = useState([]);
  const [timersM, setTimersM] = useState(new Map());
  const [isRunning, setIsRunning] = useState(false);
  // States "ready", "running", "stopped", "reset
  const [status, setStatus] = useState("ready");
  // Id of the active timer.
  const [activeTimer, setActiveTimer] = useState(null);
  const [secondsTotal, setSecondsTotal] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const timerQ = {
    isRunning,
    getRemainingTime,
    setIsRunning,
    activeTimer,
    secondsTotal,
    secondsLeft,
    setSecondsLeft,
    timers,
    timersM,
    status,
    setStatus,
    nextTimer,
    addTimer,
    removeTimer,
  };

  useEffect(() => {
    if (status === "running") {
      setIsRunning(true);
      const timerM = timersM.get(activeTimer);
      // If the timer is missing, replace it.
      if (!activeTimer) {
        // if (!nonexistent) { // TODO - This causes error that is difficult to pinpoint
        setActiveTimer(timersM.entries().next().value);
      }
    } else if (status === "stopped") {
      setIsRunning(false);
    } else if (status === "reset") {
      setIsRunning(false);
      resetWorkout();
    }
    function resetWorkout() {
      setStatus("stopped");
      timersM.forEach((timer) => {
        timer.status = "ready";
      });
      // setSecondsLeft(getRemainingTime(timersM));
      setSecondsTotal(getTotalTimerTime(timersM));
      setActiveTimer(
        timersM.keys().next().value ? timersM.keys().next().value : null
      );
    }
  }, [status, activeTimer, setIsRunning, timersM]);

  // Logic to add a timer and update the total times.
  function addTimer(timer) {
    const newTimerMap = new Map(timersM);
    // Set the active timer if there isn't one already & recalculate the total time.
    setActiveTimer(activeTimer || timer.timerId);
    // Add the new time.
    newTimerMap.set(timer.timerId, timer);
    setTimersM(newTimerMap);
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
    const timersIterator = timersM.entries();
    for (let [key, value] of timersIterator) {
      if (value.status !== "completed") {
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
      setStatus("reset");
    } else {
      let timersIterator = timersM.entries();
      for (let [key, value] of timersIterator) {
        if (key === activeTimer) {
          const nextTimer = timersIterator.next().value;
          if (nextTimer) {
            value.status = "completed";
            // If there is another timer, set it as the active timer.
            setActiveTimer(nextTimer[0]);
            return;
          } else {
            // No more timers, so reset.
            setStatus("reset");
          }
        }
      }
      setTimers(timersM);
    }
  }

  // remove a timer by id.
  function removeTimer(timerId) {
    timersM.delete(timerId);
    setTimersM(timersM);
    // Update the total time.
    setSecondsTotal(getTotalTimerTime(timersM));
  }

  return (
    <TimerQueueContext.Provider value={timerQ}>
      {children}
    </TimerQueueContext.Provider>
  );
};
export default TimerQueueContextWrap;
