import React from "react";
import styled, { css } from "styled-components";
import * as ws from "../../WorkoutStyles";

const TimerDisplayWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-weight: bold;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0.2rem;
  :hover {
    border: solid 1px white;
  }
  span {
    font-size: 1rem;
    padding: 0rem 0.2rem;
    &.description {
      font-size: small;
      color: gray;
      font-weight: normal;
    }
  }
  ${(props) =>
    props.status === "completed" &&
    css`
      & p,
      & span {
        color: grey;
        text-decoration: line-through;
      }
    `}
  ${(props) =>
    ["running","resting"].includes(props.status)  &&
    css`
      & p,
      & span {
        font-size: 2rem;
      }
    `}
`;

const TimerDisplayTime = styled(ws.Container)`
  font-size: 1.5rem;
  color: gray;
  ${(props) =>
    ["running","resting"].includes(props.status) &&
    css`
      color: lime;
      font-size: 5rem;
    `}
  ${(props) =>
    props.status === "completed" &&
    css`
      color: grey;
      text-decoration: line-through;
    `}
    ${(props) =>
    props.status === "resting" &&
    css`
      color: yellow;
    `}
`;

const TimerDisplay = (props) => {
  return (
    <TimerDisplayWrap status={props.status}>
      <TimerDisplayTime status={props.status}>
        {props.mins}:{props.secs}
      </TimerDisplayTime>
      <p>{props.type} </p>
      <small>
        {props.isRoundTimer &&
          (props.status === "resting" ? ": REST " : ": ROUND ") +
            `${props.round} / ${props.roundsTotal}`}
      </small>
      <span className="description">{props.description}</span>
      <span>{props.id}</span>
    </TimerDisplayWrap>
  );
};

export default TimerDisplay;
