import React from "react";
import styled from "styled-components";
import {COLOR_6} from "../helpers/layout";
import {Button} from "../views/design/Button";

const Container = styled.div`
  &:hover {
    transform: scaleX(1.05);
    background-color: #1b7ab8;
  }
  margin: 6px 0;
  width: 330px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: ${props => {switch(props.status){ 
    case 'ONLINE': return "1px solid #5CFF1F";
    case 'CHALLENGED': return "1px solid #FF795E";
    case 'PLAYING': return "1px solid #FF795E";
    case 'OFFLINE': return "1px solid #ffffff26";
    }}
    }  
`;

const Username = styled.div`
  font-weight: bold;
  color: ${COLOR_6};
`;

const ButtonContainer = styled.div`
  align-items: end;
  width: 330px;
`;

const PlayerButton = styled(Button)`
  margin-left: 5px;
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
const Player = ({ user, props }) => {
    return(
        <Container status={user.status}>
            <Username>{user.username}</Username>
            <ButtonContainer>
                <PlayerButton
                    invited_user={user.id}
                    onClick={() =>{
                        this.props(user.id);
                        props.history.push("/games");
                    }}
                >Invite</PlayerButton>
                <PlayerButton
                    key={user.id}
                    onClick={() => {
                        props.history.push("users/" + user.id)
                    }}
                >Profile</PlayerButton>
            </ButtonContainer>
        </Container>
    );
};

export default Player;
