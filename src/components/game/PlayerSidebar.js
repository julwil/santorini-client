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

const Container = styled.div`
  flex-grow: 1;
  background-color: ${COLOR_4};
  margin-right: 0;
  margin-left: 20px;
`;

class PlayerSidebar extends React.Component {

    render() {
        return (
            <Container>
                <Figure_1 show={this.props.showInitialFig1} figure={this.props.figure}/>
                <Figure_2 show={this.props.showInitialFig2} figure={this.props.figure}/>
                <Building_3 show={this.props.showBuildingParts} building={this.props.building}/>
                <Building_2 show={this.props.showBuildingParts} building={this.props.building}/>
                <Building_1 show={this.props.showBuildingParts} building={this.props.building}/>
                <Building_0 show={this.props.showBuildingParts} building={this.props.building}/>
            </Container>
        )
    }
}

export default withRouter(PlayerSidebar);