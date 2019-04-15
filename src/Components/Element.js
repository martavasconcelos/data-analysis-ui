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

class Element extends React.Component {
    constructor() {

        super();

        this.requestElement = this.requestElement.bind(this);
        this.filterByCompareAction = this.filterByCompareAction.bind(this);

        this.state = {
            path: '',
            compare: '',
        };
    }

    handleChange = event => {
        this.setState({compare: event.target.value});
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

    filterByCompareAction(sessionsData) {
        if (sessionsData.length > 0) {
            let filteredSessions = [];

            if (this.state.compare === "contain") {
                sessionsData.map((session) => {
                    filteredSessions.push(session._fields[0]);

                });
            }

            if (this.state.compare === "begin") {
                sessionsData.map((session) => {
                    if (session._fields[2] == 1.0) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }
            if (this.state.compare === "end") {
                sessionsData.map((session) => {
                    if (session._fields[3]) {
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
                                name="compare"
                                value={this.state.compare}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="contain" control={<Radio/>} label="Contains"/>
                                <FormControlLabel value="begin" control={<Radio/>} label="Begins in"/>
                                <FormControlLabel value="end" control={<Radio/>} label="Ends in"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>

                        <MuiThemeProvider theme={textFieldTheme}>
                            <TextField
                                id="standard-dense"
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
                            <Button variant="contained" color="primary" onClick={this.requestElement}
                                    disabled={(this.state.path === '' || this.state.compare === '')}>
                                Find
                            </Button>
                        </MuiThemeProvider>
                    </Grid>
                </Grid>
            </div>

        );
    }
}

export default Element;

