import React from 'react';

/* Material UI */
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ActionTypes from "./ActionTypes";

class AnalysisTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        return (
            <div className="AnalysisTabsStyles">
                <AppBar position="static">
                    <Tabs value={this.state.value} onChange={this.handleChange}>
                        <Tab label="Action Types"/>
                        <Tab label="Elements"/>
                        <Tab label="Similarity"/>
                        <Tab label="Length"/>
                    </Tabs>
                </AppBar>
                {this.state.value === 0 && <ActionTypes>Item One</ActionTypes>}
            </div>
        );
    }
}

export default AnalysisTabs;