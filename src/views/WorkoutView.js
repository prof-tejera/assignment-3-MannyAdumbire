import React, { useContext} from "react";
import styled from "styled-components";

import * as ws from "../WorkoutStyles";
import Button from "../components/generic/Button";
import { TimerQueueContext } from "../TimerQueueContext";
import TimerTotalDisplay from "../components/generic/TimerTotalDisplay.js";
import TimersPanel from "../components/generic/TimersPanel.js";

const Timers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: white;
`;


const WorkoutView = (children) => {
  const { timers, secondsLeft, setStatus, nextTimer, isRunning} =
    useContext(TimerQueueContext);

  const handleReset = () => {
    setStatus("reset");
  };

  const handleFastForward = () => {
    nextTimer();
  };

  // Start/Stop.
  function handleStartStop() {
    setStatus(isRunning ? "stopped" : "running");
  }

  const buttonTypes = [
    {
      type: isRunning ? "stop" : "start",
      label: isRunning ? "⏹ STOP" : "▶ START",
      color: isRunning ? "darkred" : "darkgreen",
      hover: isRunning ? "red" : "green",
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
      <ws.Container className="timer-inputs">
        {buttonTypes.map((btn, idx) => (
          <Button key={`btn-${idx}`} {...btn} />
        ))}
      </ws.Container>
      <TimerTotalDisplay title="Time Left: " seconds={secondsLeft} />
      <TimersPanel timers={timers} />
    </Timers>
  );
};

export default WorkoutView;
