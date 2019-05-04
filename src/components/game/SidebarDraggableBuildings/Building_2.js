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

const Building_2_Component = styled(BoardItem)`
  width: 60px;
  height:60px;
  background-color: #fff;
  z-index: 3;  
`;

const BuildingSource = {
    beginDrag(props){
        props.building.level = 2;
        return props.building;
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function Building_2 (props) {
    const {isDragging, connectDragSource, building} = props;
    return (
        <Building_2_Component ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_2)