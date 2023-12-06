/**
 * Common styles for the workout timer
 */
import styled, { css } from "styled-components";

const textColor = "wheat";
const containerStyle = `
    color: ${textColor};
    display: flex;
    flex-direction: column;
    flex-wrap:wrap;
    background-color: black;
    color:wheat;
`;

export const TimerInputGroup = styled.span`
  ${containerStyle}
  flex-direction: row;
  margin: 0 0.2rem;
  align-items: flex-start;
  justify-content: flext-start;
`;
export const TimerDisplay = styled.div`
  font-size: x-large;

  ${(props) =>
    props.status === "stopped" &&
    css`
      color: grey;
    `}
  ${(props) =>
    props.status === "running" &&
    css`
      color: green;
    `}
`;
export const TimerPanel = styled.span``;
export const TimerDisplayTime = styled.div`
  font-size: x-large;
  color: grey;
`;
export const Button = styled.div`
  display: flex;
  cursor: pointer;
  font-size: medium;
  color: ${textColor};
  position: relative;
  padding: 0.4rem 0.2rem;
  min-height: 2rem;
  min-width: 2rem;
  margin: 0.2rem;
  border: solid 1px white;
  border-radius: 20%;
  justify-content: center;
  text-align: center;
  align-items: center;
  &:disabled {
    color: gray;
    pointer-events: none;
  }
  &:active {
    position: relative;
    top: 0.2rem;
    border-color: white;
  }
  ${(props) =>
    props.color &&
    css`
      background-color: ${props.color};
    `}
  ${(props) =>
    props.hover &&
    css`
      &:hover {
        border-color: white;
        background-color: ${props.hover};
        color: black;
      }
    `}
  ${(props) =>
    props.img &&
    css`
      &:before {
        content: "${props.img}";
      }
    `}
`;
export const DisplayRounds = styled.div``;

export const TimerTypeSelect = styled.span`
  color: ${textColor};
  & p {
    color: ${textColor};
  }
`;

export const TimerInputBox = styled.input`
  ${containerStyle}
  color: ${textColor};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: end;
  background-color: black;
  cursor: pointer;
  height: 100%;
  font-family: ui-monospace;
  font-size: x-large;
  margin: 0rem 0.2rem 2rem 0rem;
  background-color: black;
  border: solid 1px white;
  color: white;
  font-size: x-large;
  width: 3rem;

  &:disabled {
    background-color: black;
    color: gray;
    display: none;
  }
  &:disabled + label {
    display: none;
  }
  &:before {
  }
  + label {
    justify-content: center;
    align-items: center;
    font-size: small;
    font-size: normal;
    color: white;
  }
`;
export const TimerLabel = styled.label`
  justify-content: center;
  align-items: center;
  font-size: medium;
  &:disabled {
    display: none;
  }
`;
export const Wrap = styled.label`
  color: ${textColor};
`;

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  & p {
    padding-left: 0.2rem;
  }
`;
