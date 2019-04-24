import React from "react";
import styled from "styled-components";
import {Button, ButtonSecondary} from "./design/Button";
import {Link} from "react-router-dom";

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

const GameHeader = () => {
    return (
        <Container>
            <Link to={'/users'}><Button>Surrender</Button></Link>
            <HeaderImage src={process.env.PUBLIC_URL+"/assets/images/santorini_banner_logo.png"} alt="Logo"/>
            <ButtonSecondary>Rules</ButtonSecondary>
        </Container>
    );
};

export default GameHeader;
