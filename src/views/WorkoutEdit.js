import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
  align-items: center;
  flex-grow: 0;
`;

const Help = styled(ws.Container)`
  white-space: pre-wrap;
  font-size: x-large;
  display: flex;
  flex: 1 0 auto;
  width: 100%;
  span {
    ${ws.helpblink}
  }
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
  // If the timer to edit isn't found, clear it
  if(!timerToEdit && timerToEditId) {
    setTimerIdToEditId(false);
  }

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
    workoutFns.getTotalTime();
  }, [workoutFns, timers]);

  // add a new timer with the current selected options to the queue.
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

  // The options for the timer type select.
  const timerTypeOptions = [
    {
      label: "Timer Type",
      type: "select",
      value: timerType.current,
      options: enabledTimerTypes,
      onChangeFn: (type) => {
        timerType.current = type.toLowerCase();
        addTimer();
      },
      isEdit: !!timerToEditId,
      currentType: timerToEdit?.type,
    },
  ];
  const timerInputs = [
    {
      C: ws.TimerTextArea,
      label: "Note",
      value: description,
      onChangeFn: setDescription,
      type: "text",
      minlength: "40",
    },
    {
      C: ws.TimerInputBox,
      label: "Mins",
      value: minutesPerRound,
      onChangeFn: setMinutesPerRound,
      type: "number",
      min: "0",
      isEdit: enabledTimerTypes.length < 4,
    },
    {
      C: ws.TimerInputBox,
      label: "Secs",
      value: secondsPerRound,
      onChangeFn: setSecondsPerRound,
      min: "0",
      max: "59",
      type: "number",
      isEdit: enabledTimerTypes.length < 4,
    },
    {
      C: ws.TimerInputBox,
      label: "Rounds",
      value: roundsTotal,
      onChangeFn: setRoundsTotal,
      disabled: ["Stopwatch", "Countdown"].includes(timerType.current),
      type: "number",
      min: "1",
    },
    {
      C: ws.TimerInputBox,
      label: "Rest(Mins)",
      value: minutesRest,
      onChangeFn: setMinutesRest,
      min: "0",
      type: "number",
      isEdit: enabledTimerTypes < 1,
    },
    {
      C: ws.TimerInputBox,
      label: "Rest(Secs)",
      value: secondsRest,
      onChangeFn: setSecondsRest,
      min: "0",
      max: "59",
      type: "number",
      isEdit: enabledTimerTypes < 1,
    },
  ];
  return (
    <EditTimersWrap>
      <TimerTotalDisplay title="Workout Length: " subtractElapsed={false} />
      <ws.Container>
        {timerInputs.map((timertype, idx) => (
          <TimerInput
            C={timertype.type}
            key={`option-${idx}`}
            label={timertype.label}
            hover="silver"
            value={timertype.value}
            onChangeFn={timertype.onChangeFn}
            disabled={timertype.disabled}
            {...timertype}
          />
        ))}
        {!enabledTimerTypes.length ? (
          <Help isEdit={true}>
            <span>👈 </span>EDIT timer
          </Help>
        ) : (
          ""
        )}
        {timerToEdit && (
          <Help>
            <span>👈</span>EDIT {timerToEdit && `#${timerToEdit.timerId}`}
      {/* {timerToEdit && <Timer style={{ transform: .2 }} {...timerToEdit} />} */}
          </Help>
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
            timerId={timerToEditId}
            onChangeFn={option.onChangeFn}
            disabled={option.disabled}
            options={option.options}
            {...option}
          />
        ))}
        {enabledTimerTypes.length && !timerToEdit ? (
          <Help isEdit={!timers.size} title="Add a new timer">
            <span>👈</span> ADD new
          </Help>
        ) : (
          ""
        )}
        {enabledTimerTypes.length && timerToEdit ? (
          <Help title="CONFIRM type to update">
            <span>👈</span> SAVE{" "}
            {timerToEdit ? (
              <>{`#${timerToEdit.timerId}`}</>
            ) : (
              ""
            )}
          </Help>
        ) : (
          ""
        )}
      </ws.Container>
      <TimersPanel canEdit={true} timers={timers} editTimerIdSetter={setTimerIdToEditId} />
    </EditTimersWrap>
  );
};
