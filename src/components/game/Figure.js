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
    canDrag(props){
        return props.currentUser === props.figure.owner && !props.figureMoved //does this really make sense?
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
                //use local variable as state variable asynchronous and not quick enough to indicate change in time
                //making figure only draggable if belonging to owner through canDrag() above
                ref={(instance => connectDragSource(instance))}
                id={figure.id}
                figureOwner={figure.owner}
                currentUser={currentUser}
                active={this.state.active}
                onDragStart={() => { //TODO: use onDragEnter()
                    //highlighting figure yellow once dragging visually indicating figure is active -> Done
                    //+ activating drag & drop -> drag and drop only if figure belongs to currentUser
                    //there shall only be one figure active at the same time
                    //only allow figure to be moved
                    if(currentUser === figure.owner && !figureMoved){
                        this.setState({active: true});
                        //activating figure in games required for check
                        this.props.activateFigure(figure.id);
                        this.props.getPossibleMoves();
                    }

                    console.log("Drag start")
                }}
                onDragEnd={() => {
                    console.log("Drag end");
                    this.setState({active: false});
                }}
                /*onClick={()=>{
                    this.setState({active: true});
                    console.log("Figure has been clicked");

                }}*/
            />
        )
    }
}

export default DragSource('figure', FigureSource, collect)(Figure)