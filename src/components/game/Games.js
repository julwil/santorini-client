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
  height: calc(100% - 20px);
  overflow: hidden;
`;
const MainGame = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: calc(100% - 100px);
`;
const PlayerSidebar = styled.div`
  width: 250px;
  margin-right: 20px;
  background-color: ${COLOR_5};
`;
const GameBoard = styled.div`
  flex-grow: 1;
  background-color: ${COLOR_5};
`;

const BoardRow = styled.div`
  overflow: hidden;
`;

const OpponentSidebar = styled.div`
  width: 250px;
  margin-left: 20px;
  background-color: ${COLOR_5};
`;

class Games extends React.Component {

    constructor() {
        super();
        this.state = {
            gameId: null,
            players:{
                1:{id:1,user:1,active:false},
                2:{id:2,user:1,active:false},
                3:{id:3,user:2,active:true},
                4:{id:4,user:2,active:false},
            },
            board: [
                [{player:null,building:null},{player:null,building:null},{player:null,building:1},{player:4,building:null},{player:null,building:null},],
                [{player:null,building:null},{player:1,building:null},{player:null,building:null},{player:null,building:null},{player:null,building:null},],
                [{player:null,building:null},{player:null,building:null},{player:null,building:null},{player:null,building:null},{player:3,building:null},],
                [{player:null,building:2},{player:null,building:null},{player:null,building:null},{player:null,building:2},{player:null,building:null},],
                [{player:null,building:null},{player:null,building:null},{player:2,building:1},{player:null,building:3},{player:null,building:3},],
            ],
            //game: this.props.location.state.game,
            error: []
        };
    }

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
                        {this.state.board.map( (row,i) => {
                             return <BoardRow key={i}>
                                { row.map((field,j) =>{
                                    return <BoardField key={j} building={field.building} player={this.state.players[field.player]}/>
                                })}
                             </BoardRow>
                        })}
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
