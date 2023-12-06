import React, {  useContext, useState } from "react";
import styled from "styled-components";
import * as ws from "../WorkoutStyles.js";

// Contexts.
import { TimerQueueContext } from "../TimerQueueContext.js";

// Styled components.
import TimerTotalDisplay from "../components/generic/TimerTotalDisplay.js";
import TimerInput from "../components/generic/TimerInput.js";
import TimerTypeSelect from "../components/generic/TimerTypeSelect.js";
import Button from "../components/generic/Button.js";
import TimersPanel from "../components/generic/TimersPanel.js";

// Components for the different types of timers.
import Stopwatch from "../components/timers/Stopwatch.js";
import Countdown from "../components/timers/Countdown.js";
import XY from "../components/timers/XY.js";
import Tabata from "../components/timers/Tabata.js";

const WorkoutEditWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const timerComponents = {
  Stopwatch: Stopwatch,
  Countdown: Countdown,
  XY: XY,
  Tabata: Tabata,
};

const WorkoutEdit = () => {
  const { timers, secondsTotal, addTimer} =
    useContext(TimerQueueContext);
  // Start with empty to display only the times.
  const [timerType, setTimerType] = useState("");

  // Track what's currently entered in the timer inputs.
  const [minutesPerRound, setMinutesPerRound] = useState(0);
  const [secondsPerRound, setSecondsPerRound] = useState(0);
  const [minutesRest, setMinutesRest] = useState(0);
  const [secondsRest, setSecondsRest] = useState(0);
  const [roundsTotal, setRoundsTotal] = useState(1);

  // If this is less than 0, then show/hide some inputs.
  const timeInputCheck =
    secondsPerRound + minutesPerRound + secondsRest + minutesRest;

  function AddTimer() {
    // add a new timer to the queue using the current values.
    const restTimers = ["tabata"];
    if (timerType) {
      const type = timerType.toLowerCase();
      addTimer(
        {
        timerId: Date.now(),
        C: timerComponents[timerType],
        type: type,
        status: "ready",
        minutesPerRound: minutesPerRound,
        secondsPerRound: secondsPerRound,
        minutesRest: restTimers.includes(type) ? minutesRest : 0,
        secondsRest: restTimers.includes(type) ? secondsRest : 0,
        roundsTotal: roundsTotal || 1,
      }
      );
    } else {
      console.error(`Invalid timerType: ${timerType}`);
    }
  }
  const timerTypeOptions = [
    {
      label: "Timer Type",
      value: timerType,
      options: ["Stopwatch", "Countdown", "XY", "Tabata"],
      propSetter: setTimerType,
      type: "select",
    },
  ];
  const timerInputs = [
    {
      label: "Mins",
      value: minutesPerRound,
      // options: [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      propSetter: setMinutesPerRound,
      onClick: () => {
        setMinutesPerRound((mins) => {
          return (mins += 1);
        });
      },
      type: "number",
      min: "0",
    },
    {
      label: "Secs",
      value: secondsPerRound,
      // options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      propSetter: setSecondsPerRound,
      min: "0",
      max: "59",
      onClick: () => {
        setSecondsPerRound((secs) => {
          return (secs += 5);
        });
      },
      type: "number",
    },
    {
      label: "Rest(Mins)",
      value: minutesRest,
      // options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      propSetter: setMinutesRest,
      disabled: timerType !== "Tabata",
      min: "0",
      type: "number",
      onClick: () => {
        setMinutesRest((mins) => {
          return (mins += 1);
        });
      },
    },
    {
      label: "Rest(Secs)",
      value: secondsRest,
      // options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      propSetter: setSecondsRest,
      disabled: timerType !== "Tabata",
      min: "0",
      max: "59",
      type: "number",
      onClick: () => {
        setSecondsRest((secs) => {
          return (secs += 5);
        });
      },
    },
    {
      label: "Rounds",
      value: roundsTotal,
      propSetter: setRoundsTotal,
      disabled: ["Stopwatch", "Countdown"].includes(timerType),
      type: "number",
      min: "1",
      onClick: () => {
        setRoundsTotal((rounds) => {
          return (rounds += 1);
        });
      },
    },
  ];
  return (
    <WorkoutEditWrap>
      <ws.Container style={{ flexDirection: "column" }}>
        {timerType === "" && <strong>Choose A Timer</strong>}
        {timerTypeOptions.map((option, idx) => (
          <TimerTypeSelect
            key={`option-${idx}`}
            label={option.label}
            value={option.value}
            hover="silver"
            selected={timerType === option.value}
            propSetter={option.propSetter}
            disabled={option.disabled}
            options={option.options}
            {...option}
          />
        ))}
      </ws.Container>
      <ws.Container>
        {timerType &&
          timerInputs.map((timer, idx) => (
            <TimerInput
              key={`option-${idx}`}
              label={timer.label}
              hover="silver"
              value={timer.value}
              propSetter={timer.propSetter}
              disabled={timer.disabled}
              {...timer}
            />
          ))}
      </ws.Container>
      {timerType && timeInputCheck > 0 && (
        <ws.Container>
          <Button
            type="add"
            id="add-timer"
            label=""
            title="Add Timer"
            hover="lightgreen"
            color="green"
            disabled={timeInputCheck < 0}
            img={timerType ? `＋` : ""}
            onClick={AddTimer}
          ></Button>
          <span style={{ fontSize: "1rem" }}>Add {timerType}</span>
          <TimerTotalDisplay
            title="Total Workout Time: "
            seconds={secondsTotal}
          />
        </ws.Container>
      )}
      <TimersPanel timers={timers}  />
    </WorkoutEditWrap>
  );
};
export default WorkoutEdit;
