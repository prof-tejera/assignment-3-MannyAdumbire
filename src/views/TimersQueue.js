import React, { createContext, useContext, useState } from "react";
import styled from "styled-components";

import { TimerQueueContext } from "../TimerQueueContext.js";
import TimerInput from "../components/generic/TimerInput";
import Panel from "../components/generic/Panel";
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import Button from "../components/generic/Button";

const Timers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Timer = styled.div`
  border: 1px solid gray;
  padding: 20px;
  margin: 10px;
  font-size: 1.5rem;
`;
const TimerTitle = styled.div``;

const TIMER_TYPES = {
  Stopwatch: Stopwatch,
  Countdown: Countdown,
  XY: XY,
  Tabata: Tabata,
};

const TimerQueue = () => {
  // Start with an empty array of the timers that will comprise the workout.
  const { timers, stats, pushTimer, popTimer } = useContext(TimerQueueContext);
  const [timerType, setTimerType] = useState("Stopwatch");

  // Track what's currently entered in the timer inputs.
  const [minutesPerRound, setMinutesPerRound] = useState(0);
  const [secondsPerRound, setSecondsPerRound] = useState(0);
  const [minutesRest, setMinutesRest] = useState(0);
  const [secondsRest, setSecondsRest] = useState(0);
  const [roundsTotal, setRoundsTotal] = useState(1);

  const removeTimer = (index) => {
    popTimer(index);
  };
  function AddTimer() {
    // add a new timer to the queue using the current values.
    pushTimer({
      id: 'timer-'+Date.now(),
      C: TIMER_TYPES[timerType],
      mins: 0 || minutesPerRound,
      secs: 0 || secondsPerRound,
      minsRest: 0 || minutesRest,
      secsRest: 0 || secondsRest,
      running: false,
    });
  }

  function handleTimerType(e) {
    setTimerType( e.target.value);
  }

  const timerInputs = [
    {
      label: "Mins",
      value: minutesPerRound,
      propSetter: setMinutesPerRound,
      type: "number",
    },
    {
      label: "Secs",
      value: secondsPerRound,
      propSetter: setSecondsPerRound,
      type: "number",
    },
    {
      label: "Rounds",
      value: roundsTotal,
      propSetter: setRoundsTotal,
      disabled: ["Stopwatch", "Countdown"].includes(timerType),
      type: "number",
    },
    {
      label: "Rest(Mins)",
      value: minutesRest,
      propSetter: setMinutesRest,
      disabled: timerType !== "Tabata",
      type: "number",
    },
    {
      label: "Rest(Secs)",
      value: secondsRest,
      propSetter: setSecondsRest,
      disabled: timerType !== "Tabata",
      type: "number",
    },
  ];


  return (
    <div>
      <div className="timer-inputs">
          <select value={timerType} onChange={handleTimerType}>
          <option value="Stopwatch">Stopwatch</option>
          <option value="Countdown">Countdown</option>
          <option value="XY">XY</option>
          <option value="Tabata">Tabata</option>
        </select>
        {timerInputs.map((timer, idx) => (
          <TimerInput
            {...timer}
            key={`timer-${idx}`}
            label={timer.label}
            value={timer.value}
            propSetter={timer.propSetter}
            disabled={timer.disabled}
          ></TimerInput>
        ))}
      </div>

      <Button type="add" label="Add Timer" onClick={AddTimer} />
      <p> Total Time: {stats.totalTime}</p>
      {timers.map((timer) => (
        <Timer key={`timer-${timer.id}`}>
          <TimerTitle>{timer.title}</TimerTitle>
          {
            < timer.C
              id={timer.id}
              type={timer.C.toLowerCase}
              running={timer.running}
              mins={timer.mins}
              secs={timer.secs}
              minsRest={timer.minsRest}
              secsRest={timer.secsRest}
            />
          }
        </Timer>
      ))}
    </div>
  );
};
export default TimerQueue;