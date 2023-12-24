import React from "react";
import * as ws from "../../WorkoutStyles";
import styled, { css } from "styled-components";

const TimerType = styled(ws.Button)`
  font-size: x-large;
  &.selected {
    background-color: white;
  }
  ${(props) =>
    props.disabledTypes.includes(props.value) &&
    css`
      visibility: hidden;
      pointer-events: none;
    `}
  ${(props) =>
    props.selected &&
    css`
      border: solid 1px green;
      ${ws.helpblink}
    `}
  :hover::before {
    content: "⏰";
  }
  ${(props) =>
    props.timerId &&
    css`
      :hover::before {
        content: "💾";
      }
    `};
`;

// Manage the UI for selecting a timer type.
const TimerOptionsSelect = ({
  label,
  options,
  selected,
  onChangeFn,
  disabled,
  isEdit,
  currentType,
  timerId,
  disabledTypes,
  ...props
}) => {
  function handleChange(e) {
    onChangeFn(e.target.textContent);
  }

  const safeLabel = label.replace(/[^a-zA-Z]+/g, "").toLowerCase();

  return (
    <ws.TimerInputGroup currentType={currentType}>
      {options.map((optionValue, idx) => (
        <TimerType
          key={`${optionValue}`}
          hover="lightgreen"
          onClick={handleChange}
          id={`${safeLabel}-${optionValue}`}
          timerId={timerId || false}
          selected={ currentType === optionValue.toLowerCase() }
          disabledTypes={disabledTypes}
          value={optionValue}
          {...(currentType === optionValue.toLowerCase && { selected: "" })}
        >
          {optionValue}
        </TimerType>
      ))}
    </ws.TimerInputGroup>
  );
};

export default TimerOptionsSelect;
