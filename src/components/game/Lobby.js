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

const CenteredDiv = styled.div`
  text-align: center;
`;

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
      error: null,
      GameInviteUserId: null,
    };
    this.intervalId = 0;
    this.updateInterval = 2000;
  }

  logout() {
    fetch(`${getDomain()}/logout`, {
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
    data.splice(data.map((user) => {return user.id}).indexOf(Number(localStorage.getItem("user_id"))),1);
    data.sort((user_a, user_b) => (user_a.username > user_b.username) ? 1 : -1);
    data.sort((user_a, user_b) => (user_a.status === 'ONLINE') ? 1 : -1);
    data.sort((user_a, user_b) => (user_a.status === 'PLAYING' || user_a.status === 'CHALLENGED') ? -1 : (user_b.status === 'OFFLINE') ? -1 : 1);
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
    this.intervalId = setInterval(this.fetchUsers,this.updateInterval);
  };

  render() {
    return (
      <MainContainer>
        <Main>
          <Heading1>User Lobby</Heading1>
          {!this.state.users ? (
            <Spinner />
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
