import React from "react";
import { DragSource } from 'react-dnd'
import styled from "styled-components";
import {COLOR_1, COLOR_2, COLOR_4, COLOR_5} from "../../helpers/layout";

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
  background-color: ${props => props.currentUser === props.figureOwner ? COLOR_2 : COLOR_4};
  border: 3px solid ${props => props.active ? 'yellow':'grey'};
  box-sizing: border-box;
  border-radius: 30px;
  z-index: 5;
`;

const FigureSource = {
    canDrag(props){ //making figure only draggable if belonging to owner and figure has not yet been moved
        return props.currentUser === props.figure.owner && !props.figureMoved
    },

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
    constructor(props){
        super(props);
        this.state = {
            active: false,
        }
    }
    render() {
        const {isDragging, connectDragSource, figure, currentUser, figureMoved} = this.props;
        return (
            <BoardFigure
                ref={(instance => connectDragSource(instance))}
                id={figure.id}
                figureOwner={figure.owner}
                currentUser={currentUser}
                active={this.state.active}
                onDragStart={() => {
                    //highlighting figure yellow once dragging visually indicating figure is active
                    //activating figure only if figure belongs to currentUser, no figure has been moved yet & figure is not active yet
                    //only get possibleMoves when above applies
                    if(currentUser === figure.owner && !figureMoved && !this.state.active){
                        this.setState({active: true});
                        //activating figure in games required for check
                        this.props.activateFigure(figure.id);
                        this.props.getPossibleMoves();
                    }
                }}
                onDragEnd={() => {
                    //deactivating figure once figure released
                    this.setState({active: false});
                }}
            />
        )
    }
}

export default DragSource('figure', FigureSource, collect)(Figure)