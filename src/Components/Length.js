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

import {textFieldTheme} from "../Overrides/TextFieldOverride";
import {buttonFindTheme} from "../Overrides/ButtonOverride";
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
        this.setState({compare: event.target.value});
        console.log("th", this.state.compare);
    };

    handleInputChange = event => {
        this.setState({length: event.target.value});
    };


    async requestLength() {

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

            if (this.state.compare === "biggest") {
                filteredSessions.push(sessionsData[0]._fields[0]);
            }

            if (this.state.compare === "shortest") {
                filteredSessions.push(sessionsData[this.state.sessionsData.length - 1]._fields[0]);
            }

            if (this.state.compare === "biggerThan") {
                sessionsData.map((session) => {
                    if (session._fields[1].low > this.state.length) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }

            if (this.state.compare === "shorterThan") {
                sessionsData.map((session) => {
                    if (session._fields[1].low < this.state.length) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }

            this.props.handleLoading(false);
            this.props.handleResult(filteredSessions);
        }

    }

    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <p className='introText'> User interactions are saved as one of four types: click, input, drag and
                        drop or double click.
                        Sequences can be filtered by the number of different action types they have. </p>
                    <Grid item xs={4}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Compare"
                                name="Compare"
                                value={this.state.compare}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="biggest" control={<Radio/>} label="Biggest"/>
                                <FormControlLabel value="shortest" control={<Radio/>} label="Shortest"/>
                                <FormControlLabel value="biggerThan" control={<Radio/>} label="Bigger than"/>
                                <FormControlLabel value="shorterThan" control={<Radio/>} label="Shorter than"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>

                        <MuiThemeProvider theme={textFieldTheme}>

                            <TextField
                                id="standard-number"
                                label="Number of interactions"
                                onChange={this.handleInputChange}
                                className="input"
                                type="number"
                                disabled={!(this.state.compare === "biggerThan" || this.state.compare === 'shorterThan')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                        </MuiThemeProvider>

                    </Grid>

                    <Grid item xs={4}>
                        <MuiThemeProvider theme={buttonFindTheme}>
                            <Button variant="contained" color="primary" onClick={this.requestLength}
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

