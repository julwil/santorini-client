import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'

const BoardItem = styled.div`
  float: left;
`;

const Building_2_Component = styled(BoardItem)`
  display: ${props => props.show ? 'block' : 'none'};
  width: 30px;
  height:30px;
  background-color: #fff;
  border: 0.5px solid black; 
  z-index: 3;
  margin-right: 10px;
`;

const BuildingSource = {
    beginDrag(props){
        props.building.z = 2;
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
        <Building_2_Component show={props.show} ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_2)