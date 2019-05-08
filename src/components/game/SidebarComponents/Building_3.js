import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'
import {COLOR_3, COLOR_4, COLOR_5} from "../../../helpers/layout";

const BoardItem = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Building_3_Component = styled(BoardItem)`
  display: ${props => props.show ? 'block' : 'none'};
  width: 50px;
  height: 50px;
  border-radius: 40px;
  background-color: ${COLOR_3}; 
  z-index: 4; 
`;

const BuildingSource = {
    beginDrag(props){
        props.building.z = 3;
        return props.building;
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function Building_3 (props) {
    const {isDragging, connectDragSource, building} = props;
    return (
        <Building_3_Component show={props.show} ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_3)