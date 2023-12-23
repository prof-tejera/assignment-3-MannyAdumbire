import React from "react";
import styled, { css } from "styled-components";
import * as ws from "../../WorkoutStyles";

const TimerDisplayWrap = styled(ws.Button)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-weight: bold;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0.2rem;
  border-radius: 0;
  ${(props) =>
    props.isEdit === true &&
    css`
      :hover {
        border: solid 1px silver;
      }
    `};
  p {
    white-space: pre-wrap;
  }
  small {
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
    ["running", "resting"].includes(props.status) &&
    css`
      flex-direction: column;
      align-self: center
      justify-self: center;
      & .direction {
        justify-self: flex-start;
      }
    `}
`;

export const TimerDisplayTime = styled(ws.Container)`
  font-size: 1.5rem;
  color: gray;
  ${(props) =>
    ["running", "resting"].includes(props.status) &&
    css`
      &,
      ~ .round-info {
        color: lime;
      }
      font-size: 5rem;
    `}
  ${(props) =>
    props.status === "completed" &&
    css`
      &,
      ~ .round-info {
        color: grey;
        text-decoration: line-through;
      }
    `}
    ${(props) =>
    props.status === "resting" &&
    css`
      &,
      ~ .round-info {
      color: yellow;
    `}
`;

const TimerDisplay = (props) => {
  return (
    <TimerDisplayWrap status={props.status}>
      <TimerDisplayTime status={props.status}>
        {props.mins}:{props.secs}
      </TimerDisplayTime>
      <p className="timer-type">{props.type} </p>
      <p className="round-info">
        {props.isRoundTimer &&
          (props.status === "resting" ? " REST " : " ROUND ") +
            `${props.round} / ${props.roundsTotal}`}
      </p>
      <small className="description">{props.description}</small>
    </TimerDisplayWrap>
  );
};

export default TimerDisplay;
