import React, { useEffect, useContext } from "react";
import styled from "styled-components";

import * as ws from "../WorkoutStyles";
import Button from "../components/generic/Button";
import { WorkoutContext } from "../WorkoutContext.js";
import TimerTotalDisplay from "../components/generic/TimerTotalDisplay.js";
import TimersPanel from "../components/generic/TimersPanel.js";

const Timers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: white;
`;

const WorkoutView = (children) => {
  const { timers, options, workoutFns } = useContext(WorkoutContext);

  // Reset on load.
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    workoutFns.setMode("reset");
  };

  const handleFastForward = () => {
    workoutFns.nextTimer();
  };

  // Start/Stop.
  function handleStartStop() {
    console.log(options);
    workoutFns.setMode(options.mode === "running" ? "stopped" : "running");
  }

  const buttonTypes = [
    {
      type: options.mode === "running" ? "stop" : "start",
      label: options.mode === "running" ? "⏹ STOP" : "▶ START",
      color: options.mode === "running" ? "darkred" : "darkgreen",
      hover: options.mode === "running" ? "red" : "green",
      onClick: handleStartStop,
    },
    {
      type: "fast-forward",
      onClick: handleFastForward,
      label: "⏭ NEXT",
      color: "darkgoldenrod",
      hover: "gold",
    },
    { type: "reset", onClick: handleReset, label: "♻ RESET", hover: "gray" },
  ];
  return (
    <Timers>
      <TimerTotalDisplay title="Time Remaining: " subtractElapsed={true} />
      <ws.Container className="timer-inputs">
        {buttonTypes.map((btn, idx) => (
          <Button key={`btn-${idx}`} {...btn} />
        ))}
      </ws.Container>
      <TimersPanel hideCancelBtn={true} hideSwapBtn={true} timers={timers} />
    </Timers>
  );
};

export default WorkoutView;
