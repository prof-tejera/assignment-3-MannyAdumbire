import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";

import DocumentationView from "./views/DocumentationView";
import WorkoutView from "./views/WorkoutView";
import WorkoutEdit from "./views/WorkoutEdit";
import WorkoutContextWrap from "./WorkoutContext";
import { Button } from "./WorkoutStyles";

const MenuButton = styled(Button)`
  text-decoration: none;
  & a{
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
    
  }
`

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
        <MenuButton>
          <Link to="/edit">Edit</Link>
        </MenuButton>
        <MenuButton>
          <Link to="/">Workout</Link>
        </MenuButton>
        <MenuButton>
          <Link to="/docs">Documentation</Link>
        </MenuButton>
      </ul>
    </nav>
  );
};
const App = () => {
  return (
    <Container>
      <Router>
        <Nav />
        <WorkoutContextWrap>
          <Routes>
            <Route path="/docs" element={<DocumentationView />} />
            <Route path="/" element={<WorkoutView />} />
            <Route path="/edit" element={<WorkoutEdit />} />
            <Route path="*" element={<WorkoutEdit />} />
          </Routes>
        </WorkoutContextWrap>
      </Router>
    </Container>
  );
};

export default App;
