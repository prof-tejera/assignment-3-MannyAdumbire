
/**
 * This component is used to display the timer stamp
 */
import React from "react";
import styled from "styled-components";
import * as h from "../../utils/helpers";


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

//className="timer-display-time"
const TimerTotalDisplay = (props) => {
    const [ mins, secs ] = h.minsSecsFromSecs(props.seconds)
    return (
      <TimerTotal >
          <Text>{props.title}</Text>
          <Text>
            {mins} mins{" "}
            {secs} secs
          </Text>
        </TimerTotal>
    );
}

export default TimerTotalDisplay;