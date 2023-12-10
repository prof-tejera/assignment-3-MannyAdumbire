import React, { useContext } from "react";
import styled, { css } from "styled-components";
import * as ws from "../../WorkoutStyles";

// Contexts.
import { WorkoutContext } from "../../WorkoutContext.js";

// Styled components.
import Button from "./Button.js";

const StyledTimers = styled(ws.Container)`
  flex-direction: column;
  ${(props) =>
    props.status === "completed" &&
    css`
      color: grey;
      text-decoration: line-through;
    `}
`;

const TimersPanel = ({ timers, ...props }) => {
  const { workoutFns, options } = useContext(WorkoutContext);

  // const completedTimers = timers.filter((timer) => timer.status === "completed");
  // const notCompletedTimers = timers.filter(
  //   (timer) => timer.status !== "completed"
  // );

  const timersArr = Array.from(timers.entries());
  // Keep the current mode in sync with the parent component that passed it in.
  return (
    <StyledTimers {...props}>
      {/* TODO - This causes error that is difficult to pinpoint */}
      {/* {(()=>{ */}
      {/* })} */}
      {timersArr.map(([id, timer]) => (
        <ws.Container status={timer.status} key={`button-${id}`} {...props}>
          {/* add remove when not timer "running" */}
          {"running" !== options.mode && (
            <Button
              type="remove"
              label=""
              title="Remove Timer"
              img="❌"
              hover="lightcoral"
              onClick={() => workoutFns.removeTimer(timer.timerId)}
            />
          )}
          <timer.C key={`timer-${id}`} {...timer} />
        </ws.Container>
      ))}
    </StyledTimers>
  );
};
export default TimersPanel;
