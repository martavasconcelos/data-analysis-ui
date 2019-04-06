import React from 'react';
import AnalysisTabs from "../Components/AnalysisTabs";
import ResultsPanel from "../Components/ResultsPanel";

import Grid from '@material-ui/core/Grid';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: []};
    }

    render() {
        return (
            <div>

                <AnalysisTabs/>

            </div>);
    }
}

export default Dashboard;