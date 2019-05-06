import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { handleError } from "../../helpers/handleError";
import Error from "../../helpers/Error";
import {catchError} from "../../helpers/catchError";
import GameHeader from "../../views/GameHeader";
import {COLOR_4, COLOR_5} from "../../helpers/layout";
import BoardField from "./BoardField";
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext, DragDropContextProvider} from 'react-dnd'
import PlayerSidebar from "./PlayerSidebar";

const GameWrapper = styled.div`
  overflow: hidden;
`;
const MainGame = styled.div`
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
`;
export const OpponentSidebar = styled.div`
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

const PlayerSidebarWrapper = styled.div`
  flex-grow: 1;
  background-color: ${COLOR_4};
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
            new_figures: null, //to be replaced by figures
            new_buildings: null, //to be replaced by buildings
            figures:[
                {id:1,user:1,active:false,x:0,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:2,user:1,active:false,x:3,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:3,user:2,active:true,x:1,y:3,possibleMoves:[{x:0,y:2},{x:0,y:3},{x:0,y:4},{x:2,y:2},{x:2,y:4},{x:2,y:3},{x:1,y:2},{x:1,y:4}],possibleBuilds:[{x:0,y:2,z:0},{x:0,y:3,z:0},{x:0,y:4,z:0},{x:1,y:2,z:1}]},
                {id:4,user:2,active:false,x:3,y:2,possibleMoves:[],possibleBuilds:[]},
            ],
            figureMoved: false,
            buildings:[
                {id:1,x:0,y:0,z:0},
                {id:2,x:2,y:1,z:3},
                {id:3,x:2,y:0,z:3},
                {id:4,x:1,y:1,z:3},
                {id:5,x:1,y:2,z:0},
                {id:6,x:4,y:3,z:2},
                {id:7,x:4,y:2,z:0},
                {id:8,x:3,y:2,z:0},
            ],
            newBuilding: {x:null, y:null, z:null},
            initialFigure: {x: null, y: null, z: null},
            possibleBuilds: [{x:0,y:2,z:0},{x:0,y:3,z:0},{x:0,y:4,z:0},{x:1,y:2,z:1}],
            error: [],
            initialMode: false,
        };
        this.intervalGameState = 0;
        this.intervalFigures = 0;
        this.intervalBuildings = 0;
        this.updateInterval = 2000;
    }

    getInitialGame = () => {
        console.log("Figures length: "+this.state.figures.length);
        if(this.state.figures.length < 0 && this.state.buildings.length <= 0){
            this.setState({initialMode: true})
        }
    };

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
                    if (game.currentTurn === this.state.currentUser) {
                        clearInterval(this.intervalGameState);
                    }
                }
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
                if(figures.length > 0){ //add active flag to all figures on game board
                    for(let i=0; i <figures.length; i ++){
                        figures[i].push({active: false});
                    }
                    this.setState({new_figures: figures});
                    if(Number(this.state.currentTurn) === this.state.currentUser){
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

    //fetch possible moves for only the figure that is active, activate figure once clicked on by user
    getPossibleMoves = () => {
        for(let i=0; i < this.state.figures.length; i++){
            if(this.state.figures[i].active){
                fetch(`${getDomain()}/games/${this.state.gameId}/figures/${this.state.figures[i].id}/possibleMoves`,{
                    method: "GET",
                    headers: new Headers({
                        'Authorization': this.state.currentUserToken,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }),
                })
                    .then(handleError)
                    .then(possibleMoves => {
                        this.state.figures[i].push({possibleMoves: possibleMoves})
                    })
                    .catch(err => {
                        catchError(err, this);
                    });
            }
        }
    };

    getPossibleBuilds = () => { //only fetch for that figure that is active and if figure_moved is true
        if(this.state.figureMoved){
            fetch(`${getDomain()}/games/${this.state.gameId}/buildings/possibleBuilds`,{ //Is possible builds related to a figure?
                method: "GET",
                headers: new Headers({
                    'Authorization': this.state.currentUserToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
            })
                .then(handleError)
                .then(possibleBuilds =>{
                    this.setState({possibleBuilds: possibleBuilds})
                })
                .catch(err => {
                    catchError(err, this);
                });
        }
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
    isTargetForBuild = (x,y,z) => {//get x, y of position dragging to and z of building to be dragged
        //this.state.possibleBuilds once using correct data from server

        let figure = this.getActiveFigure();
        if(figure != null && figure.hasOwnProperty('possibleBuilds')){
            let filteredBuilds = figure.possibleBuilds.filter((build) => {return build.x === x && build.y === y && build.z === z});
            return filteredBuilds.length > 0;
        }
        return false;
    };

    updateFigure = (figure, new_x, new_y, new_z) => {
        //update figure position
        let figure_idx = figure.id-1; //figure.id has to be minimized by 1 as otherwise incorrect indexing within figures
        const figures = this.state.figures.slice();
        figures[figure_idx] = {x: new_x, y: new_y, z: new_z, active: false}; //find correct index and not anticipate it
        this.setState({figures: figures});

        let possibleMoveValueSet = this.state.figures.filter((possibleValueSet) => {if(possibleValueSet.x === new_x && possibleValueSet.y === new_y && possibleValueSet.z === new_z){return possibleValueSet}});
        fetch(`${getDomain()}/games/${this.state.gameId}/figures/${figure.id}`, {
            method: "PUT",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(({
                x: possibleMoveValueSet.x,
                y: possibleMoveValueSet.y,
                z: possibleMoveValueSet.z,
            })),
        })
            .then(handleError)
            //should any interval be reestablished to call get fetches to update game board
            .then(() => {
                //update game board
                this.getGameState(); this.getFigures(); this.getBuildings(); this.getPossibleBuilds();

                //this flag shall activate the building, tower parts shall only be selectable from sidebar if figure has already been moved
                this.setState({figureMoved: true});
            })
            .catch(err => {
                catchError(err, this);
            });
    };

    updateBuilding = (new_x, new_y, new_z) => {
        //updating current game board indication
        const newBuildings = this.state.buildings;
        if(this.getBuilding(new_x, new_y) != null){//update existing Building
            let building = newBuildings.filter((building) => {if(building.x === new_x && building.y === new_y){return building}});
            let building_ids = newBuildings.map((building) => {return building.id});
            newBuildings[building_ids.indexOf(building[0].id)] = {id:building[0].id, x: new_x, y: new_y, z: new_z}
        }else{
            //create new building
            newBuildings.push({x: new_x, y: new_y, z: new_z});
        }
        this.setState({buildings: newBuildings});

        //posting request to Backend with new building
        let possibleBuildValueSet = this.state.possibleBuilds.filter(
            (possibleBuildValueSet) => {
                if(possibleBuildValueSet.x === new_x && possibleBuildValueSet.y === new_y && possibleBuildValueSet === new_z){
                    return possibleBuildValueSet
                }});
        fetch(`${getDomain()}/games/${this.state.gameId}/buildings`, {
            method: "POST",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(({
                x: possibleBuildValueSet.x,
                y: possibleBuildValueSet.y,
                z: possibleBuildValueSet.z,
            })),
        })
            .then(handleError)
            .then(() => {
                this.setState({figureMoved: false});
                this.getGameState(); this.getFigures(); this.getBuildings(); this.getPossibleBuilds();
            })
            .catch(err => {
                catchError(err, this);
            });
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
                                     targetForBuild={this.isTargetForBuild}
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
        /**this.intervalGameState = setInterval(this.getGameState, this.updateInterval);
        this.intervalFigures = setInterval(this.getFigures, this.updateInterval);
        this.intervalBuildings = setInterval(this.getBuildings, this.updateInterval);**/
        this.getInitialGame();
    }

    render() {
        return (
            <GameWrapper>
                <GameHeader />
                <MainGame>
                    <OpponentSidebar />
                        <GameBoard>
                            {this.createBoard()}
                        </GameBoard>
                    <PlayerSidebar initialModeActive={this.state.initialMode} figure={this.state.initialFigure} showBuildingParts={this.state.figureMoved} building={this.state.newBuilding}/>
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
