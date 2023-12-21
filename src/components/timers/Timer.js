import React, { useEffect, useState } from "react";
import { useTimer } from "./UseTimer.js";
import TimerDisplay from "../generic/TimerDisplay.js";
import * as h from "../../utils/helpers.js";

const restTimers = ["tabata"];
const roundsTimers = ["xy", "tabata"];


const Timer = (props) => {
  // The displayed amount of time left in minutes & seconds.
  const [minutesShown, setMinutesShown] = useState("00");
  const [secondsShown, setSecondsShown] = useState("00");

  const { status, secsLeftRound, roundNumber } = useTimer(props.timerId);

  const isRoundTimer = roundsTimers.includes(props.type);
  const isRestTimer = restTimers.includes(props.type);

  // Update the displayed time left, based on the timer type.
  useEffect(() => {
    let secsPart;
    let minsPart;
    if ("stopwatch" !== props.type) {
      // Stop watch shows passed time.
      secsPart = h.secsPartFromSecs(getPassedSeconds());
      minsPart = h.minsPartFromSecs(getPassedSeconds());
    } else {
      // Other timers show time left.
      secsPart = h.secsPartFromSecs(secsLeftRound);
      minsPart = h.minsPartFromSecs(secsLeftRound);
    }
    // Update displyed time left for round.
    setSecondsShown(h.formatSeconds(secsPart));
    setMinutesShown(h.formatSeconds(minsPart));
    // Calculate elapsed seconds.
    function getPassedSeconds() {
      const totalSecsPerRound = h.secsFromMinsSecs(
        props.minutesPerRound,
        props.secondsPerRound
      );
      return totalSecsPerRound - secsLeftRound;
    }
  }, [secsLeftRound, props.minutesPerRound, props.secondsPerRound, props.type]);

  return (
    <TimerDisplay
      id={props.timerId}
      type={props.type}
      status={status}
      mins={minutesShown}
      secs={secondsShown}
      round={roundNumber}
      roundsTotal={props.roundsTotal}
      description={props.description}
      isRoundTimer={isRoundTimer}
      isRestTimer={isRestTimer}
    />
  );
};

export default Timer;
