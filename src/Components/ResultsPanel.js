import React from 'react';

class ResultsPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("res", this.props.result);
        return (<div className="ResultsPanelStyles">
            { this.props.result.length >0 ?
                <ul className="noMargin">
                    {this.props.result.map((session) => {
                        return <li key={session}>{session}</li>
                    })}
                </ul>
                :
                <p className="noMargin"> No results to show.</p>
            }
        </div>);
    }
}

export default ResultsPanel;