import React from "react";
import styled,{css} from "styled-components";
import * as ws from "../../WorkoutStyles";


const TimerDisplayWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-weight: bold;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0.2rem;
  span {
    font-size: 1rem;
  padding: 0rem 0.2rem;
  }
    ${(props) => props.status === "completed" && 
    css`
     & p, & span {
      color:grey;
      text-decoration: line-through;
    `}
`;

const TimerDisplayTime = styled(ws.Container)`
    font-size: 1.5rem;
    color: gray;
    ${(props) => props.status === "running" && 
    css`
      color:lime;
    font-size: xx-large;
    `}
    ${(props) => props.status === "completed" && 
    css`
      color:grey;
      text-decoration: line-through;
    `}
    ${(props) => props.status === "resting" && 
    css`
      color:yellow;
    font-size: xx-large;
    `}
`;

const TimerDisplay = (props) => {
  const roundTimers = ["xy", "tabata"];
  const isRoundTimer = roundTimers.includes(props.type);
  return (
      <TimerDisplayWrap>
      <TimerDisplayTime status={props.status}>
        {props.mins}:{props.secs}
      </TimerDisplayTime>
      <p>{props.type}</p>
        {" "}
        <span>
          {isRoundTimer &&
            (props.status === "resting"
              ? "Rest"
              : `Round #${props.round} of ${props.roundsTotal}`)}
        </span>
    </TimerDisplayWrap>
  );
};

export default TimerDisplay;
