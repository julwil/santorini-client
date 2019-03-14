import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Game from "../../game/Game";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class UsersRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of UsersRouter, i.e., App.js
     */
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/users`}
          render={() => <Game />}
        />
      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default UsersRouter;
