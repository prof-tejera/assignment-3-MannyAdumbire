import React, {  useEffect, useState } from "react";
import { useTimer } from "./UseTimer";
import TimerDisplay from "../generic/TimerDisplay";
import * as h from "../../utils/helpers.js";

const timerType = "stopwatch";

const Stopwatch = (props) => {
  // The displayed amount of time left in minutes & seconds.
  const [minutesShown, setMinutesShown] = useState("00");
  const [secondsShown, setSecondsShown] = useState("00");

  const { secsLeft, status } = useTimer(props.timerId);

  useEffect(() => {
    const mins = h.minsPartFromSecs(getPassedSeconds());
    const secs = h.secsPartFromSecs(getPassedSeconds());
    setSecondsShown(h.formatSeconds(secs));
    setMinutesShown(h.formatSeconds(mins));

    // Calculate elapsed seconds.
    function getPassedSeconds() {
      const totalSecsPerRound = h.secsFromMinsSecs(
        props.minutesPerRound,
        props.secondsPerRound
      );
      return totalSecsPerRound - secsLeft;
    }
  }, [props, secsLeft]);


  return (
    <TimerDisplay
      status={status}
      id={props.timerId}
      type={timerType}
      mins={minutesShown}
      secs={secondsShown}
    />
  );
};

export default Stopwatch;
