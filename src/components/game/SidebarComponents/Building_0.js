import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'

const BoardItem = styled.div`
 float: left;
`;

const Building_0_Component = styled(BoardItem)`
  display: ${props => props.show ? 'block' : 'none'};
  width: 55px;
  height: 55px;
  background-color: #ddd;
  border: solid ${props => props.active ? '3px yellow' : '0.5px black'};
  z-index: 1;
  margin-right: 10px;
`;

const BuildingSource = {
    canDrag(props){ //allow dragging only if currentUser === currentTurn
        return props.currentUser === props.currentTurn;
    },

    beginDrag(props){
        props.building.z = 0;
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
    let active = false;
    return (
        <Building_0_Component
            show={props.show}
            ref={instance => connectDragSource(instance)}
            active={active}
            onDragStart={() =>{
                //visually activate building part when dragging: active = true;
                //fetch possibleBuilds only when dragging building part started

            }}
            onClick={() => {
                console.log("Building 0 has been clicked on")
            }}
            click={() => {
                console.log("Building received click()")
            }}
        />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_0)