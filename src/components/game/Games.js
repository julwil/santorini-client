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
            game: null,
            gameId: null,
            currentUser: Number(localStorage.getItem("user_id")),
            currentUserToken: localStorage.getItem("token"),
            current_Turn: null,
            new_figures: null,
            new_buildings: null,
            figures:[
                {id:1,user:1,active:false,x:0,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:2,user:1,active:false,x:3,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:3,user:2,active:true,x:1,y:3,possibleMoves:[{x:0,y:2},{x:0,y:3}, {x:0,y:4},{x:2,y:2},{x:2,y:4},{x:2,y:3},{x:1,y:2},{x:1,y:4}],possibleBuilds:[]},
                {id:4,user:2,active:false,x:3,y:2,possibleMoves:[],possibleBuilds:[]},
            ],
            figure_moved: false,
            buildings:[
                {x:0,y:0,level:0},
                {x:2,y:1,level:3},
                {x:2,y:0,level:3},
                {x:1,y:1,level:3},
                {x:1,y:2,level:0},
                {x:4,y:3,level:2},
                {x:4,y:2,level:0},
                {x:3,y:2,level:0},
            ],
            error: []
        };
        this.intervalGameState = 0;
        this.intervalFigures = 0;
        this.intervalBuildings = 0;
        this.updateInterval = 2000;
    }

    //fetch game state: at 2 s interval if not currently user's turn, otherwise fetch only once
    getGameState = () => {
        fetch(`${getDomain()}/games/${this.state.gameId}`, {
            method: "GET",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        })
            .then(handleError)
            .then(game => {
                if(game !== null){ //should actually be game.length > 0
                    this.setState({game: game, currentTurn: game.currentTurn});
                    console.log("Current turn: "+game.currentTurn);
                    if (game.currentTurn === this.state.currentUser) {
                        clearInterval(this.intervalGameState);
                    }
                }
                console.log("GameId fetched: "+game.id);
            })
            .catch(err => {
                catchError(err, this);
            });
    };

    //fetch all figures: at 2 s interval if not currently user's turn, otherwise fetch only once
    getFigures = () => {
        fetch(`${getDomain()}/games/${this.state.gameId}/figures`, {
            method: "GET",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        })
            .then(handleError)
            //should any interval be reestablished to call get fetches to update game board
            .then(figures => {
                if(figures.length > 0){
                    this.setState({new_figures: figures});
                    if(Number(this.state.currentTurn) === Number(this.state.currentUser)){
                        console.log("Clearing interval");
                        clearInterval(this.intervalFigures);
                    }
                }
            })
            .catch(err => {
                catchError(err, this);
            });
    };

    //fetch all buildings: at 2 s interval if not currently user's turn, otherwise fetch only once
    getBuildings = () => {
        fetch(`${getDomain()}/games/${this.state.gameId}/buildings`, {
            method: "GET",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        })
            .then(handleError)
            //should any interval be reestablished to call get fetches to update game board
            .then(buildings => {
                if(buildings.length > 0){
                    this.setState({new_buildings: buildings});
                    if(this.state.currentTurn === this.state.currentUser){
                        clearInterval(this.intervalBuildings);
                    }
                }
            })
            .catch(err => {
                catchError(err, this);
            });

    };

    getBuilding = (x,y) => {
        let filteredBuildings = this.state.buildings.filter((building)=>{return building.x === x && building.y === y});
        if(filteredBuildings.length > 0) return filteredBuildings[0];
        return null;
    };
    getFigure = (x,y) => {
        let filteredFigures = this.state.figures.filter((figure) => {return figure.x === x && figure.y === y});
        if(filteredFigures.length > 0) return filteredFigures[0];
        return null;
    };
    getActiveFigure = () => {
        let filteredFigures = this.state.figures.filter((figure) => {
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

    updateFigure = (figure, new_x, new_y, new_figure_level) => {
        //update figure position
        let figure_idx = figure.id-1; //figure.id has to be minimized by 1 as otherwise incorrect indexing within figures

        //helpers:
        /**console.log("figure before: "+this.state.figures[figure_idx].x+", "+this.state.figures[figure_idx].y);
        let newFigure = {...this.state.figures};
        newFigure[figure_idx].x = new_x; newFigure[figure_idx].y = new_y;
        console.log("newFigure: "+newFigure[figure_idx].x +", "+newFigure[figure_idx].y);
        console.log("figure after: "+this.state.figures[figure_idx].x+", "+this.state.figures[figure_idx].y);
        for(let i=0; i<this.state.figures.length; i++){
            console.log("figure ids: "+ this.state.figures[i].id);
            console.log("figure coordinates: "+this.state.figures[i].x, this.state.figures[i].y);
        }**/

        const figures = this.state.figures.slice();
        figures[figure_idx] = {x: new_x, y: new_y, level: new_figure_level, active: false}; //find correct index and not anticipate which
        this.setState({figures: figures});
        console.log("New figure length: "+figures.length);

        console.log("Figures data: ");
        for(let i=0; i<this.state.figures.length; i++){
            console.log("figure ids: "+ this.state.figures[i].id);
            console.log("X: "+this.state.figures[i].x, "Y: "+this.state.figures[i].y, "Level: "+this.state.figures[i].level);
            console.log("figure active: "+ this.state.figures[i].active);
            //console.log("figure coordinates: "+this.state.figures[i].x, this.state.figures[i].y);
        }


        //updating position of figure
        //this.setState({figures: {...this.state.figures, [figure.id]: {x: new_x, y: new_y}}});

        /**this.state.figures[figure_idx].x = new_x;
        this.state.figures[figure_idx].y = new_y;
        this.state.figures[figure_idx].level = new_figure_level;
        this.state.figures[figure_idx].active = false;
        this.setState({figures: this.state.figures});**/

        //helpers:
        /**console.log(this.state.figures.length);
        for(let i=0; i<this.state.figures.length; i++){
            console.log("figure ids: "+ this.state.figures[i].id);
            console.log("figure active: "+ this.state.figures[i].active);
            console.log("figure coordinates: "+this.state.figures[i].x, this.state.figures[i].y);
        }**/
        //this.setState({figures: {...this.state.figures, [figure.id]: {x: new_x, y: new_y}}});

        fetch(`${getDomain()}/games/` + this.state.gameId + `/figures`, {
            method: "PUT",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: JSON.stringify(({
                user: this.state.user,
                figure: figure,
            })),
        })
            .then(handleError)
            //should any interval be reestablished to call get fetches to update game board
            .then(() => {
                //this flag shall activate the building, tower parts shall only be selectable from sidebar if figure has already been moved
                this.setState({figure_moved: true,});

                //update game board
                this.getGameState(); this.getFigures(); this.getBuildings();
            })
            .catch(err => {
                catchError(err, this);
            });
    };

    updateBuilding = (x, y, new_buildingLevel) => {
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
                                     field_x_coordinate = {x}
                                     field_y_coordinate = {y}
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
        console.log("GameId: "+this.state.gameId);
        return board;
    };

    logout() { //remove
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

    componentDidMount() {
        this.setState({gameId: this.props.match.params.gamesId});
        this.intervalGameState = setInterval(this.getGameState, this.updateInterval);
        this.intervalFigures = setInterval(this.getFigures, this.updateInterval);
        this.intervalBuildings = setInterval(this.getBuildings, this.updateInterval);
    }

    render() {
        return (
            <GameWrapper>
                <GameHeader />
                <MainGame>
                    <PlayerSidebar/>
                        <GameBoard>
                            {this.createBoard()}
                        </GameBoard>
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

export default withRouter(DragDropContext(HTML5Backend)(Games));
