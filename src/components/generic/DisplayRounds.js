import React from "react";

const DisplayRounds = ({ roundNum, roundType, ...props }) => {
  return (
    <div className="DisplayRounds">
      <div className="rounds">
        <p> Round {roundNum} </p>
        <span> {roundType} </span>
      </div>
    </div>
  );
};

export default DisplayRounds;