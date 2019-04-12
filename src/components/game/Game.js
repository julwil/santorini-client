import React from "react";
import styled from "styled-components";
import { Heading1, Main, MainContainer} from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import {handleError} from "../../helpers/handleError";
import {catchError} from "../../helpers/catchError";

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

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  logout() {
    localStorage.clear();
    this.props.history.push("/login");
  }

  componentDidMount() {
    fetch(`${getDomain()}/users`, {
      method: "GET",
      headers: new Headers({
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    })
      .then(handleError)
      .then( users => {
        this.setState({ users });
      })
      .catch(catchError);
  }

  render() {
    return (
      <MainContainer>
        <Main>
          <Heading1>Players overview</Heading1>
          {!this.state.users ? (
            <Spinner />
          ) : (
            <CenteredDiv>
              <Users>
                {this.state.users.map(user => {
                  return (
                    <PlayerContainer
                        key={user.id}
                        onClick={()=> {
                          this.props.history.push("/users/" + user.id)
                        }}
                    >
                      <Player user={user} />
                    </PlayerContainer>
                  );
                })}
              </Users>
              <Button
                width="50%"
                onClick={() => {
                  this.logout();
                }}
              >
                Logout
              </Button>
            </CenteredDiv>
          )}
        </Main>
      </MainContainer>
    );
  }
}

export default withRouter(Game);
