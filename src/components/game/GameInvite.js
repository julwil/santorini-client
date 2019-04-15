import React from "react";
import styled from "styled-components";
import {COLOR_3, COLOR_5} from "../../helpers/layout";

const Popup = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(50% 50%);
  min-height: 40px;
  width: 200px;
  color: ${COLOR_3};
  border-radius: 4px;
  background-color: ${COLOR_5};
  z-index: 2;
  padding: 10px;
  box-shadow: 0 0 5px 0 rgba(143,143,143,1);
  opacity: ${props => props.show?1:0};
  visibility: ${props => props.show?1:0};
  transition: all 200ms ease-in-out;
  &:after{
    z-index: 1;
    width: 100%;
    height: 100%;
    display: block;
    content: '';
    opacity: ${props => props.show?1:0};
    visibility: ${props => props.show?1:0};
    transition: all 200ms ease-in-out;
    background-color: rgba(50,50,50,0.5);
    position: fixed;
  }
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
            this.setState({show: nextProps.show});
            if(nextProps.show){
                setTimeout(()=>{this.setState({show:false})},4000);
            }
        }
    }

    render = () => {
        return(
            <Popup show={this.state.show}>
                <div>Popup-Content</div>
            </Popup>
        )
    };

    componentWillUnmount() {
        this._isMounted = false;
    }
}

export default GameInvite;