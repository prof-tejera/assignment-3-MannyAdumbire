import React, { useContext } from "react";
import styled, { css } from "styled-components";
import Timer from "../timers/Timer.js";
import * as ws from "../../WorkoutStyles";

// Contexts.
import { WorkoutContext } from "../../WorkoutContext.js";

// Styled components.
import Button from "./Button.js";

const StyledTimers = styled(ws.Container)`
  flex-direction: column;
  align-items: flex-start;
  ${(props) =>
    props.status === "completed" &&
    css`
      color: grey;
      text-decoration: line-through;
    `}
`;

const SwapButton = styled(ws.Button)`
  padding: 0rem;
  margin: 0rem;
  border: none;
  width: 16px;
  height: 16px;
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
            <ws.Container>
              <Button
                type="remove"
                label=""
                title="Remove Timer"
                img="❌"
                hover="lightcoral"
                onClick={() => workoutFns.removeTimer(timer.timerId)}
              />
            </ws.Container>
          )}
          {"running" !== options.mode && "completed" !== timer.status && (
            <ws.Container style={{ flexDirection: "column" }}>
              {timer.isFirst ||
                (!timer.isPrevCompleted && (
                  <SwapButton
                    type="swapprev"
                    label=""
                    title="Swap Previous"
                    img="⤴️"
                    onClick={() => workoutFns.swapTimers(timer.timerId, false)}
                  />
                ))}
              {!timer.isLast && (
                <SwapButton
                  type="swapnext"
                  label=""
                  title="Swap Next"
                  img="⤵️"
                  onClick={() => workoutFns.swapTimers(timer.timerId, true)}
                />
              )}
            </ws.Container>
          )}
          <Timer key={`timer-${id}`} {...timer} />
        </ws.Container>
      ))}
    </StyledTimers>
  );
};
export default TimersPanel;
