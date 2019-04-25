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
import {buttonFindTheme} from "../Overrides/ButtonOverride";
import {apiUrl} from "../config";


class Length extends React.Component {
    constructor() {

        super();

        this.requestUrl = this.requestUrl.bind(this);

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

    showResults(sessionsData) {
        let sessions = [];
        if (sessionsData.length > 0) {

            sessionsData.forEach((data)=>{
                sessions.push(data._fields[0]);
            });
        }
            let filter = `Contains ${this.state.url} `;

            this.props.handleLoading(false);
            this.props.handleResult(sessions, filter);

    }

    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <p className='introText'> The URL where the interaction is made by the user is also saved.
                        Sequences can be order by the most visited URL to the less one, or filtered by the ones which
                        contain a specific URL </p>

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
                            <Button variant="contained" color="primary" onClick={this.requestUrl}
                                    disabled={this.state.url === ''}>
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

