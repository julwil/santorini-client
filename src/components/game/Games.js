import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { handleError } from "../../helpers/handleError";
import Error from "../../helpers/Error";
import {catchError} from "../../helpers/catchError";
import GameHeader from "../../views/GameHeader";
import {COLOR_5} from "../../helpers/layout";
import {BoardField} from "./BoardField";

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
            players:[
                {id:1,user:1,active:false,x:0,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:2,user:1,active:false,x:3,y:0,possibleMoves:[],possibleBuilds:[]},
                {id:3,user:2,active:true,x:1,y:3,possibleMoves:[{x:0,y:3},{x:2,y:3},{x:1,y:2},{x:1,y:4}],possibleBuilds:[]},
                {id:4,user:2,active:false,x:3,y:2,possibleMoves:[],possibleBuilds:[]},
            ],
            buildings:[
                {x:0,y:0,level:1},
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
    getPlayer = (x,y) => {
        let filteredPlayers =  this.state.players.filter((player) => {
            return player.x === x && player.y === y;
        });
        if(filteredPlayers.length > 0) return filteredPlayers[0];
        return null;
    };
    getActivePlayer = () => {
        let filteredPlayers =  this.state.players.filter((player) => {
            return player.active;
        });
        if(filteredPlayers.length > 0) return filteredPlayers[0];
        return null;
    };
    isTargetForMove = (x,y) => {
        let player = this.getActivePlayer();
        if(player != null && player.hasOwnProperty('possibleMoves')){
            let filteredMoves = player.possibleMoves.filter((move) => {return move.x === x && move.y === y});
            console.log(filteredMoves,player);
            return filteredMoves.length > 0;
        }
        return false;
    };
    isTargetForBuild = (x,y) => {
        let player = this.getActivePlayer();
        if(player != null && player.hasOwnProperty('possibleBuilds')){
            let filteredBuilds = player.possibleBuilds.filter((build) => {return build.x === x && build.y === y});
            return filteredBuilds.length > 0;
        }
        return false;
    };
    createBoard = () => {
        let board = [];

        for (let y = 0; y < 5; y++) {
            let row = [];
            for (let x = 0; x < 5; x++) {
                row.push(<BoardField key={x}
                                     building={this.getBuilding(x,y)}
                                     player={this.getPlayer(x,y)}
                                     targetForMove={this.isTargetForMove(x,y)}
                                     targetForBuild={this.isTargetForBuild(x,y)}
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
                    <PlayerSidebar />
                    <GameBoard>
                        {this.createBoard()}
                    </GameBoard>
                    <OpponentSidebar />
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
