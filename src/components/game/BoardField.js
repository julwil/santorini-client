import React from "react";
import styled from "styled-components";
import {COLOR_1, COLOR_2, COLOR_4, COLOR_5} from "../../helpers/layout";
import {BoardBuilding} from "./BoardBuilding";

const Field = styled.div`
  width: 130px;
  height: 130px;
  border: 5px solid;
  border-color: ${props => props.targetForMove? 'yellow':COLOR_5};
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

const BoardFigure = styled(BoardItem)`
  width: 30px;
  height: 30px;
  background-color: ${props => props.user === 1? COLOR_1 : COLOR_2};
  border: 3px solid ${props => props.active? 'yellow':'grey'};
  box-sizing: border-box;
  border-radius: 30px;
  z-index: 5;
`;


export const BoardField = (props) => {
    let figure, building;
    if(props.figure != null) figure = (<BoardFigure id={props.figure.id} user={props.figure.user} active={props.figure.active}/>);
    else figure = '';
    if(props.building != null) building = (<BoardBuilding level={props.building.level}/>);
    else building = '';
    return (
        <Field targetForMove={props.targetForMove} targetForBuild={props.targetForBuild}>
            {building}
            {figure}
        </Field>
    );
};
