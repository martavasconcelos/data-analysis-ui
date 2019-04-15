import React from 'react';
import axios from 'axios';

/* Material UI */
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Grid from "@material-ui/core/Grid/Grid";

import {textFieldTheme} from '../Overrides/TextFieldOverride';
import {buttonFindTheme} from '../Overrides/ButtonOverride';
import {apiUrl} from "../config";

class ActionTypes extends React.Component {
    constructor(props) {

        super(props);

        this.requestActionTypes = this.requestActionTypes.bind(this);
        this.filterToShow = this.filterToShow.bind(this);

        this.state = {
            operator: '',
            threshold: '',
        };
    }

    handleChange = event => {
        this.setState({operator: event.target.value});
    };

    handleInputChange = event => {
        this.setState({threshold: event.target.value});
    };


    async requestActionTypes() {
        // activate loading on the parent component
        this.props.handleLoading(true);

        console.log("request");


        axios.post(apiUrl + 'actiontype', {
            threshold: parseInt(this.state.threshold),
            operator: this.state.operator
        })
            .then(res => {
                console.log("response: ", res);
                this.filterToShow(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }

    filterToShow(data) {
        let filteredSessions = [];
        data.map((item) => {
            if (item._fields[0] !== null) {
                item._fields[0].map((session) => {
                    filteredSessions.push(session);
                });
            }
        });
        // pass results to the parent component and stop loadind
        this.props.handleResult(filteredSessions);
        this.props.handleLoading(false);

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
                                value={this.state.operator}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value=">" control={<Radio/>} label="More than"/>
                                <FormControlLabel value="<" control={<Radio/>} label="Less than"/>
                                <FormControlLabel value="=" control={<Radio/>} label="Equal to"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>

                        <MuiThemeProvider theme={textFieldTheme}>
                            <TextField
                                id="standard-number"
                                label="Number of different action types"
                                onChange={this.handleInputChange}
                                className="input"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item xs={4}>
                        <MuiThemeProvider theme={buttonFindTheme}>
                            <Button variant="contained" color="primary" onClick={this.requestActionTypes}
                                    disabled={(this.state.threshold === '' || this.state.operator === '')}>
                                Find
                            </Button>
                        </MuiThemeProvider>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default ActionTypes;

