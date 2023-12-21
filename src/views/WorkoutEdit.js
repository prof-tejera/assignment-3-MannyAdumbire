import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as ws from "../WorkoutStyles.js";

// Contexts.
import { WorkoutContext } from "../WorkoutContext.js";

// Styled components.
import TimerTotalDisplay from "../components/generic/TimerTotalDisplay.js";
import TimerInput from "../components/generic/TimerInput.js";
import TimerTypeSelect from "../components/generic/TimerTypeSelect.js";
import Button from "../components/generic/Button.js";
import TimersPanel from "../components/generic/TimersPanel.js";

const WorkoutEditWrap = styled(ws.Container)`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
`;

const restTimers = ["tabata"];
const roundsTimers = ["xy", "tabata"];
const WorkoutEdit = () => {
  const { timers, workoutFns } = useContext(WorkoutContext);

  // Reset the workout to clear the timers.
  useEffect(() => {
    workoutFns.setMode("reset");
  }, []);
  // Start with empty to display only the times.
  const timerType = useRef("");

  // Track what's currently entered in the timer inputs.
  const [minutesPerRound, setMinutesPerRound] = useState(0);
  const [secondsPerRound, setSecondsPerRound] = useState(0);
  const [roundsTotal, setRoundsTotal] = useState(1);
  const [minutesRest, setMinutesRest] = useState(0);
  const [secondsRest, setSecondsRest] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    workoutFns.updateTotalTime();
  }, [workoutFns, timers]);
  // add a new timer the user's input values to the queue.
  function addTimer() {
    if (timerType) {
      const type = timerType.current.toLowerCase();
      // ***Important*** need to maintain exact order of properties for saving/restoring timers to/from URL.
      workoutFns.addTimer({
        timerId: null,
        type: type,
        status: "stopped",
        secondsPerRound: secondsPerRound || 0,
        minutesPerRound: minutesPerRound || 0,
        roundsTotal: roundsTimers.includes(type) ? roundsTotal : 1,
        secondsRest: restTimers.includes(type) ? secondsRest : 0,
        minutesRest: restTimers.includes(type) ? minutesRest : 0,
        description: description,
      });
    } else {
      console.error(`Invalid timerType: ${timerType}`);
    }
  }
  let timerOptions = [];
  if (secondsPerRound || minutesPerRound) {
    // Determine which timer types are available based on the current input values.
    timerOptions.push("Stopwatch", "Countdown", "XY", "Tabata");
  } else if (secondsRest || minutesRest) {
    timerOptions.push("Tabata");
  }

  const timerTypeOptions = [
    {
      label: "Timer Type",
      value: timerType.current,
      options: timerOptions,
      onChangeFn: (type) => {
        timerType.current = type.toLowerCase();
        addTimer();
      },
      type: "select",
    },
  ];
  const timerInputs = [
    {
      label: "Mins",
      value: minutesPerRound,
      // options: [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      onChangeFn: setMinutesPerRound,
      type: "number",
      min: "0",
    },
    {
      label: "Secs",
      value: secondsPerRound,
      // options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      onChangeFn: setSecondsPerRound,
      onClick: () => {
        setSecondsPerRound((secs) => {
          return (secs += 1);
        });
      },
      min: "0",
      max: "59",
      type: "number",
    },

    {
      label: "Rounds",
      value: roundsTotal,
      onChangeFn: setRoundsTotal,
      disabled: ["Stopwatch", "Countdown"].includes(timerType.current),
      type: "number",
      min: "1",
    },
    {
      label: "Rest(Mins)",
      value: minutesRest,
      onChangeFn: setMinutesRest,
      min: "0",
      type: "number",
    },
    {
      label: "Rest(Secs)",
      value: secondsRest,
      onChangeFn: setSecondsRest,
      onClick: () => {
        setSecondsRest((secs) => {
          return (secs += 1);
        });
      },
      min: "0",
      max: "59",
      type: "number",
    },
    {
      label: "Description",
      value: description,
      onChangeFn: setDescription,
      type: "text",
      maxlength: "30",
      minlength: "30",
      size: "30",
    },
  ];
  return (
    <WorkoutEditWrap>
      <ws.Container>
        {!timerOptions.length ? <strong> Set timer length 👉 </strong> : ""}
        {timerInputs.map((timer, idx) => (
          <TimerInput
            key={`option-${idx}`}
            label={timer.label}
            hover="silver"
            value={timer.value}
            onChangeFn={timer.onChangeFn}
            disabled={timer.disabled}
            {...timer}
          />
        ))}
      </ws.Container>
      <ws.Container style={{ flexDirection: "row" }}>
        {timerOptions.length ? <strong> Add timer 👉 </strong> : ""}
        {timerTypeOptions.map((option, idx) => (
          <TimerTypeSelect
            key={`option-${option.value}${idx}`}
            label={option.label}
            value={option.value}
            hover="silver"
            hide={option.hide}
            selected={timerType.current === option.value}
            onChangeFn={option.onChangeFn}
            disabled={option.disabled}
            options={option.options}
            {...option}
          />
        ))}
      </ws.Container>
      <TimerTotalDisplay title="Total Workout Time: " subtractElapsed={false} />
      <TimersPanel timers={timers} />
    </WorkoutEditWrap>
  );
};
export default WorkoutEdit;
