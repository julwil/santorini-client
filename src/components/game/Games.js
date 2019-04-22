import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { handleError } from "../../helpers/handleError";
import Error from "../../helpers/Error";
import {catchError} from "../../helpers/catchError";
import GameHeader from "../../views/GameHeader";
import {COLOR_5} from "../../helpers/layout";

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
                    <GameBoard />
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
