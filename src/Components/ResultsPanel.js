import React, {Fragment} from 'react';
import axios from 'axios';

/* Material UI*/
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button/Button";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import {apiUrl} from "../config";

import {buttonTheme} from '../Overrides/ButtonOverride';
import Grid from "@material-ui/core/Grid/Grid";


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

    saveFilter = () => {
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

    deleteFilter = (event) => {
        console.log("event to delete", event.target.id);
        let toDelete = this.state.resultsToCompare.find(function (element) {
            return element.filter == event.target.id;
        });
        let resultsToCompare = this.state.resultsToCompare;
        resultsToCompare.pop(toDelete);
        this.setState({
            resultsToCompare
        })
    };


    render() {
        console.log("to compare", this.state.resultsToCompare);
        return (<div className="ResultsPanelStyles">
            <Paper className="PaperStyles">
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                        {this.props.loading &&
                        <p className="message">Getting results...</p>}
                        <p> {this.props.filterMessage}</p>
                        <p> {this.props.result.length} results</p>
                        {this.props.result.length > 0 &&
                            <Fragment>
                                {this.props.showCombineOptions &&

                                <Button variant="contained" color="primary" onClick={this.saveFilter}>
                                    Save Filter
                                </Button>}
                                <ul className="noMargin">
                                    {this.props.result.map((session) => {
                                        return <li key={session}>{session}</li>
                                    })}
                                </ul>
                            </Fragment>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {
                            this.props.showCombineOptions &&
                            <Paper>
                                <p>Active Filters</p>
                                {
                                    <ul className="noMargin">
                                        {this.state.resultsToCompare.map((result) => {
                                            return <li key={result.filter} id={result.filter}>{result.filter}
                                                <Button variant="contained" color="secondary"
                                                        onClick={this.deleteFilter}>
                                                    X
                                                </Button>
                                            </li>
                                        })}
                                    </ul>
                                }
                            </Paper>
                        }
                    </Grid>
                </Grid>
            </Paper>
            <MuiThemeProvider theme={buttonTheme}>
                <Button variant="contained" color="primary" onClick={this.downloadJsonFile}>
                    Download
                </Button>
                <Button variant="contained" color="primary"
                        onClick={() => this.props.combineResults(this.state.resultsToCompare)}>
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