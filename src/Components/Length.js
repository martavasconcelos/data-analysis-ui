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

import {textFieldNumberTheme} from "../Overrides/TextFieldOverride";
import {buttonFindTheme, radioTheme} from "../Overrides/ButtonOverride";
import {apiUrl} from "../config";


class Length extends React.Component {
    constructor() {

        super();

        this.requestLength = this.requestLength.bind(this);
        this.filterByLength = this.filterByLength.bind(this);

        this.state = {
            compare: '',
            length: '',
        };
    }

    handleChange = event => {
        this.setState({
            compare: event.target.value,
            length: ''
        });
    };

    handleInputChange = event => {
        this.setState({length: event.target.value});
    };


    requestLength() {

        this.props.handleLoading(true);

        axios.get(apiUrl + 'allsessions')
            .then(res => {
                console.log("response: ", res);
                this.filterByLength(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }

    filterByLength(sessionsData) {
        if (sessionsData.length > 0) {

            let filteredSessions = [];

            if (this.state.compare === "Biggest") {
                filteredSessions.push(sessionsData[0]._fields[0]);
            }

            if (this.state.compare === "Shortest") {
                filteredSessions.push(sessionsData[sessionsData.length - 1]._fields[0]);
            }

            if (this.state.compare === "Bigger than") {
                sessionsData.forEach((session) => {
                    if (session._fields[1].low > this.state.length) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }

            if (this.state.compare === "Shorter than") {
                sessionsData.forEach((session) => {
                    if (session._fields[1].low < this.state.length) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }
            let filter = `${this.state.compare} ${this.state.length} `;

            this.props.handleLoading(false);
            this.props.handleResult(filteredSessions, filter);
        }

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
                                name="Compare"
                                value={this.state.compare}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="Biggest" control={<Radio/>} label="Biggest"/>
                                <FormControlLabel value="Shortest" control={<Radio/>} label="Shortest"/>
                                <FormControlLabel value="Bigger than" control={<Radio/>} label="Bigger than"/>
                                <FormControlLabel value="Shorter than" control={<Radio/>} label="Shorter than"/>
                            </RadioGroup>
                        </FormControl>
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item xs={4}>

                        <MuiThemeProvider theme={textFieldNumberTheme}>

                            <TextField
                                id="standard-number"
                                label="Number of interactions"
                                onChange={this.handleInputChange}
                                className="input"
                                type="number"
                                disabled={!(this.state.compare === "Bigger than" || this.state.compare === 'Shorter than')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                inputProps={{ min: "0", step: "1" }}

                            />
                        </MuiThemeProvider>

                    </Grid>

                    <Grid item xs={4}>
                        <MuiThemeProvider theme={buttonFindTheme}>
                            <Button variant="contained" onClick={this.requestLength}
                                    disabled={this.state.compare === ''}>
                                Find
                            </Button>
                        </MuiThemeProvider>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


export default Length;

