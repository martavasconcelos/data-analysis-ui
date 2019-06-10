import React from 'react';
import axios from 'axios';

/* Material UI */
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid/Grid";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import {textFieldTextTheme} from "../Overrides/TextFieldOverride";
import {buttonFindTheme, buttonOrderTheme, radioTheme} from "../Overrides/ButtonOverride";
import {apiUrl} from "../config";

class Element extends React.Component {
    constructor() {

        super();

        this.requestElement = this.requestElement.bind(this);
        this.filterByCompareAction = this.filterByCompareAction.bind(this);
        this.requestPathIdBySession = this.requestPathIdBySession.bind(this);

        this.state = {
            path: '',
            compare: '',
        };
    }

    handleChange = event => {
        this.setState({
            compare: event.target.value
        });
    };

    handleInputChange = event => {
        this.setState({path: event.target.value});
    };

    requestElement() {
        this.props.handleLoading(true);

        axios.post(apiUrl + 'element', {path: this.state.path})
            .then(res => {
                console.log("response: ", res);
                this.filterByCompareAction(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }

    requestPathIdBySession() {
        this.props.handleLoading(true);

        axios.get(apiUrl + 'pathsession')
            .then(res => {
                console.log("response: ", res);
                this.getTestCases(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }
    getTestCases(sessionsData) {
        console.log("sessions data: ", sessionsData);
        let sessions = [];
        let testedPathIds = [];

        if (sessionsData.length > 0) {
            let sessionsToAdd = [...sessionsData];

            for (let i = 0; i < sessionsData.length; i++) {
                let orderedSessions = [];
                if (i === 0) {
                    testedPathIds = testedPathIds.concat(sessionsData[i]._fields[1]);
                    sessions.push(sessionsData[i]._fields[0]);
                    sessionsToAdd.shift();
                }
                else {
                    orderedSessions = this.reOrderArray(testedPathIds, sessionsToAdd);
                    let item = orderedSessions[0];
                    if(item.pathIdsToTest.length > 0){
                        sessions.push(item.session);
                        testedPathIds = testedPathIds.concat(item.pathIdsToTest);
                        sessionsToAdd = this.removeItemFromSessions(item, sessionsToAdd);
                    }
                }
            }

        }
        let filter = `Order by the most diverse test to the less diverse`;
        this.props.handleLoading(false);
        this.props.handleResult(sessions, filter);

    }

    reOrderArray(testedPathIds, sessionsData) {
        let orderedSessions = [];

        sessionsData.forEach((session) => {
            let pathIdsToTest = this.getUrlsToTest(session._fields[1], testedPathIds);
            orderedSessions.push({session: session._fields[0], pathIds: session._fields[1], pathIdsToTest: pathIdsToTest});
        });

        orderedSessions.sort((a, b) => parseFloat(b.pathIdsToTest.length) - parseFloat(a.pathIdsToTest.length));

        return orderedSessions;
    }

    getUrlsToTest(sessionPathIds, testedPathIds) {
        let pathIdsToTest = [];
        sessionPathIds.forEach((pathId) => {
            if (!testedPathIds.includes(pathId)) {
                pathIdsToTest.push(pathId);
            }
        });
        return pathIdsToTest;
    }

    removeItemFromSessions(item, sessions) {
        let final = [];
        sessions.forEach((data) => {
            if (data._fields[0] !== item.session) {
                final.push(data);
            }
        });
        return final;
    }

    filterByCompareAction(sessionsData) {
        let filteredSessions = [];
        if (sessionsData.length > 0) {

            if (this.state.compare === "Contains") {
                sessionsData.forEach((session) => {
                    filteredSessions.push(session._fields[0]);

                });
            }

            if (this.state.compare === "Begins in") {
                sessionsData.forEach((session) => {
                    if (session._fields[2] == 1.0) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }
            if (this.state.compare === "Ends in") {
                sessionsData.forEach((session) => {
                    if (session._fields[3]) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }
        }

        let filter = `${this.state.compare} ${this.state.path} `;
        this.props.handleLoading(false);
        this.joinEqualSessions(filteredSessions, filter);
    }

    joinEqualSessions(filteredSessions, filter) {
        let newArrayOfFilteredSessions = [];

        filteredSessions.forEach((session) => {
            let add = true;
            newArrayOfFilteredSessions.forEach((newFilteredSession) => {
                if(session === newFilteredSession){
                    add = false;
                }
            });
            if(add){
            newArrayOfFilteredSessions.push(session);
            }
        });

        this.props.handleResult(newArrayOfFilteredSessions, filter);

    }

    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        <MuiThemeProvider theme={radioTheme}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Compare"
                                name="compare"
                                value={this.state.compare}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="Contains" control={<Radio/>} label="Contains"/>
                                <FormControlLabel value="Begins in" control={<Radio/>} label="Begins in"/>
                                <FormControlLabel value="Ends in" control={<Radio/>} label="Ends in"/>
                            </RadioGroup>
                        </FormControl>
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item xs={4}>

                        <MuiThemeProvider theme={textFieldTextTheme}>
                            <TextField
                                id="standard-dense"
                                multiline = "true"
                                label="Element's XPath"
                                onChange={this.handleInputChange}
                                className="input"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item xs={4}>
                        <MuiThemeProvider theme={buttonFindTheme}>
                            <Button variant="contained" onClick={this.requestElement}
                                    disabled={(this.state.path === '' || this.state.compare === '')}>
                                Find
                            </Button>
                        </MuiThemeProvider>
                    </Grid>
                    <MuiThemeProvider theme={buttonOrderTheme}>
                        <Button variant="contained" onClick={this.requestPathIdBySession}>
                            Order by most diverse
                        </Button>
                    </MuiThemeProvider>
                </Grid>
            </div>

        );
    }
}

export default Element;

