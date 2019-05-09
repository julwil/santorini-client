import React from "react";
import styled from "styled-components";
import {withRouter} from "react-router-dom";
import {COLOR_3, COLOR_4, COLOR_5} from "../../helpers/layout";
import Building_0 from "./SidebarComponents/Building_0";
import Building_1 from "./SidebarComponents/Building_1";
import Building_2 from "./SidebarComponents/Building_2";
import Building_3 from "./SidebarComponents/Building_3";
import Figure_1 from "./SidebarComponents/Figure_1";
import Figure_2 from "./SidebarComponents/Figure_2";

const Sidebar = styled.div`
  width: 270px;
  margin-right: 20px;
  background-color: ${COLOR_5};
`;

export const SidebarHeader = styled.div`
  height: 200px;
  text-align: center;
  margin-bottom: 20px;
`;

export const GodCard = styled.img`
  margin: 0 auto;
  height: 150px;
`;

const Container = styled.div`
  background-color: ${COLOR_4};
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Hint = styled.h3`
  text-align: center;
`;

class PlayerSidebar extends React.Component {

    render() {
        return (
            <Sidebar>
                <SidebarHeader>
                    <h2>{this.props.name}</h2>
                    <GodCard src={process.env.PUBLIC_URL+"/assets/godcards/"+this.props.godcard+".png"}/>
                </SidebarHeader>
                <Hint>
                    {this.props.showBuildingParts?'Please select a figure, move it and then place a building:':
                        (this.props.showInitalFig1 || this.props.showInitialFig2)?'Please place your figures:':'Please wait...'}
                </Hint>
                <Container>
                    <Figure_1 show={this.props.showInitialFig1} figure={this.props.figure}/>
                    <Figure_2 show={this.props.showInitialFig2} figure={this.props.figure}/>
                    <Building_0 show={this.props.showBuildingParts} building={this.props.building}/>
                    <Building_1 show={this.props.showBuildingParts} building={this.props.building}/>
                    <Building_2 show={this.props.showBuildingParts} building={this.props.building}/>
                    <Building_3 show={this.props.showBuildingParts} building={this.props.building}/>
                </Container>
            </Sidebar>
        )
    }
}

export default withRouter(PlayerSidebar);