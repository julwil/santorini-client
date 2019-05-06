import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'
import {COLOR_2, COLOR_4} from "../../../helpers/layout";

const BoardItem = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const BoardFigure = styled(BoardItem)`
  width: 30px;
  height: 30px;
  background-color: ${props => props.user === 1 ? COLOR_4 : COLOR_2};
  border: yellow 3px solid;
  box-sizing: border-box;
  border-radius: 30px;
  z-index: 5;
`;

const BuildingSource = {
    beginDrag(props){
        return props.figure;
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function Building_0 (props) {
    const {isDragging, connectDragSource} = props;
    return (
        <BoardFigure show={props.show} ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('initialFigure', BuildingSource, collect)(Building_0)