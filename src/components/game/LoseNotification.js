import React from "react";
import styled from "styled-components";
import {BaseContainer, ButtonContainer, COLOR_1, COLOR_3, COLOR_5, DESKTOP_WIDTH} from "../../helpers/layout";
import {Button} from "../../views/design/Button";
import {withRouter} from "react-router-dom";

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: ${props => props.show?'block':'none'};
  background-color: rgba(50,50,50,0.5);
`;

const Popup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-height: 40px;
  width: 500px;
  color: ${COLOR_1};
  border-radius: 4px;
  background-color: ${COLOR_5};
  z-index: 10000;
  padding: 40px;
  box-shadow: 0 0 5px 0 rgba(143,143,143,1);
`;

class LoseNotification extends React.Component{
    constructor(){
        super();
        this.state = {
            show: false,
        };
        this._isMounted = false;
        this.updateInterval = 10000;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillReceiveProps(nextProps) {
        if(this._isMounted && nextProps.open && nextProps.loser === Number(localStorage.getItem("user_id"))) {
            this.setState({show: true});
            setTimeout (() => {this.props.history.push('/users')}, 10000)
        }else{
            this.setState({show: false});
        }
    }

    render = () => { //indicate data about game in here as well as provide accept and deny button in here
        return(
            <PopupContainer show={this.state.show}>
                <Popup>
                    <h2>Sorry, it seems you lost this round.</h2>
                    <p>Go on and try a new game.</p>
                </Popup>
            </PopupContainer>
        )
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default withRouter(LoseNotification);