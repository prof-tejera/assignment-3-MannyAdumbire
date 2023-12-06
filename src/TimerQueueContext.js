// TimerQueueContext.js
import React, { useEffect, useState } from "react";

export const TimerQueueContext = React.createContext();

const TimerQueueContextWrap = ({ children }) => {
  const [timers, setTimers] = useState([]);
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
    status,
    setStatus,
    nextTimer,
    addTimer,
    removeTimer,
  };

  useEffect(() => {
    if (status === "running") {
      setIsRunning(true);
      const timer = timers.filter((t) => t.timerId === activeTimer)[0];
      // If the timer is missing, replace it.
      if (!timer) {
        setActiveTimer(timers[0]?.timerId);
      }
    } else if (status === "stopped") {
      setIsRunning(false);
    } else if (status === "reset") {
      setIsRunning(false);
      resetWorkout();
    }
    function resetWorkout() {
      setStatus("stopped");
      timers.forEach((timer) => {
        timer.status = "ready";
      });
      setSecondsLeft(getRemainingTime(timers));
      setSecondsTotal(getTotalTimerTime(timers));
      setActiveTimer(timers[0] ? timers[0].timerId : null);
    }
  }, [status, timers, activeTimer, setIsRunning]);

  // Logic to add a timer and update the total times.
  function addTimer(timer) {
    setTimers((tmrs) => {
      const updatedTimers = [...tmrs, timer];
      setSecondsLeft(getRemainingTime(updatedTimers));
      setSecondsTotal(getTotalTimerTime(updatedTimers));
      return updatedTimers;
    });
    // Set the active timer if there isn't one already & recalculate the total time.
    setActiveTimer(activeTimer || timer.timerId);
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

  // Get the total time for all timers that aren't completed.
  function getRemainingTime(tmrs) {
    // Loop through the timers and add up the total time.
    let total = 0;
    tmrs.forEach((timer) => {
      if (timer.status !== "completed") {
        total +=
          (timer.minutesPerRound * 60 + timer.secondsPerRound) *
            timer.roundsTotal +
          (timer.minutesRest * 60 + timer.secondsRest) * timer.roundsTotal;
      }
    });
    return total;
  }

  // Move to the next timer.
  function nextTimer() {
    if (activeTimer === null) {
      setStatus("reset");
    } else {
      let updatedTimers = timers.map((timer, idx) => {
        if (timer.timerId === activeTimer) {
          timer.status = "completed";
          if (timers[idx + 1]) {
            setActiveTimer(timers[idx + 1].timerId);
          } else {
            setStatus("reset");
          }
        }
        return timer;
      });
      setTimers(updatedTimers);
    }
  }

  // remove a timer by id.
  function removeTimer(timerId) {
    setTimers(timers.filter((t) => t.timerId !== timerId));
    // Update the total time.
    setSecondsTotal(getTotalTimerTime(timers));
  }

  return (
    <TimerQueueContext.Provider value={timerQ}>
      {children}
    </TimerQueueContext.Provider>
  );
};
export default TimerQueueContextWrap;
