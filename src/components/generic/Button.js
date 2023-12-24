import React from "react";
import * as ws from "../../WorkoutStyles";

const Button = ({ type, label, onClick , ...props}) => {
  // Keep the current mode in sync with the parent component that passed it in.
  return (
    <ws.Button onClick={onClick} {...props}>
        {label}
    </ws.Button>
  );
};
export default Button;
