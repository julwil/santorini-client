import React from "react";
import styled from "styled-components";
import {COLOR_1, COLOR_2, COLOR_4, COLOR_5} from "../../helpers/layout";
import {BoardBuilding} from "./BoardBuilding";

const Field = styled.div`
  width: 130px;
  height: 130px;
  border: 5px solid ${COLOR_5};
  background-color: #37BD5A;
  box-sizing: border-box;
  position: relative;
  float: left;
`;

const BoardItem = styled.div`
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const BoardPlayer = styled(BoardItem)`
  width: 30px;
  height: 30px;
  background-color: ${props => props.user === 1? COLOR_1 : COLOR_2};
  border: 3px solid ${props => props.active? 'yellow':'grey'};
  box-sizing: border-box;
  border-radius: 30px;
  z-index: 5;
`;


export const BoardField = (props) => {
    let player, building;
    console.log(props.player);
    if(props.player != null) player = (<BoardPlayer id={props.player.id} user={props.player.user} active={props.player.active}/>);
    else player = '';
    if(props.building != null) building = (<BoardBuilding level={props.building}/>);
    else building = '';
    return (
        <Field>
            {building}
            {player}
        </Field>
    );
};
