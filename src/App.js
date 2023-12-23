import { React, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";

import DocumentationView from "./views/DocumentationView";
import WorkoutView from "./views/WorkoutView";
import { WorkoutEdit } from "./views/WorkoutEdit";
// Contexts.
import { WorkoutContextWrap, WorkoutContext } from "./WorkoutContext";

import * as ws from "./WorkoutStyles";

const MenuButton = styled(ws.Button)`
  text-decoration: none;
  & a {
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 2rem;
    color: white;
  & a {
    display: flex;
    align-items: center;
    font-size: 2rem;
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
          <StyledLink to={`/${GHPage}/workout/${tmrsParam}`}>
            Workout
          </StyledLink>
        </MenuButton>
        <MenuButton>
          <StyledLink to={`/${GHPage}/edit/${tmrsParam}`}>Edit</StyledLink>
        </MenuButton>
        {/* <MenuButton>
          <StyledLink to={`/${GHPage}/docs/`}>Documentation</StyledLink>
        </MenuButton> */}
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
        <ErrorBoundary
          fallback={
            <ws.Container>
              <p>There was a problem loading workout...</p>
              <p>
                {" "}
                Try starting over from{" "}
                <a
                  href={`${window.location.origin}/${window.location.pathname}`}
                >
                  `${window.location.origin}/${window.location.pathname}`
                </a>
              </p>
            </ws.Container>
          }
        >
          <WorkoutContextWrap initialTmrsParam={tmrs}>
            <Nav />
            <Routes>
              <Route path={`/${GHPage}/edit/`} element={<WorkoutEdit />} />
              <Route path={`/${GHPage}/workout/`} element={<WorkoutView />} />
              <Route
                path={`/${GHPage}/docs/`}
                element={<DocumentationView />}
              />
              <Route path="*" element={<WorkoutEdit />} />
            </Routes>
          </WorkoutContextWrap>
        </ErrorBoundary>
      </Router>
    </Container>
  );
};

export default App;
