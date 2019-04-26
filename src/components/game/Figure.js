import React from "react";
import { DragSource } from 'react-dnd'
import styled from "styled-components";
import {COLOR_1, COLOR_2, COLOR_5} from "../../helpers/layout";

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
  background-color: ${props => props.user === 1? COLOR_1 : COLOR_2};
  border: 3px solid ${props => props.active? 'yellow':'grey'};
  box-sizing: border-box;
  border-radius: 30px;
  z-index: 5;
`;

const FigureSource = {
    beginDrag(props) { //returning only figure as to only item to be dropped
        return props.figure;
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

class Figure extends React.Component {
    render() {
        const {isDragging, connectDragSource, figure} = this.props;
        return (
            <BoardFigure
                ref={figure.active ? (instance => connectDragSource(instance)): {}}
                id={figure.id}
                user={figure.user}
                active={figure.active}
            />
        )
    }
}

export default DragSource('figure', FigureSource, collect)(Figure)