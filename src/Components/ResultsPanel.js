import React from 'react';
import Paper from '@material-ui/core/Paper';

class ResultsPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("res", this.props.result);
        return (<div className="ResultsPanelStyles">
            <Paper className="PaperStyles">
                    {this.props.result.length > 0 ?
                        <ul className="noMargin">
                            {this.props.result.map((session) => {
                                return <li key={session}>{session}</li>
                            })}
                        </ul>
                        :
                        this.props.loading ?
                            <p className="noMargin">Getting results...</p>
                            :
                            <p className="noMargin"> No results to show.</p>
                    }
            </Paper>
        </div>);
    }
}

export default ResultsPanel;