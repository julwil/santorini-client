import React from "react";
import {
    BaseContainer,
    InputField,
    Label,
    ButtonContainer,
    Heading1, Main, MainContainer
} from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import { ButtonSecondary } from "../../views/design/Button";
import { handleError } from "../../helpers/handleError";
import Error from "../../helpers/Error";
import {catchError} from "../../helpers/catchError";

class Games extends React.Component {

    constructor() {
        super();
        this.state = {
            gameId: null,
            game: this.props.location.state.game,
            error: null
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
            <BaseContainer>
                <MainContainer>
                    <Main>
                        <Heading1>Game: {this.state.gameId}</Heading1>
                        <ButtonSecondary
                            width="50%"
                            onClick={() => {
                                this.logout();
                            }}
                        >
                            Logout
                        </ButtonSecondary>
                        <Error errorMessage={this.state.error}/>
                    </Main>
                </MainContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Games);
