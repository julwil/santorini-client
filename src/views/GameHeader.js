import React from "react";
import styled from "styled-components";
import {Button, ButtonSecondary} from "./design/Button";
import {Link} from "react-router-dom";
import {COLOR_1, COLOR_5} from "../helpers/layout";

const Container = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const HeaderImage = styled.img`
  height: 80px;
  width: auto;
  margin-top: 10px;
`;

const Turn = styled.div`
  background-color: ${COLOR_1};
  color: ${COLOR_5};
  padding: 3px 8px 5px;
  ;border-radius: 3px;
`;

const GameHeader = (props) => {
    return (
        <Container>
            <Link to={'/users'}><Button>Surrender</Button></Link>
            <HeaderImage src={process.env.PUBLIC_URL+"/assets/images/santorini_banner_logo.png"} alt="Logo"/>
            <Turn>{props.currentTurn === Number(localStorage.getItem('user_id'))?'It\'s your turn':'Your opponent is playing..'}</Turn>
            <ButtonSecondary>Rules</ButtonSecondary>
        </Container>
    );
};

export default GameHeader;
