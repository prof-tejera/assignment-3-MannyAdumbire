import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import * as ws from "../WorkoutStyles.js";

// Contexts.
import { WorkoutContext } from "../WorkoutContext.js";

// Styled components.
import TimerTotalDisplay from "../components/generic/TimerTotalDisplay.js";
import TimerInput from "../components/generic/TimerInput.js";
import TimerTypeSelect from "../components/generic/TimerTypeSelect.js";
import TimersPanel from "../components/generic/TimersPanel.js";

const EditTimersWrap = styled(ws.Container)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 0;
`;

const Instruction = styled("strong")`
  font-size: x-large;
  ${(props) =>
    props.isEdit &&
    css`
      animation: blink 1s infinite;
      border: solid 1px green;
    `}
`;

const restTimers = ["tabata"];
const roundsTimers = ["xy", "tabata"];

/**
 * Manage inputs logic & UI for editing each Timer's props
 */
export const WorkoutEdit = () => {
  const { timers, workoutFns } = useContext(WorkoutContext);
  const [timerToEditId, setTimerIdToEditId] = useState(false);
  const timerToEdit = timers.get(timerToEditId);

  // Start with empty to display only the times.
  const timerType = useRef("");
  // Track what's currently entered in the timer inputs.
  const [minutesPerRound, setMinutesPerRound] = useState(
    timerToEdit?.minutesPerRound || 0
  );
  const [secondsPerRound, setSecondsPerRound] = useState(
    timerToEdit?.secondsPerRound || 0
  );
  const [roundsTotal, setRoundsTotal] = useState(timerToEdit?.roundsTotal || 1);
  const [minutesRest, setMinutesRest] = useState(timerToEdit?.minutesRest || 0);
  const [secondsRest, setSecondsRest] = useState(timerToEdit?.secondsRest || 0);
  const [description, setDescription] = useState(
    timerToEdit?.description || ""
  );

  // Track which timer types are valid/enabled based on the current input values.
  let enabledTimerTypes = [];

  // Update all the inputs when the user clicks to edit a timer.
  useEffect(() => {
    if (timerToEdit) {
      timerType.current = timerToEdit.type;
      setMinutesPerRound(timerToEdit.minutesPerRound);
      setSecondsPerRound(timerToEdit.secondsPerRound);
      setRoundsTotal(timerToEdit.roundsTotal);
      setMinutesRest(timerToEdit.minutesRest);
      setSecondsRest(timerToEdit.secondsRest);
      setDescription(timerToEdit.description);
    }
  }, [timerToEdit]);

  // Reset the workout to clear the timers.
  useEffect(() => {
    workoutFns.setMode("reset");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    workoutFns.updateTotalTime();
  }, [workoutFns, timers]);

  const timerTypeOptions = [
    {
      label: "Timer Type",
      value: timerType.current,
      options: enabledTimerTypes,
      onChangeFn: (type) => {
        timerType.current = type.toLowerCase();
        addTimer();
      },
      type: "select",
    },
  ];
  // add a new timer the user's input values to the queue.
  function addTimer() {
    if (timerType) {
      const type = timerType.current.toLowerCase();
      // ***Important*** need to maintain exact order of properties for saving/restoring timers to/from URL.
      workoutFns.addTimer({
        timerId: timerToEditId || null,
        type: type,
        status: "stopped",
        secondsPerRound: secondsPerRound || 0,
        minutesPerRound: minutesPerRound || 0,
        roundsTotal: roundsTimers.includes(type) ? roundsTotal : 1,
        secondsRest: restTimers.includes(type) ? secondsRest : 0,
        minutesRest: restTimers.includes(type) ? minutesRest : 0,
        description: description,
        isEditing: false,
      });
    } else {
      console.error(`Invalid timerType: ${timerType}`);
    }
    // Clear the Edit Timer
    setTimerIdToEditId(false);
  }
  if (secondsPerRound || minutesPerRound) {
    // Determine which timer types are available based on the current input values.
    enabledTimerTypes.push("Stopwatch", "Countdown", "XY", "Tabata");
  } else if (secondsRest || minutesRest) {
    enabledTimerTypes.push("Tabata");
  }

  const timerInputs = [
    {
      label: "Mins",
      value: minutesPerRound,
      onChangeFn: setMinutesPerRound,
      type: "number",
      min: "0",
    },
    {
      label: "Secs",
      value: secondsPerRound,
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
    <EditTimersWrap>
      <ws.Container>
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
        {!enabledTimerTypes.length ? (
          <Instruction>👈 SET timer length </Instruction>
        ) : (
          ""
        )}
        {timerToEdit && (
          <Instruction>
            {" "}
            👈 EDIT timer({timerToEdit.timerId}){" "}
          </Instruction>
        )}
      </ws.Container>
      <ws.Container style={{ flexDirection: "row" }}>
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
        {enabledTimerTypes.length && !timerToEdit ? (
          <Instruction>👈 ADD new timer</Instruction>
        ) : (
          ""
        )}
        {enabledTimerTypes.length && timerToEdit ? (
          <Instruction isEdit={true}>
            {" "}
            👈 CONFIRM timer type{" "}
          </Instruction>
        ) : (
          ""
        )}
      </ws.Container>
      <TimerTotalDisplay title="Total Workout Time: " subtractElapsed={false} />
      <TimersPanel timers={timers} editTimerIdSetter={setTimerIdToEditId} />
    </EditTimersWrap>
  );
};
