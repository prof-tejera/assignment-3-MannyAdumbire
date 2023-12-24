/**
 * Custom hook to manage the state of timer components.
 */
import { useState, useRef, useEffect, useContext } from "react";
import { WorkoutContext } from "../../WorkoutContext.js";
import * as h from "../../utils/helpers.js";

const restTimers = ["tabata"];

// Custom hook to manage the state of timer components.
export const useTimer = (timerId) => {
  const { timers, mode, workoutFns, options } = useContext(WorkoutContext);

  // Get the timer object that matches the timerId.
  const timer = timers.get(timerId);

  // Timer logic Props that sometimes cause component rerender.
  const [secondsPerRound, setSecondsPerRound] = useState(timer?.secondsPerRound || 0);
  const [minutesPerRound, setMinutesPerRound] = useState(timer?.minutesPerRound || 0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundsTotal, setRoundsTotal] = useState(timer?.roundsTotal || 1);
  const [secondsRest, setSecondsRest] = useState(timer?.secondsRest || 0);
  const [minutesRest, setMinutesRest] = useState(timer?.minutesRest || 0);
  // The time left in the current round in seconds
  const [secsLeftRound, setSecsLeftRound] = useState(
    h.secsFromMinsSecs(minutesPerRound, secondsPerRound) || 0
  );

  /**
   * Props that shouldn't cause rerender.
   */
  // Internal, high resolution, state of the timer.
  const msLeft = useRef(secsLeftRound * 1000 || 0);

  // The Intervals that progress the timer.
  const roundIntervalRef = useRef(null);

  // update the matched timer object when timer state changes.
  useEffect(() => {
    if (timers.get(timerId)) {
      if (
        "running" === options.mode ||
        !timer.roundNumber ||
        !timer.secsLeftRound
      ) {
        timer.roundNumber = roundNumber;
        timer.secsLeftRound = secsLeftRound;
      }
    }
  }, [timer, timers, timerId, secsLeftRound, options, roundNumber]);

  //Sync the timer state with the timer object user-editable props.
  useEffect(() => {
    if (timer) {
      setSecondsPerRound(timer.secondsPerRound);
      setMinutesPerRound(timer.minutesPerRound);  
      setRoundsTotal(timer.roundsTotal);
      setSecondsRest(timer.secondsRest)
      setMinutesRest(timer.minutesRest);
      const roundTime = h.secsFromMinsSecs(timer.minutesPerRound, timer.secondsPerRound);
      setSecsLeftRound(roundTime);
    }
  }, [timers, timer]);

  // manage the total time left and timer time left.
  useEffect(() => {
    // sync secsLeftRound with the timer object.
    if (!!workoutFns.totalsSetter) {
      // Recalculate the total time left.
      workoutFns.totalsSetter(workoutFns.getTotalTimeLeft());
    }
  }, [secsLeftRound, workoutFns, timer]);

  // Logic for rounds.
  useEffect(() => {
    // Reset timer to initial state.
    function resetTimer() {
      // Calculate the max time this timer can run.
      if (roundsTotal) {
        timer.maxWorkRestTime =
          (secondsPerRound + minutesPerRound * 60) * roundsTotal;
        if (restTimers.includes(timer.type)) {
          timer.maxWorkRestTime += secondsRest;
        }
      }
      setSecsLeftRound(
        h.secsFromMinsSecs(minutesPerRound, secondsPerRound) || 0
      );
      msLeft.current = h.msFromMinsSecs(minutesPerRound, secondsPerRound);
      setRoundNumber(1);
    }
    function completeTimer() {
      timer.status = "completed";
      workoutFns.nextTimer();
      resetTimer();
    }

    const timerFrequency = 250;
    const timerUpdateFactor = 4;
    // Set the above such that this comes out to 1 second.
    const msUpdateFrequency = timerFrequency * timerUpdateFactor;

    // If the timer isn't running
    switch (options.mode) {
      case "stopped":
        // Only run for the active timer.

        if ("running" === timer.status) {
          timer.status = "stopped";
        }
        // cleanup the Interval
        roundIntervalRef.current && clearInterval(roundIntervalRef.current);
        return;
      case "running":
        // Only run for the active timer.
        if (timerId !== options.activeTimer) {
          return;
        } else {
          if (timer.status !== "completed") {
            // Set the timer status to match the workout mode.
            timer.status = "running";
            roundIntervalRef.current = setInterval(() => {
              if (!roundNumber) {
                setRoundNumber(1);
              }
              if (!msLeft.current) {
                // get the total number of ms for the round.
                msLeft.current = h.msFromMinsSecs(
                  minutesPerRound,
                  secondsPerRound
                );
              }
              // Reduce the ms left by the timer frequency.
              msLeft.current -= timerFrequency;
              timer.totalElapsedMs += timerFrequency;
              // console.info(msLeft.current);
              if (msLeft.current > 0) {
                // Only cause a rerender on the update frequency, and on the last "tick".
                if (msLeft.current % msUpdateFrequency === 0) {
                  setSecsLeftRound(msLeft.current / 1000);
                }
              } else {
                // The timer has run out.
                if (msLeft.current === 0) {
                  setSecsLeftRound(0);
                }
                // Are there still rounds left?
                if (roundNumber <= roundsTotal) {
                  const isLastRound = roundNumber === roundsTotal;
                  // only rest if we are not already resting & there is a rest period.
                  const isRestRound =
                    "resting" !== timer.status &&
                    !!(minutesRest || secondsRest);
                  // Is there a rest period or this the last round of tabata.
                  if (
                    (isRestRound && !isLastRound) ||
                    (timer.type === "tabata" && isLastRound && isRestRound)
                  ) {
                    // Initiate the rest period.
                    timer.status = "resting";
                    setSecsLeftRound(
                      h.secsFromMinsSecs(minutesRest, secondsRest)
                    );
                    msLeft.current = h.msFromMinsSecs(minutesRest, secondsRest);
                    return;
                  } else if (!isLastRound && !isRestRound) {
                    // Go to the next work round.
                    timer.status = "running";
                    setRoundNumber((prev) => prev + 1);
                    msLeft.current = h.msFromMinsSecs(
                      minutesPerRound,
                      secondsPerRound
                    );
                  } else {
                    // onto the next timer.
                    completeTimer();
                  }
                }
              }
            }, timerFrequency);
          }
        }
        break;
      case "reset":
        resetTimer();
        break;
      default:
        return;
    }
    return () => {
      // cleanup the Interval.
      if (roundIntervalRef.current) {
        clearInterval(roundIntervalRef.current);
      }
    };
    // TODO what does it mean to have a function in a dependency array?
  }, [
    timer,
    timers,
    options,
    mode,
    workoutFns,
    roundNumber,
    secondsPerRound,
    minutesPerRound,
    roundsTotal,
    secondsRest,
    minutesRest,
    timerId,
  ]);

  return {
    status: timer.status,
    secsLeftRound: secsLeftRound,
    isrunning: options.isRunning,
    roundNumber: roundNumber,
  };
};
