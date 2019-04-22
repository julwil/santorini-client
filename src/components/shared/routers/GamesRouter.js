import React from "react";
import {Route, Switch} from "react-router-dom";
import Lobby from "../../game/Lobby";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";
import {BaseContainer} from "../../../helpers/layout";
import Profile from "../../user/Profile";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "./AppRouter";
import Games from "../../game/Games";



class GamesRouter extends React.Component {
  render() {
    return (
      <BaseContainer>
        <Route
          exact
          path={`${this.props.base}/:gamesId`}
          render={() =>
              <ProfileGuard>
                <Games />
              </ProfileGuard>}
        />
      </BaseContainer>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GamesRouter;
