import React, { useContext } from "react";
import styled,{css} from "styled-components";
import * as ws from "../../WorkoutStyles";

// Contexts.
import { TimerQueueContext } from "../../TimerQueueContext.js";

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
  const { removeTimer } = useContext(TimerQueueContext);

  // const completedTimers = timers.filter((timer) => timer.status === "completed");
  // const notCompletedTimers = timers.filter(
  //   (timer) => timer.status !== "completed"
  // );  

  // Keep the current mode in sync with the parent component that passed it in.
  return (
    
    <StyledTimers {...props}>
      {timers.map((timer, idx) => (
        <ws.Container status={timer.status} key={`button-${idx}`} {...props}>
          <Button
            type="remove"
            label=""
            title="Remove Timer"
            img="❌"
            hover="lightcoral"
            onClick={() => removeTimer(timer.timerId)}
          />
          <timer.C key={`timer-${idx}`} {...timer} />
        </ws.Container>
      ))}
    </StyledTimers>
  );
};
export default TimersPanel;
