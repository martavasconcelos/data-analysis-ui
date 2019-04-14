import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button/Button";
import axios from "axios";

class ResultsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.downloadJsonFile = this.downloadJsonFile.bind(this);
    }

    downloadJsonFile() {
        this.props.result.forEach(function setFile(session) {
            console.log("tttt", session);
            axios.post('http://localhost:3000/session', {
                session: session
            })
                .then(res => {

                    let dataStr = "data:text/json;charset=utf-8,";

                    res.data.records.map((node) => {
                        let exportObj = res.data.records[0]._fields[0].properties;
                        dataStr += encodeURIComponent(JSON.stringify(exportObj)) + ", \n";
                    });

                    let downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "testSession-" + session + ".json");
                    document.body.appendChild(downloadAnchorNode); // required for firefox
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                })
        });
    }

    render() {

        return (<div className="ResultsPanelStyles">
            <Paper className="PaperStyles">
                {this.props.loading &&
                <p className="noMargin">Getting results...</p>}
                {this.props.result.length > 0 ?
                    <ul className="noMargin">
                        {this.props.result.map((session) => {
                            return <li key={session}>{session}</li>
                        })}
                    </ul>
                    :
                    !this.props.loading &&
                    <p className="noMargin"> No results to show.</p>
                }
            </Paper>
            <Button variant="contained" color="primary" onClick={this.downloadJsonFile}>
                Download
            </Button>
            <Button variant="contained" color="primary" onClick={() => this.props.handleReset()}>
                Reset
            </Button>
        </div>);
    }
}

export default ResultsPanel;