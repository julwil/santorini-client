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
  width: 400px;
  color: ${COLOR_1};
  border-radius: 4px;
  background-color: ${COLOR_5};
  z-index: 2;
  padding: 10px;
  box-shadow: 0 0 5px 0 rgba(143,143,143,1);
`;

const Invite_ButtonContainer = styled(ButtonContainer)`
  
`;

const Invite_Button = styled(Button)`
  margin-left: 10px;
`;

//only show if games not empty, if not then show first game object of list once accepted update game status and delete remaining games if there still exist any
//if accepted redirect user to "/games/{id}"
//if denied update server and delete game
class InvitationNote extends React.Component{
    constructor(){
        super();
        this.state = {
            show: false,
            inviting_user: null,
        };
        this._isMounted = false;

    }

    //only open notification pop-up if user actually invited to game (games is not empty) and the invited participant is the currently logged in user
    componentDidMount() {
        this._isMounted = true;
        if(this.props.open){
            if(this.props.games !== null && (Number(this.props.games.user2) === Number(localStorage.getItem("user_id")))) {
                console.log(this.props.users);
                this.setState({inviting_user: this.props.users.map((user) => {return user.username})
                        [(this.props.users.map((user) => {return user.id}).indexOf(this.props.games.user1))]});
                this.setState({show: true});
            }
        }else{
            console.log("Setting show to false");
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
                    <div>
                    Inviting user: {this.state.inviting_user}
                    </div>
                    <div>
                    Game mode: {this.props.isGodPower ? "Involving god powers" : "Without god powers"}
                    </div>
                    <Invite_ButtonContainer>
                        <Invite_Button
                            onClick={() => {
                                this.setState({show:false});
                                this.props.acceptingInvitation()
                            }}
                        >Accept</Invite_Button>
                        <Invite_Button
                            onClick={() => {
                                this.setState({show:false});
                                this.props.denyingInvitation()
                        }}>Deny</Invite_Button>
                    </Invite_ButtonContainer>
                </Popup>
            </PopupContainer>
        )
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default InvitationNote;