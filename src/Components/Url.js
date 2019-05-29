import React from 'react';
import axios from 'axios';

/* Material UI */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid/Grid";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import {textFieldTextTheme} from "../Overrides/TextFieldOverride";
import {buttonFindTheme, buttonOrderTheme} from "../Overrides/ButtonOverride";
import {apiUrl} from "../config";


class Length extends React.Component {
    constructor() {

        super();

        this.requestUrl = this.requestUrl.bind(this);
        this.requestUrlBySession = this.requestUrlBySession.bind(this);

        this.state = {
            url: '',
        };
    }

    handleInputChange = event => {
        this.setState({url: event.target.value});
    };

    requestUrl() {
        this.props.handleLoading(true);

        axios.post(apiUrl + 'url', {
            url: this.state.url
        })
            .then(res => {
                console.log("response: ", res);
                this.showResults(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }

    requestUrlBySession() {
        this.props.handleLoading(true);

        axios.get(apiUrl + 'urlsession')
            .then(res => {
                console.log("response: ", res);
                this.getTestCases(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }

    showResults(sessionsData) {
        let sessions = [];
        if (sessionsData.length > 0) {

            sessionsData.forEach((data) => {
                sessions.push(data._fields[0]);
            });
        }
        let filter = `Contains ${this.state.url} `;

        this.props.handleLoading(false);
        this.props.handleResult(sessions, filter);

    }


    getTestCases(sessionsData) {
        console.log("sessions data: ", sessionsData);
        let sessions = [];
        let testedUrls = [];
       // let toAnalyze = [];

        if (sessionsData.length > 0) {
            let sessionsToAdd = [...sessionsData];

            for (let i = 0; i < sessionsData.length; i++) {
                let orderedSessions = [];
                if (i === 0) {
                    testedUrls = testedUrls.concat(sessionsData[i]._fields[1]);
                    sessions.push(sessionsData[i]._fields[0]);
                    sessionsToAdd.shift();
                }
                else {
                    orderedSessions = this.reOrderArray(testedUrls, sessionsToAdd);
                    let item = orderedSessions[0];
                    sessions.push(item.session);
                    testedUrls = testedUrls.concat(item.urlsToTest);
                    sessionsToAdd = this.removeItemFromSessions(item, sessionsToAdd);
                  //  toAnalyze.push({session: item.session, tested: testedUrls.length});
                }
            }

        }
        let filter = `Order by the most diverse test to the less diverse`;
//console.log("toAnalyze",toAnalyze);
        this.props.handleLoading(false);
        this.props.handleResult(sessions, filter);

    }

    reOrderArray(testedUrls, sessionsData) {
        let orderedSessions = [];

        sessionsData.forEach((session) => {
            let urlsToTest = this.getUrlsToTest(session._fields[1], testedUrls);
            orderedSessions.push({session: session._fields[0], urls: session._fields[1], urlsToTest: urlsToTest});
        });

        orderedSessions.sort((a, b) => parseFloat(b.urlsToTest.length) - parseFloat(a.urlsToTest.length));

        return orderedSessions;
    }

    getUrlsToTest(sessionUrls, testedUrls) {
        let urlsToTest = [];
        sessionUrls.forEach((url) => {
            if (!testedUrls.includes(url)) {
                urlsToTest.push(url);
            }
        });
        return urlsToTest;
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

    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <Grid item xs={8}>
                        <MuiThemeProvider theme={textFieldTextTheme}>
                            <TextField
                                id="standard-dense"
                                label="URL"
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
                            <Button variant="contained" onClick={this.requestUrl}
                                    disabled={this.state.url === ''}>
                                Find
                            </Button>
                        </MuiThemeProvider>
                    </Grid>
                    <MuiThemeProvider theme={buttonOrderTheme}>

                    <Button variant="contained" onClick={this.requestUrlBySession}>
                        Order by most diverse
                    </Button>

                    <Button variant="contained" onClick={this.requestUrlBySession}>
                        Order by most common
                    </Button>
                    </MuiThemeProvider>

                </Grid>
            </div>
        );
    }
}


export default Length;

