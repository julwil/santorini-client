import React from "react";
import styled from "styled-components";
import {COLOR_1, COLOR_3, COLOR_5} from "../../helpers/layout";
import {Button} from "../../views/design/Button";

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: ${props => props.show?'block':'none'};
  background-color: rgba(50,50,50,0.5);
`;

const Popup = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
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
    constructor(props){
        super(props);
        this.state = {
            show: false,
        };
        this._isMounted = false;

    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillReceiveProps(nextProps) {
        if(this._isMounted){
            if(nextProps.userId !== null && (nextProps.userId !== this.props.userId)){
                this.setState({show:true});
            }else{
                this.setState({show:false});
            }
        }
    }

    render = () => {
        return(
            <PopupContainer show={this.state.show}>
                <Popup>
                    Challenged{this.props.userId}
                    <Button onClick={()=>{this.props.closePopup()}}>Button</Button>
                </Popup>
            </PopupContainer>
        )
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default InvitationNote;