/**
 * This component is used to display the timer stamp
 */
import React, { useState, useContext } from "react";
import styled, { css } from "styled-components";
import * as h from "../../utils/helpers";
import { WorkoutContext } from "../../WorkoutContext.js";
import * as ws from "../../WorkoutStyles.js";

const TimerTotal = styled(ws.Container)`
  border: 1px solid gray;
  margin: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  min-width: 15rem;
  ${(props) =>
    props.percent &&
    css`
      background: linear-gradient(
        to right,
        green ${(props) => props.percent}%,
        black ${(props) => props.percent}%
      );
    `}
  /* 
  An animated green gradient to fill bg based on time left.
  */

  &::before {
    display: inline;
    content: "⌛";
    margin-right: 0.5rem;
  }
`;

const Text = styled.p`
  font-size: large;
  font-weight: bold;
  color: white;
  margin: 0;
  padding: 0;
`;

/**
 *  Display the total time left for all timers.
 *
 * @param {string} title The displayed title of this total.
 * @param {boolean} subtractElapsed Whether to subtract the elapsed time from the total time.
 * @returns
 */
const TimerTotalDisplay = ({ title, subtractElapsed = false }) => {
  const { workoutFns } = useContext(WorkoutContext);
  // eslint-disable-next-line no-unused-vars
  const [totalSeconds, setTotalSeconds] = useState(
    subtractElapsed
      ? workoutFns.getTotalTimeLeft()
      : workoutFns.getTotalTime()
  );
  // Pass the setter as a callback to the workoutFns, so it's available to the timers.
  workoutFns.totalsSetter = setTotalSeconds;

  const percent = subtractElapsed
    ? (100 * workoutFns.getTotalTimeLeft()) / workoutFns.getTotalTime()
    : 100;
  const [mins, secs] = h.minsSecsFromSecs(
    subtractElapsed
      ? workoutFns.getTotalTimeLeft()
      : workoutFns.getTotalTime()
  );
  return (
    <TimerTotal percent={percent}>
      <Text>{title}</Text>
      <Text>
        {mins} mins {secs} secs
      </Text>
    </TimerTotal>
  );
};

export default TimerTotalDisplay;
