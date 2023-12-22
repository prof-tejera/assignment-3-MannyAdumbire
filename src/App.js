import { React, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";

import DocumentationView from "./views/DocumentationView";
import WorkoutView from "./views/WorkoutView";
import { WorkoutEdit } from "./views/WorkoutEdit";
// Contexts.
import { WorkoutContextWrap, WorkoutContext } from "./WorkoutContext";

import { Button } from "./WorkoutStyles";

const MenuButton = styled(Button)`
  text-decoration: none;
  & a {
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
  }
`;

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
  ul {
    display: flex;
    padding: 0;
  }
  color: white;
`;

const GHPage = "assignment-3-MannyAdumbire";
const Nav = () => {
  const { tmrsParam } = useContext(WorkoutContext);
  // Rerender when the tmrsParam changes.
  useEffect(() => {}, [tmrsParam]);
  return (
    <nav>
      <ul>
        <MenuButton>
          <Link to={`/${GHPage}/workout/${tmrsParam}`}>Workout</Link>
        </MenuButton>
        <MenuButton>
          <Link to={`/${GHPage}/edit/${tmrsParam}`}>Edit</Link>
        </MenuButton>
        <MenuButton>
          <Link to={`/${GHPage}/docs/`}>Documentation</Link>
        </MenuButton>
      </ul>
    </nav>
  );
};
const App = () => {
  const tmrs = window.location.hash;
  return (
    // Remove the hash from the URL.
    <Container>
      <Router>
        <WorkoutContextWrap initialTmrsParam={tmrs}>
          <Nav />
          <Routes>
            <Route path={`/${GHPage}/workout/`} element={<WorkoutView />} />
            <Route path={`/${GHPage}/edit/`} element={<WorkoutEdit />} />
            <Route path={`/${GHPage}/docs/`} element={<DocumentationView />} />
            <Route path="*" element={<WorkoutEdit />} />
          </Routes>
        </WorkoutContextWrap>
      </Router>
    </Container>
  );
};

export default App;
