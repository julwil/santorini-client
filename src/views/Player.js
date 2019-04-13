import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import {COLOR_6} from "../helpers/layout";

const Online = styled.div`
  &:hover {
    transform: scaleX(1.05);
    background-color: #1b7ab8;
  }
  margin: 6px 0;
  width: 330px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #5CFF1F;
`;

const Blocked = styled.div`
  &:hover {
    transform: scaleX(1.05);
    background-color: #1b7ab8;
  }
  margin: 6px 0;
  width: 330px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #FF795E;
`;

const Offline = styled.div`
  &:hover {
    transform: scaleX(1.05);
    background-color: #1b7ab8;
  }
  margin: 6px 0;
  width: 330px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const Username = styled.div`
  font-weight: bold;
  color: ${COLOR_6};
`;

const UserState = styled.div`
  font-weight: lighter;
  margin-left: 5px;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Player = ({ user }) => {
    switch (user.status) {
        case 'ONLINE':
            return (
                <Online>
                    <Username>{user.username}</Username>
                    <UserState>{user.status}</UserState>
                    <Id>Id: {user.id}</Id>
                </Online>
            );
        case 'CHALLENGED':
            return (
                <Blocked>
                    <Username>{user.username}</Username>
                    <UserState>{user.status}</UserState>
                    <Id>Id: {user.id}</Id>
                </Blocked>
            );
        case 'PLAYING':
            return (
                <Blocked>
                    <Username>{user.username}</Username>
                    <UserState>{user.status}</UserState>
                    <Id>Id: {user.id}</Id>
                </Blocked>
            );
        default:
            return (
                <Offline>
                    <Username>{user.username}</Username>
                    <UserState>{user.status}</UserState>
                    <Id>Id: {user.id}</Id>
                </Offline>
            );
    }
};

export default Player;
