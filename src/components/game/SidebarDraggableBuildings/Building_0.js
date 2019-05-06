import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'

const BoardItem = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Building_0_Component = styled(BoardItem)`
  display: ${props => props.show ? 'block' : 'none'};
  width: 110px;
  height: 110px;
  background-color: #ddd;
  z-index: 1;
`;

const BuildingSource = {
    beginDrag(props){
        props.building.level = 0;
        return props.building;
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function Building_0 (props) {
    const {isDragging, connectDragSource, building} = props;
    return (
        <Building_0_Component show={props.show} ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_0)