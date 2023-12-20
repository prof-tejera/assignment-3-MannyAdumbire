/**
 * This component is used to display the timer stamp
 */
import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import * as h from "../../utils/helpers";
import { WorkoutContext } from "../../WorkoutContext.js";

const TimerTotal = styled.div`
  border: 1px solid gray;
  font-size: medium;
  margin: 0rem 1rem;
  display: inline-flex;
  &::before {
    display: inline;
    content: "⌛";
    margin-right: 0.5rem;
  }
`;

const Text = styled.p`
  font-size: large;
  color: gray;
  margin: 0;
  padding: 0;
`;

let totalInterval = null;

const TimerTotalDisplay = ({ title, subtractElapsed = false }) => {
  const { options, workout, workoutFns } = useContext(WorkoutContext);
  const [totalSeconds, setTotalSeconds] = useState(
   subtractElapsed
    ? workout.totalTimeLeft.current
    : workout.totalTime.current
 );
  // Set the total, using either, the max combined time for all timers, or just the time left.
  useEffect(() => {
    if (subtractElapsed) {
        totalInterval = setInterval(() => {
          workoutFns.updateTotalTimeLeft();
          setTotalSeconds( workout.totalTimeLeft.current);
        }, 1000);
    }else{
          setTotalSeconds( workout.totalTime.current);
    }
    return () => {
      clearInterval(totalInterval);
    };
  }, [workout, options.mode, workoutFns, subtractElapsed]);
  const [mins, secs] = h.minsSecsFromSecs(totalSeconds);
  return (
    <TimerTotal>
      <Text>{title}</Text>
      <Text>
        {mins} mins {secs} secs
      </Text>
    </TimerTotal>
  );
};

export default TimerTotalDisplay;
