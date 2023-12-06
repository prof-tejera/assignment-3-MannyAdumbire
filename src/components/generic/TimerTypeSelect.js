import React from "react";
import * as ws from "../../WorkoutStyles";
import styled, { css } from "styled-components";

const TimerType = styled(ws.Button)`
  &.selected {
    background-color: white;
  }
  &:hover {
    border: 2px solid white;
  }
  ${(props) =>
    props.selected &&
    css`
      background-color: white;
      color: black;
    `}
  &:hover {
    background-color: white;
    color: black;
  }
`;
const TimerOptionsSelect = ({
  label,
  options,
  selected,
  propSetter,
  disabled,
  ...props
}) => {
  function handleChange(e) {
    propSetter(e.target.textContent);
  }

  const safeLabel = label.replace(/[^a-zA-Z]+/g, "").toLowerCase();

  // className="timer-input timer-select-option"
  return (
    <ws.TimerInputGroup>
      {options.map((optionValue, idx) => (
        <TimerType
          key={`option-${idx}`}
          hover="white"
          onClick={handleChange}
          id={`${safeLabel}-${optionValue}`}
          {...(optionValue === selected && { selected: "" })}
        >
          {optionValue}
        </TimerType>
      ))}
    </ws.TimerInputGroup>
  );
};

export default TimerOptionsSelect;
