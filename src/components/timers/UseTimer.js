import { useState, useRef, useEffect, useContext } from "react";
import { TimerQueueContext } from "../../TimerQueueContext.js";
import * as h from "../../utils/helpers.js";

// Custom hook to manage the state of timer components.
export const useTimer = (timerId) => {
  const { timers, setSecondsLeft,status, getRemainingTime,activeTimer, isRunning, nextTimer } =
    useContext(TimerQueueContext);

    // Get the timer object that matches the timerId.
  const timer = timers.filter((t) => t.timerId === timerId)[0];

  // Props that should cause component rerender.
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundsTotal] = useState(timer?.roundsTotal || 1);
  const [minutesPerRound] = useState(timer?.minutesPerRound || 0);
  const [secondsPerRound] = useState(timer?.secondsPerRound || 0);
  const [minutesRest] = useState(timer?.minutesRest || 0);
  const [secondsRest] = useState(timer?.secondsRest || 0);
  const [secsLeft, setSecsLeft] = useState(
    h.secsFromMinsSecs(minutesPerRound, secondsPerRound) || 0
  );

  /**
   * Props that shouldn't cause rerender.
   */
  // Internal, high resolution, state of the timer.
  const msLeft = useRef(secsLeft * 1000 || 0);

  // The Intervals that progress the timer.
  const roundIntervalRef = useRef(null);

  // Logic for rounds.
  useEffect(() => {
    function resetTimer() {
      setSecsLeft(
        h.secsFromMinsSecs(minutesPerRound, secondsPerRound) || 0
      );
      setRoundNumber(1);
    }
    if(status === "reset") {
      resetTimer();
    }

    const timerFrequency = 250;
    const timerUpdateFactor = 4;
    // Set the above such that this comes out to 1 second.
    const msUpdateFrequency = timerFrequency * timerUpdateFactor;

    // If the timer isn't running
    if (!isRunning || activeTimer !== timerId) {
      // cleanup the Interval
      roundIntervalRef.current && clearInterval(roundIntervalRef.current);
      return;
    } else {
      if (timer.status === "ready") {
        timer.status = "running";
      }
      // setup new Interval.
      roundIntervalRef.current = setInterval(() => {
        if (!roundNumber) {
          setRoundNumber(1);
        }
        if (!msLeft.current) {
          // get the total number of ms for the round.
          msLeft.current = h.msFromMinsSecs(minutesPerRound, secondsPerRound);
        }
        msLeft.current -= timerFrequency;
        // Update the displayed time left.
        console.info(msLeft.current);
        if (msLeft.current >= timerFrequency) {
          // Only cause a rerender on the update frequency, and on the last "tick".
          if (msLeft.current % msUpdateFrequency === 0) {
            setSecsLeft(msLeft.current / 1000);
          }
        } else {
          // Are there still rounds left?
          if (roundNumber < roundsTotal) {
            // Is there a rest period?
            if ((minutesRest || secondsRest) && "resting" !== timer.status) {
              // Initiate the rest period.
              setSecsLeft(h.secsFromMinsSecs(minutesRest, secondsRest));
              msLeft.current = h.msFromMinsSecs(minutesRest, secondsRest);
              timer.status = "resting";
            } else {
              // Go to the next round.
              setRoundNumber((prev) => prev + 1);
              msLeft.current = h.msFromMinsSecs(
                minutesPerRound,
                secondsPerRound
              );
              timer.status = "running";
              timer.status = "running";
            }
          } else {
            // No more rounds left.
            timer.status = "complete";
            nextTimer();
            setSecondsLeft(getRemainingTime(timers));
            resetTimer();
          }
        }
      }, timerFrequency);
    }
    return () => {
      // cleanup the Interval.
      if (roundIntervalRef.current) {
        clearInterval(roundIntervalRef.current);
      }
    };
  }, [
    setSecondsLeft,
    timer,
    timers,
    isRunning,
    roundNumber,
    minutesPerRound,
    secondsPerRound,
    minutesRest,
    secondsRest,
    roundsTotal,
    timerId,
    nextTimer,
    status,
    activeTimer,
    getRemainingTime
  ]);

  return {
    status: timer.status,
    secsLeft: secsLeft,
    isrunning: isRunning,
    roundNumber: roundNumber,
  };
};
