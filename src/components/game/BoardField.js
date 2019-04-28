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
  border-color: ${COLOR_5};
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

const Hover = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 width: 100%;
 z-index: 1;
 opacity: 0.5;
 border: 20px solid;
 border-color: ${props => props.targetForMove ? 'yellow' : 'red'}
`;

const FieldTarget = {
    canDrop(props){
      return !!props.targetForMove;
    },

    drop(props, monitor){
        console.log("X: "+props.field_x_coordinate, "Y: "+props.field_y_coordinate); //remove
        props.updateFigure(
            monitor.getItem(),
            props.field_x_coordinate,
            props.field_y_coordinate,
            (props.building.length > 0 ? props.building.level+1 : 0)
        )
    }
};

function collect(connect, monitor){
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        item: monitor.getItem(),
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
            {isOver && (
                <Hover targetForMove={props.targetForMove}/>
            )}
        </Field>
    );
}

export default DropTarget('figure', FieldTarget, collect)(BoardField)