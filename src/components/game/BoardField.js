import React from "react";
import styled from "styled-components";
import {COLOR_1, COLOR_2, COLOR_4, COLOR_5} from "../../helpers/layout";
import {BoardBuilding} from "./BoardBuilding";
import Figure from "./Figure";
import DragSource from "react-dnd/lib/cjs/DragSource";
import DropTarget from "react-dnd/lib/cjs/DropTarget";

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
  background-color: ${props => props.user === 1 ? COLOR_1 : COLOR_2};
  border: 3px solid ${props => props.active ? 'yellow':'grey'};
  box-sizing: border-box;
  border-radius: 30px;
  z-index: 5;
`;

const FieldTarget = {
    drop(props){
        console.log("dropping");
        //moveFigure(props.x, props.y)
    }
};

function collect(connect, monitor){
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }
}

function BoardField (props) { //use "isOver" to highlight field when hovering over it
    let figure, building;
    if(props.figure != null) figure = (<Figure figure={props.figure}/>);
    else figure = '';
    if(props.building != null) building = (<BoardBuilding level={props.building.level}/>);
    else building = '';

    const {connectDropTarget, isOver} = props;

    return (
        <Field ref={instance => connectDropTarget(instance)} targetForMove={props.targetForMove} targetForBuild={props.targetForBuild}>
            {building}
            {figure}
        </Field>
    );
}

export default DropTarget('figure', FieldTarget, collect)(BoardField)