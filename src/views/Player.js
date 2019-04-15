import React from "react";
import styled from "styled-components";
import {COLOR_3, COLOR_5, COLOR_6} from "../helpers/layout";
import {Button} from "../views/design/Button";
import GameInvite from "../components/game/GameInvite";

const Container = styled.div`
  &:hover {
    background-color: ${COLOR_6};
  }
  margin: 6px 0;
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  background-color: ${COLOR_5};
 
`;

const Username = styled.div`
  font-weight: bold;
  color: ${COLOR_3};
`;

const StatusIndicator = styled.div`
  height: 10px;
  width: 10px;
  margin: 10px 5px;
  border-radius: 10px;
  background-color: ${props => {switch(props.status){
    case 'ONLINE': return "#5CFF1F";
    case 'CHALLENGED': return "#FF795E";
    case 'PLAYING': return "#FF795E";
    case 'OFFLINE': return "#666";
    }}} 
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;

const PlayerButton = styled(Button)`
  margin-left: 10px;
  width: 70px;
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Player = ({ user, invite }) => {
    return(
        <Container status={user.status}>
            <Username>{user.username}</Username>
            <StatusIndicator status={user.status}/>
            <ButtonContainer>
                <PlayerButton
                    invited_user={user.id}
                    onClick={() =>{
                        this.props(user.id);
                        window.location("/games");
                    }}
                >Invite</PlayerButton>
                <PlayerButton
                    key={user.id}
                    onClick={() => {
                        invite(user.id);
                    }}
                >Profile</PlayerButton>
            </ButtonContainer>
        </Container>
    );
};

export default Player;
