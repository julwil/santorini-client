import React from "react";
import {Route, Switch} from "react-router-dom";
import Game from "../../game/Game";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";
import {BaseContainer} from "../../../helpers/layout";
import Profile from "./AppRouter";


class UsersRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of UsersRouter, i.e., App.js
     */
    return (
      <BaseContainer>
        <Route
          exact
          path={`${this.props.base}/users`}
          render={() =>
              <ProfileGuard>
                <Game />
              </ProfileGuard>}
        />
          <Route
              path={`${this.props.base}/users/:userId`}
              exact
              render={() => (
                  <ProfileGuard>
                      <Profile />
                  </ProfileGuard>
              )}
          />
      </BaseContainer>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default UsersRouter;
