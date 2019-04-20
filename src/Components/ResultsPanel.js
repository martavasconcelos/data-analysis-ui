import React, {Fragment} from 'react';
import axios from 'axios';

/* Material UI*/
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button/Button";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {apiUrl} from "../config";

import {buttonTheme} from '../Overrides/ButtonOverride';
import Messages from "../Messages";


class ResultsPanel extends React.Component {
    constructor() {
        super();
        this.downloadJsonFile = this.downloadJsonFile.bind(this);
        this.state = {
            filterMessage: '',
            compare: false,
            resultsToCompare: [],
        }
    }

    downloadJsonFile() {
        this.props.result.forEach(function setFile(session) {
            axios.post(apiUrl + 'session', {
                session: session
            })
                .then(res => {

                    let dataStr = "data:text/json;charset=utf-8,";

                    res.data.records.forEach((node) => {
                        let exportObj = node._fields[0].properties;
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

    handleChange = () => {
        let resultsToCompare = this.state.resultsToCompare;
        resultsToCompare.push({filter: this.props.filterMessage, result: this.props.result})
        this.setState({
            resultsToCompare
        })
    };

    handleReset = () => {
        this.props.handleReset();
        this.setState({
            resultsToCompare: [],
        });
    };


    render() {
        console.log("to compare", this.props.combineResults);
        return (<div className="ResultsPanelStyles">
            <Paper className="PaperStyles">
                <p> {this.props.filterMessage}</p>
                {this.props.loading &&
                <p className="message">Getting results...</p>}
                {this.props.result.length > 0 ?
                    <Fragment>
                        <Button variant="contained" color="primary" onClick={this.handleChange}>
                            Save to Combine
                        </Button>
                        <ul className="noMargin">
                            {this.props.result.map((session) => {
                                return <li key={session}>{session}</li>
                            })}
                        </ul>
                    </Fragment>
                    :
                    !this.props.loading &&
                    <p className="message"> No results to show.</p>
                }


            </Paper>
            <MuiThemeProvider theme={buttonTheme}>
                <Button variant="contained" color="primary" onClick={this.downloadJsonFile}>
                    Download
                </Button>
                <Button variant="contained" color="primary" onClick={()=>this.props.combineResults(this.state.resultsToCompare)}>
                    Combine Results ({this.state.resultsToCompare.length})
                </Button>
                <Button variant="contained" color="primary" onClick={() => this.handleReset()}>
                    Reset Combine
                </Button>
            </MuiThemeProvider>
        </div>);
    }
}

export default ResultsPanel;