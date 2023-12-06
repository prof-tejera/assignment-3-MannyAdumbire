import React, { useEffect, useState } from "react";
import { useTimer } from "./UseTimer";
import TimerDisplay from "../generic/TimerDisplay";
import * as h from "../../utils/helpers.js";
import "../../Timer.css";

const timerType = "tabata";

const Tabata = (props) => {
  // The displayed amount of time left in minutes & seconds.
  const [minutesShown, setMinutesShown] = useState("00");
  const [secondsShown, setSecondsShown] = useState("00");

  const {
    status,
    secsLeft,
    roundNumber,
  } = useTimer(props.timerId);

  useEffect(() => {
    let secsPart = h.secsPartFromSecs(secsLeft);
    let minsPart = h.minsPartFromSecs(secsLeft);
    // Update displyed time left for round.
    setSecondsShown(h.formatSeconds(secsPart));
    setMinutesShown(h.formatSeconds(minsPart));
  }, [secsLeft]);

  
  return (
      <TimerDisplay
        id={props.timerId}
        type={timerType}
        status={status}
        mins={minutesShown}
        secs={secondsShown}
        round={roundNumber}
        roundsTotal={props.roundsTotal}
      />
  );
};

export default Tabata;
