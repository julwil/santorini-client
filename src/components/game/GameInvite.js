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
  width: 400px;
  color: ${COLOR_1};
  border-radius: 4px;
  background-color: ${COLOR_5};
  z-index: 2;
  padding: 40px;
  box-shadow: 0 0 5px 0 rgba(143,143,143,1);
`;

const Select = styled.select`
  
`;

class GameInvite extends React.Component{
    constructor(props){
        super(props);
        this.state = {show:false};
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
                    <h2>Challenge user</h2>
                    <Select>
                        <option value={false}>Without Godcards</option>
                        <option value={true}>With Godcards</option>
                    </Select>
                    <Button color={"#00ff00"} onClick={()=>{this.props.closePopup()}}>Challenge</Button>
                    <Button onClick={()=>{this.props.closePopup()}}>Close</Button>
                </Popup>
            </PopupContainer>
        )
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default GameInvite;