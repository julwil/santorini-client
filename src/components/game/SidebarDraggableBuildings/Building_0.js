import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'
import {withRouter} from "react-router-dom";
import {COLOR_3, COLOR_4, COLOR_5} from "../../../helpers/layout";

const Container = styled.div`
  flex-grow: 1;
  background-color: ${COLOR_4};
  margin-right: 0;
  margin-left: 20px;
`;

const BoardItem = styled.div`
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Building_3 = styled(BoardItem)`
  width: 50px;
  height: 50px;
  border-radius: 40px;
  background-color: ${COLOR_3}; 
  z-index: 4; 
`;
const Building_2 = styled(BoardItem)`
  width: 60px;
  height:60px;
  background-color: #fff;
  z-index: 3;  
`;
const Building_1 = styled(BoardItem)`
  width: 100px;
  height: 100px;
  border-radius: 70px;
  background-color: #eee;  
  z-index: 2;
`;
const Building_0_Component = styled(BoardItem)`
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
    //props.building.level = 0;
    const {isDragging, connectDragSource, building} = props;
    return (
        <Building_0_Component ref={instance => connectDragSource(instance)} />
    )
}

export default DragSource('building', BuildingSource, collect)(Building_0)