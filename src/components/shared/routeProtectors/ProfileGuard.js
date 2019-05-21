import React from "react";
import { Redirect } from "react-router-dom";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const ProfileGuard = props => {
    // fetch(`${getDomain()}/games/invitations`, {
    //   method: "GET",
    //   headers: new Headers({
    //     'Authorization': this.state.current_user_token,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }),
    // })
    //     .then(handleError)
    //     .then(games => {
    //       if(games.length > 0){ //if games has at least one element the following shall be performed
    //         clearInterval(this.intervalNotification);
    //         clearInterval(this.intervalUsers);
    //         this.setState({invited_games: games, openInvitationNotification: true, isGodPower: games[0].isGodPower, demoMode: games[0].demoMode === 1});
    //       } //Git change
    //     })
    //     .catch(err => {
    //       catchError(err,this);
    //     });
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to={"/login"} />;
};
