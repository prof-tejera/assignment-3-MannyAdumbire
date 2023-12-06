import React, { useEffect, useState } from "react";
import { useTimer } from "./UseTimer";
import TimerDisplay from "../generic/TimerDisplay.js";
import * as h from "../../utils/helpers.js";


const CountDown = (props) => {

  

  // The displayed amount of time left in minutes & seconds.
  const [minutesShown, setMinutesShown] = useState("00");
  const [secondsShown, setSecondsShown] = useState("00");

  const { secsLeft, status } = useTimer(props.timerId);

  useEffect(() => {
    let secsPart = h.secsPartFromSecs(secsLeft);
    let minsPart = h.minsPartFromSecs(secsLeft);
    // Update displyed time left for round.
    setSecondsShown(h.formatSeconds(secsPart));
    setMinutesShown(h.formatSeconds(minsPart));
  }, [secsLeft]);

  return (
    <TimerDisplay
      status={status}
      id={props.timerId}
      type={props.type}
      mins={minutesShown}
      secs={secondsShown}
    />
  );
};

export default CountDown;
