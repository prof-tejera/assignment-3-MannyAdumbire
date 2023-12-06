import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";

import DocumentationView from "./views/DocumentationView";
import WorkoutView from "./views/WorkoutView";
import WorkoutEdit from "./views/WorkoutEdit";
import TimerQueueContextWrap from "./TimerQueueContext";

const Container = styled.div`
  background: black;
  height: 100vh;
  overflow: auto;
  text: white;
  li {
    list-style-type: none;
    justify-content: flex-start;
    padding: 0.5rem;
  }
  ul{
    display: flex;
    padding: 0;
  }
  color: white;
`;

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/edit">Edit</Link>
        </li>
        <li>
          <Link to="/">Workout</Link>
        </li>
        <li>
          <Link to="/docs">Documentation</Link>
        </li>
      </ul>
    </nav>
  );
};
const App = () => {
  return (
    <Container>
      <Router>
        <Nav />
        <TimerQueueContextWrap>
          <Routes>
            <Route path="/docs" element={<DocumentationView />} />
            <Route path="/" element={<WorkoutView />} />
            <Route path="/add" element={<WorkoutEdit />} />
            <Route path="*" element={<WorkoutEdit />} />
          </Routes>
        </TimerQueueContextWrap>
      </Router>
    </Container>
  );
};

export default App;
