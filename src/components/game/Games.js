import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { handleError } from "../../helpers/handleError";
import Error from "../../helpers/Error";
import {catchError} from "../../helpers/catchError";
import GameHeader from "../../views/GameHeader";
import {COLOR_5} from "../../helpers/layout";
import BoardField from "./BoardField";
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext, DragDropContextProvider} from 'react-dnd'

const GameWrapper = styled.div`
  overflow: hidden;
`;
const MainGame = styled.div`
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
`;
const PlayerSidebar = styled.div`
  flex-grow: 1;
  margin-right: 20px;
  background-color: ${COLOR_5};
`;
const GameBoard = styled.div`
  background-color: ${COLOR_5};
  height: calc(130px * 5);
`;

const BoardRow = styled.div`
  overflow: hidden;
`;

const OpponentSidebar = styled(PlayerSidebar)`
  margin-right: 0;
  margin-left: 20px;
`;

class Games extends React.Component {

    constructor() {
        super();
        this.state = {
            gameId: null,
            figures:[
                {id:1,user:1,active:false,x:0,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:2,user:1,active:false,x:3,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:3,user:2,active:true,x:1,y:3,possibleMoves:[{x:0,y:3},{x:2,y:3},{x:1,y:2},{x:1,y:4}],possibleBuilds:[]},
                {id:4,user:2,active:false,x:3,y:2,possibleMoves:[],possibleBuilds:[]},
            ],
            buildings:[
                {x:0,y:0,level:0},
                {x:2,y:1,level:3},
                {x:2,y:0,level:3},
                {x:1,y:1,level:3},
                {x:4,y:3,level:2},
                {x:4,y:2,level:0},
                {x:3,y:2,level:0},
            ],
            //game: this.props.location.state.game,
            error: []
        };
    }

    getBuilding = (x,y) => {
        let filteredBuildings = this.state.buildings.filter((building)=>{return building.x === x && building.y === y});
        if(filteredBuildings.length > 0) return filteredBuildings[0];
        return null;
    };
    getFigure = (x,y) => {
        let filteredFigures =  this.state.figures.filter((figure) => {
            return figure.x === x && figure.y === y;
        });
        if(filteredFigures.length > 0) return filteredFigures[0];
        return null;
    };
    getActiveFigure = () => {
        let filteredFigures =  this.state.figures.filter((figure) => {
            return figure.active;
        });
        if(filteredFigures.length > 0) return filteredFigures[0];
        return null;
    };
    isTargetForMove = (x,y) => {
        let figure = this.getActiveFigure();
        if(figure != null && figure.hasOwnProperty('possibleMoves')){
            let filteredMoves = figure.possibleMoves.filter((move) => {return move.x === x && move.y === y});
            console.log(filteredMoves,figure);
            return filteredMoves.length > 0;
        }
        return false;
    };
    isTargetForBuild = (x,y) => {
        let figure = this.getActiveFigure();
        if(figure != null && figure.hasOwnProperty('possibleBuilds')){
            let filteredBuilds = figure.possibleBuilds.filter((build) => {return build.x === x && build.y === y});
            return filteredBuilds.length > 0;
        }
        return false;
    };

    updateFigure = (x,y,figure) => {
        //fetch() PUT TO BACKEND /games/id/figures/id
    };

    updateBuilding = (x,y,building) => {
        if(this.getBuilding(x,y) != null){
            //update existing Building
        }else{
            //create new building
        }
        //fetch() POST TO BACKEND /games/id/building
    };

    createBoard = () => {
        let board = [];

        for (let y = 0; y < 5; y++) {
            let row = [];
            for (let x = 0; x < 5; x++) {
                row.push(<BoardField key={x}
                                     building={this.getBuilding(x,y)}
                                     figure={this.getFigure(x,y)}
                                     targetForMove={this.isTargetForMove(x,y)}
                                     targetForBuild={this.isTargetForBuild(x,y)}
                                     updateFigure={this.updateFigure}
                                     updateBuilding={this.updateBuilding}
                />);
            }
            board.push(<BoardRow key={y}>{row}</BoardRow>);
        }
        return board;
    };

    componentDidMount() {
        this.setState({gameId: this.props.match.params.gamesId});
    }

    logout() {
        fetch(`${getDomain()}/users/logout`, {
            method: "GET",
            headers: new Headers({
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        })
            .then(handleError)
            .then(() => {
                clearInterval(this.intervalUsers);
                clearInterval(this.intervalNotficaton);
                localStorage.clear();
                this.props.history.push("/login")
            })
            .catch(err => {
                catchError(err, this);
            });
    }

    render() {
        return (
            <GameWrapper>
                <GameHeader />
                <MainGame>
                    <PlayerSidebar/>
                    <DragDropContextProvider backend={HTML5Backend}>
                        <GameBoard>
                            {this.createBoard()}
                        </GameBoard>
                    </DragDropContextProvider>
                    <OpponentSidebar/>
                </MainGame>
                <Error error={this.state.error}/>
            </GameWrapper>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Games);
