import React from "react";
import styled from "styled-components";
import * as ws from "../../WorkoutStyles";

const TimerInputs = styled(ws.Container)`
  display:flex;
  flex-direction: column-reverse;
  cursor: pointer;
`;
const TimerInput = ({ label, value, propSetter, disabled, ...props }) => {
  const type = props.type || "number";
  const safeLabel = label.replace(/[^a-zA-Z]+/g, "").toLowerCase();
  const id = "timer-input-" + safeLabel;

  function handleChange(e) {
    propSetter(parseInt(e.target.value));
  }
  return (
    <TimerInputs disabled={disabled}>
      <ws.TimerInputBox
        {...props}
        disabled={disabled}
        type={type}
        className="timer-input"
        name={id}
        id={id}
        value={value || ""}
        onChange={handleChange}
      />
      <ws.TimerLabel disabled={disabled} htmlFor={id}>
        {label}
      </ws.TimerLabel>
    </TimerInputs>
  );
};

export default TimerInput;
