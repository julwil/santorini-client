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

class GameInvite extends React.Component {
    constructor(){
        super();
            this.state = {
                invited_user: this.props,
                challenging_user: localStorage.getItem("user_id"),
            }
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
                    <div>Game Invite</div>
                    <div>Challenging user: {this.state.challenging_user}</div>
                    <div>Invited user: {this.state.invited_user}</div>
                </Main>
            </MainContainer>
        );
    }
}

export default withRouter(GameInvite);
