import React, {Fragment} from 'react';
import axios from 'axios';

/* Material UI*/
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button/Button";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import {apiUrl} from "../config";

import {largerButtonTheme, checkBoxTheme, deleteButtonTheme} from '../Overrides/ButtonOverride';
import Grid from "@material-ui/core/Grid/Grid";

class ResultsPanel extends React.Component {
    constructor() {
        super();
        this.downloadJsonFile = this.downloadJsonFile.bind(this);
        this.state = {
            filterMessage: '',
            compare: false,
            resultsToCompare: [],
            checked: [],
        }
    }

    handleToggle = value => () => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    downloadJsonFile() {
        this.state.checked.forEach(function setFile(session) {
            axios.post(apiUrl + 'session', {
                session: session
            })
                .then(res => {
                    let dataStr = "data:text/json;charset=utf-8,[";

                    res.data.records.forEach((node, index) => {
                        let exportObj = node._fields[0].properties;
                        if (index === 0) {
                            dataStr += encodeURIComponent(JSON.stringify(exportObj));
                        }
                        else {
                            dataStr += encodeURIComponent(", \n" + JSON.stringify(exportObj));
                        }
                    });
                    dataStr = dataStr + "] \n";

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

    combineResults = () => {
        this.props.combineResults(this.state.resultsToCompare);
        this.setState({
            resultsToCompare: [],
        });
    };

    deleteFilter = (buttonIndex) => {
        console.log("event to delete", buttonIndex);
        let resultsToCompare = this.state.resultsToCompare.filter(function (value, index, arr) {

            return index !== buttonIndex;

        });
        this.setState({
            resultsToCompare
        })
    };


    render() {
        return (
            <div>
                <Paper className='paperResults'>
                    <Grid container spacing={0}>
                        <Grid item xs={7}>
                            <Paper className="PaperStyles">
                                {this.props.loading &&
                                <p className="message">Getting results...</p>}
                                <p> {this.props.filterMessage}</p>
                                <p> {this.props.result.length} results</p>
                                {this.props.result.length > 0 &&
                                <Fragment>
                                    {this.props.showCombineOptions &&
                                    <MuiThemeProvider theme={largerButtonTheme}>
                                        <Button variant="contained" onClick={this.saveFilter}>
                                            Save Filter
                                        </Button>
                                    </MuiThemeProvider>
                                    }
                                    <List className="noMargin">
                                        {this.props.result.map(value => (
                                            <ListItem key={value} role={undefined} dense button
                                                      onClick={this.handleToggle(value)}>
                                                <MuiThemeProvider theme={checkBoxTheme}>
                                                    <Checkbox
                                                        checked={this.state.checked.indexOf(value) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </MuiThemeProvider>
                                                <ListItemText primary={value}/>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Fragment>
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={5}>
                            {
                                this.props.showCombineOptions &&
                                <Fragment>

                                    <p>Active Filters</p>
                                    {
                                        <ul className="noMargin">
                                            {this.state.resultsToCompare.map((result, index) => {
                                                return <li key={result.filter}>
                                                    {result.filter}
                                                    <MuiThemeProvider theme={deleteButtonTheme}>
                                                    <Button variant="contained"
                                                            onClick={() => this.deleteFilter(index)}
                                                            id={index}>
                                                        X
                                                    </Button>
                                                    </MuiThemeProvider>
                                                </li>
                                            })}
                                        </ul>
                                    }
                                    <MuiThemeProvider theme={largerButtonTheme}>
                                        <Button variant="contained"
                                                onClick={this.combineResults}>
                                            Combine ({this.state.resultsToCompare.length})
                                        </Button>
                                        <Button variant="contained" onClick={() => this.handleReset()}>
                                            Reset
                                        </Button>
                                    </MuiThemeProvider>
                                </Fragment>
                            }
                        </Grid>
                    </Grid>
                </Paper>
                <div className='buttonContainer'>
                    <MuiThemeProvider theme={largerButtonTheme}>
                        <Button variant="contained" onClick={this.downloadJsonFile}
                                disabled={this.state.checked.length === 0}>
                            Download
                        </Button>
                        <Button variant="contained" onClick={() => this.props.handleReset()}>
                            Reset
                        </Button>
                    </MuiThemeProvider>
                </div>
            </div>);
    }
}

export default ResultsPanel;