import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'

const BoardItem = styled.div`
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Building_1_Component = styled(BoardItem)`
  width: 100px;
  height: 100px;
  border-radius: 70px;
  background-color: #eee;  
  z-index: 2;
`;

const BuildingSource = {
    beginDrag(props){
        props.building.level = 1;
        return props.building;
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function Building_1 (props) {
    const {isDragging, connectDragSource, building} = props;
    return (
        <Building_1_Component ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_1)