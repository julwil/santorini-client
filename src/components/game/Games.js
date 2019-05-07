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

    constructor(props) {
        super(props);
        this.state = {
            game: null,
            gameId: null,
            currentUser: Number(localStorage.getItem("user_id")),
            currentUserToken: localStorage.getItem("token"),
            currentTurn: 4,
            new_figures: [], //to be replaced by figures
            new_buildings: [], //to be replaced by buildings
            initialMode: false,
            initialPossibleMoves: [{x:0,y:3,z:0}],
            initialFig1: true,
            initialFig2: true,
            refreshFigures:false,
            figures:[],
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
            possibleBuilds: [{x:0,y:2,z:0},{x:0,y:3,z:0},{x:0,y:4,z:0},{x:1,y:2,z:1}],
            newBuilding: {x:null, y:null, z:null},
            initialFigure: {x: null, y: null, z: null, type: null},
            error: [],
        };
        this.intervalGameState = 0;
        this.intervalFigures = 0;
        this.intervalBuildings = 0;
        this.updateInterval = 2000;
    }

    getInitialMoves = () => {
        console.log("Figures length: "+this.state.figures.length);
        //check if game has just been setup, respectively no figures or buildings on board
        //that doesn't work if first player already placed figures because figures no longer is empty, but game hasn't completely started yet
        //player with current turn should start to place his figures
        console.log(this.state.new_figures.length);
        console.log(this.state.new_buildings.length);
        if(this.state.new_figures.length < 4 && this.state.new_buildings.length === 0){
            fetch(`${getDomain()}/games/${this.props.match.params.gamesId}/figures/possiblePosts`, {
                method: "GET",
                headers: new Headers({
                    'Authorization': this.state.currentUserToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            })
                .then(handleError)
                .then(initialPossibleMoves => {
                    console.log("fetched possiblePosts");
                    this.setState({initialPossibleMoves: initialPossibleMoves, initialMode: true})
                })
                .catch(err => {
                    catchError(err, this);
                });
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
    //getPossibleMoves gets called when figure activated/clicked on
    getPossibleMoves = () => {
        let activeFigure = this.getActiveFigure();
        fetch(`${getDomain()}/games/${this.state.gameId}/figures/${activeFigure.id}/possibleMoves`, { //double check where to fetch possibleMoves and where to
            method: "GET",
            headers: new Headers({
                'Authorization': this.state.currentUserToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        })
            .then(handleError)
            .then(possibleMoves => {
                this.setState({possibleMoves: possibleMoves});
            })
            .catch(err => {
                catchError(err, this);
            });
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
    getFigureById = (id) => {
        let filteredFigures = this.state.figures.filter((figure) => {return figure.id === id});
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
    activateFigure = (id) => {
        let figure = this.getFigureById(id);
        if(this.getActiveFigure() == null && figure != null && figure.userid === this.state.currentTurn){
            let newFigures = this.state.figures.slice();
            figure.active = true;
            newFigures[newFigures.indexOf(figure)] = figure;
            this.setState({ figures: newFigures, refreshFigures: !this.state.refreshFigures });
        }
    };
    isTargetForMove = (x,y) => {
        let figure = this.getActiveFigure();
        if(figure != null && figure.hasOwnProperty('possibleMoves')){ //update possibleMoves according to new data structure
            let filteredMoves = figure.possibleMoves.filter((move) => {return move.x === x && move.y === y});
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

    isTargetForInitialMove = (x,y) => {
        let initialFigures = this.state.initialPossibleMoves;
        if(initialFigures){
            let filteredInitialPossibleMoves = initialFigures.filter((move) => {return move.x === x && move.y === y});
            return filteredInitialPossibleMoves.length > 0;
        }
    };
      
    updateBoard = () => {
        this.getGameState();
        this.getFigures();
        this.getBuildings();
        this.getPossibleBuilds();
    };

    updateInitialFigure = (updating_fig, new_x, new_y, new_z) => {
        const figures = this.state.figures.slice();
        figures.push({x: new_x, y: new_y, z:new_z, active:false});
        this.setState({figures: figures, refreshFigures: !this.state.refreshFigures});
        console.log(updating_fig);
        updating_fig.type === 'fig1' ? this.setState({initialFig1: false}) : this.setState({initialFig2: false});
    };

    updateFigure = (figure, new_x, new_y, new_z) => {
        //update figure position
        let figure_idx = figure.id-1; //figure.id has to be minimized by 1 as otherwise incorrect indexing within figures
        const figures = this.state.figures.slice();
        figures[figure_idx] = {x: new_x, y: new_y, z: new_z, active: false}; //find correct index and not anticipate it
        this.setState({figures: figures, refreshFigures: !this.state.refreshFigures});

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
               this.updateBoard();

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
            let building = newBuildings.filter((building) => {return building.x === new_x && building.y === new_y});
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
                return (possibleBuildValueSet.x === new_x && possibleBuildValueSet.y === new_y && possibleBuildValueSet === new_z)
                });

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
                this.updateBoard();
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
                                     targetForInitialMove={this.isTargetForInitialMove(x,y)}
                                     updateInitialFigure={this.updateInitialFigure}
                                     updateFigure={this.updateFigure}
                                     activateFigure={this.activateFigure}
                                     updateBuilding={this.updateBuilding}
                                     refreshFigures={this.state.refreshFigures}
                />);
            }
            board.push(<BoardRow key={y}>{row}</BoardRow>);
        }
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
        console.log("GameId before fetch: "+this.state.gameId);
        this.getInitialMoves();
        console.log(this.state.initialFig1);
        console.log(this.state.initialMode);
    }

    render() {
        return (
            <GameWrapper>
                <GameHeader currentTurn={this.state.currentTurn}/>
                <MainGame>
                    <OpponentSidebar />
                        <GameBoard>
                            {this.createBoard()}
                        </GameBoard>
                    <PlayerSidebar
                        showInitialFig1={this.state.initialFig1 ? this.state.initialMode : this.state.initialFig1}
                        showInitialFig2={this.state.initialFig2 ? this.state.initialMode : this.state.initialFig2}
                        figure={this.state.initialFigure} showBuildingParts={this.state.figureMoved}
                        building={this.state.newBuilding}
                        refreshFigures={this.state.refreshFigures}
                    />
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
