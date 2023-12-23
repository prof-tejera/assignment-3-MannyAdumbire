import React from "react";
import styled from "styled-components";
import * as ws from "../../WorkoutStyles";

const TimerInputs = styled(ws.Container)`
  display: flex;
  flex-direction: column-reverse;
  cursor: pointer;
`;
const TimerInput = ({ label, value, onChangeFn, disabled, ...props }) => {
  const type = props.type || "number";
  const safeLabel = label.replace(/[^a-zA-Z]+/g, "").toLowerCase();
  const id = "timer-input-" + safeLabel;

  function handleChange(e) {
    if (props.type === "number") {
      onChangeFn(parseInt(e.target.value));
    } else {
      onChangeFn(e.target.value);
    }
  }
  // TODO fix onchange vs on Input, maxlength, minlength, size
  return (
    <TimerInputs disabled={disabled}>
      <props.C
        {...props}
        disabled={disabled}
        type={type}
        className="timer-input"
        name={id}
        id={id}
        value={value || ""}
        onChange={onChangeFn ? handleChange : undefined}
      />
      <ws.TimerLabel disabled={disabled} htmlFor={id}>
        {label}
      </ws.TimerLabel>
    </TimerInputs>
  );
};

export default TimerInput;
