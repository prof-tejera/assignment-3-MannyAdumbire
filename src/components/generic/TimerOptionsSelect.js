import React from "react";
import * as ws from "../../WorkoutStyles";

const TimerOptionsSelect = ({
  label,
  options,
  selected,
  propSetter,
  disabled,
  ...props
}) => {
  const disabledAttr = disabled ? { disabled: true } : {};

  function handleChange(e) {
    // If the value is a number, convert it to a number otherwise leave it as a string.
    if (Number(e.target.value) == e.target.value) {
      propSetter(parseInt(e.target.value));
    } else {
      propSetter(e.target.value);
    }
  }

  const safeLabel = label.replace(/[^a-zA-Z]+/g, "").toLowerCase();

  return (
    <ws.TimerInputGroup >
      <ws.TimerLabel htmlFor={safeLabel}>{label}</ws.TimerLabel>
      <select
        {...disabledAttr}
        onChange={handleChange}
        id={safeLabel}
        name={safeLabel}
        className="timer-input timer-select-option"
      >
        {options.map((optionValue, idx) => (
          <option
            key={`option-${idx}`}
            id={`${safeLabel}-${optionValue}`}
            value={optionValue}
            {...(optionValue === selected && { selected: "" })}
          >
            {optionValue}
          </option>
        ))}
      </select>
    </ws.TimerInputGroup>
  );
};

export default TimerOptionsSelect;
