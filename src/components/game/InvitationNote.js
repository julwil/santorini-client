import React from "react";
import styled from "styled-components";
import {BaseContainer, ButtonContainer, COLOR_1, COLOR_3, COLOR_5, DESKTOP_WIDTH} from "../../helpers/layout";
import {Button} from "../../views/design/Button";

const PopupContainer = styled(BaseContainer)`
  position: fixed;
  top: 0;
  left: 0;
  width: ${DESKTOP_WIDTH}px;
  height: 100%;
  z-index: 1;
  display: ${props => props.show?'block':'none'};
  background-color: rgba(50,50,50,0.5);
`;

const Popup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-height: 40px;
  width: 200px;
  color: ${COLOR_1};
  border-radius: 4px;
  background-color: ${COLOR_5};
  z-index: 2;
  padding: 10px;
  box-shadow: 0 0 5px 0 rgba(143,143,143,1);
`;

//only show if games not empty, if not then show first game object of list once accepted update game status and delete remaining games if there still exist any
//if accepted redirect user to "/games/{id}"
//if denied update server and delete game
class InvitationNote extends React.Component{
    constructor(){
        super();
        this.state = {
            show: false,
        };
        this._isMounted = false;

    }

    //only open notification pop-up if user actually invited to game (games is not empty) and the invited participant is the currently logged in user
    componentDidMount() {
        this._isMounted = true;
        if(this.props.open && this.props.games !== null && (Number(this.props.games.user2) === Number(localStorage.getItem("user_id")))){
            this.setState({show: true});
        }else{ //throw error?
            this.setState({show: false});
        }
    }


    componentWillReceiveProps() {
        if(this._isMounted && this.props.open){
        }
    }

    render = () => { //indicate data about game in here as well as provide accept and deny button in here
        return(
            <PopupContainer show={this.state.show}>
                <Popup>
                    You have been invited to a game!
                    <ButtonContainer>
                        <Button onClick={() => {
                            this.props.acceptingInvitation()
                        }}>Accept</Button>
                        <Button onClick={() => {
                            this.props.denyingInvitation()
                        }}>Deny</Button>
                    </ButtonContainer>
                </Popup>
            </PopupContainer>
        )
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default InvitationNote;