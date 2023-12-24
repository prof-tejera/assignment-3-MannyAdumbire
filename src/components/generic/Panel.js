import React from "react";
import TimerInput from "./TimerInput";
import Button from "./Button";

const Panel = ({  buttons, children }) => {
  return (
    <span className="timer-panel">
      <span className="timer-actions">
        {buttons &&
          buttons.map((bType, idx) => (
            <Button
              key={`button-${idx}`}
              type={bType.type}
              onClick={bType.onClick}
              label={bType.label}
              id = {`button-${bType.type}`}
            />
          ))}
      </span>
    </span>
  );
};

export default Panel;
