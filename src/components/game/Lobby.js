import React from "react";
import styled from "styled-components";
import { Heading1, Main, MainContainer} from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import {Button, ButtonSecondary} from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import {handleError} from "../../helpers/handleError";
import {catchError} from "../../helpers/catchError";
import Error from "../../helpers/Error";
import GameInvite from "./GameInvite";
import InvitationNote from "./InvitationNote";

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  position: relative;
`;

const LobbyHeading = styled(Heading1)`
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
`;

const UserProfileButton = styled(Button)`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
`;

const CenteredDiv = styled.div`
  text-align: center;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      current_user: Number(localStorage.getItem("user_id")),
      users: null,
      error: null,
      GameInviteUserId: null,
      games: null,
      openInvitationNotification: false,
    };
    this.intervalId = 0;
    this.updateInterval = 2000;
  }

  logout() {
    fetch(`${getDomain()}/users/logout`, {
      method: "GET",
      headers: new Headers({
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    })
        .then(handleError)
        .then(() => {
            clearInterval(this.intervalId);
            localStorage.clear();
            this.props.history.push("/login")
        })
        .catch(err => {
          catchError(err, this);
        });
  }

  componentDidMount() {
    this.intervalId = setInterval(this.fetchUsers, this.updateInterval)
  }

  fetchUsers = () => {
    fetch(`${getDomain()}/users`, {
      method: "GET",
      headers: new Headers({
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    })
        .then(handleError)
        .then( users => {
          this.setState({ users: users });
        })
        .catch(err => {
          catchError(err,this);
        });
  };

  sort_users(){ //sort all online users from A to Z, then all playing/challenged users from A to Z & then all offline users from A to Z; first status then name descending
    const data = [].concat(this.state.users);
    data.splice(data.map((user) => {return user.id}).indexOf(this.state.current_user),1);
    data.sort((user_a, user_b) => (user_a.username > user_b.username) ? 1 : -1);
    data.sort((user_a, user_b) => (user_b.status === 'PLAYING' || user_b.status === 'CHALLENGED') ? 1 : -1);
    data.sort((user_a, user_b) => ((user_b.status === 'OFFLINE') ? -1 : 1));
    data.sort((user_a, user_b) => (user_a.status === 'ONLINE' ? -1 : 1));
    return data;
  }

  invite = (userId) =>{
    clearInterval(this.intervalId);
    this.setState({
      GameInviteUserId: userId,
    })
  };

  closeInvite = () => {
    this.setState({
      GameInviteUserId: null,
    });
    this.intervalUsers = setInterval(this.fetchUsers,this.updateInterval);
    this.intervalNotficaton = setInterval(this.getNotification, this.updateInterval);
  };

  invitationAccepted = () => {
      //send accepting request to backend

  };

  invitationDenied = () => {  //only needed if user denies invitation, then close notification of invitation & restart fetch-loops of getting users and notifications
      // send denial request to backend
  };


  render() {
    return (
      <MainContainer>
        <Main>
          <HeaderContainer>
            <LobbyHeading>User Lobby</LobbyHeading>
            {this.state.users ? (
                <UserProfileButton
                    onClick={() => {
                      this.props.history.push("/users/" + this.state.current_user)
                    }}
                >{this.state.users.map((user) => {
                  return user.username
                })[(this.state.users.map((user) => {
                  return user.id
                }).indexOf(this.state.current_user))]}</UserProfileButton>
            ) : ("")}
          </HeaderContainer>
          {!this.state.users ? (
              <SpinnerContainer>
                <Spinner/>
              </SpinnerContainer>
          ) : (
            <CenteredDiv>
              <Users>
                {this.sort_users().map(user => {
                  return (
                    <PlayerContainer key={user.id}>
                      <Player user={user} invite={this.invite}/>
                    </PlayerContainer>
                  );
                })}
              </Users>
              <GameInvite userId={this.state.GameInviteUserId} closePopup={this.closeInvite}/>
              <InvitationNote
                  open={this.state.openInvitationNotification}
                  games={this.state.games}
                  acceptingInvitation={this.invitationAccepted()}
                  denyingInvitation={this.invitationDenied()}/>
              <ButtonSecondary
                width="50%"
                onClick={() => {
                  this.logout();
                }}
              >
                Logout
              </ButtonSecondary>
            </CenteredDiv>
          )}
          <Error errorMessage={this.state.error}/>
        </Main>
      </MainContainer>
    );
  }
}

export default withRouter(Lobby);
