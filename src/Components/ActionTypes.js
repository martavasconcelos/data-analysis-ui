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
import Tooltip from '@material-ui/core/Tooltip';

import {textFieldNumberTheme} from '../Overrides/TextFieldOverride';
import {buttonFindTheme, radioTheme} from '../Overrides/ButtonOverride';
import {apiUrl} from "../config";

class ActionTypes extends React.Component {
    constructor(props) {

        super(props);

        this.requestActionTypes = this.requestActionTypes.bind(this);
        this.filterToShow = this.filterToShow.bind(this);

        this.state = {
            operator: '',
            threshold: '',
            typeOfAction: ''
        };
    }

    handleTypeActionChange = event => {
        this.setState({typeOfAction: event.target.value});
    };

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


        axios.get(apiUrl + 'actiontype')
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
        let filter = `Action Types ${this.state.operator} ${this.state.threshold} `;
        if (this.state.operator === '>') {
            data.forEach((item) => {
                if (item._fields[1].low > this.state.threshold) {
                    filteredSessions.push(item._fields[0]);
                }
            });
        }
        else if (this.state.operator === '<') {
            data.forEach((item) => {
                if (item._fields[1].low < this.state.threshold) {
                    filteredSessions.push(item._fields[0]);
                }
            });
        }
        else if (this.state.operator === '=') {
            data.forEach((item) => {
                if (item._fields[1].low == this.state.threshold) {
                    filteredSessions.push(item._fields[0]);
                }
            });
        }
        else if (this.state.operator === 'contains') {
            this.setState({
                threshold: ''
            })
            data.forEach((item) => {
                item._fields[2].forEach((action) => {
                    switch (this.state.typeOfAction) {
                        case 'Click':
                            if (action === 'click') {
                                filteredSessions.push(item._fields[0]);
                            }
                            break;
                        case 'Double Click':
                            if (action === 'dblclick') {
                                filteredSessions.push(item._fields[0]);
                            }
                            break;
                        case 'Drag and Drop':
                            if (action === 'dragAndDrop') {
                                filteredSessions.push(item._fields[0]);
                            }
                            break;
                        case 'Input':
                            if (action === 'input') {
                                filteredSessions.push(item._fields[0]);
                            }
                            break;
                        default:
                            break;

                    }
                })
            });
            filter = `Action Types ${this.state.operator} ${this.state.typeOfAction} `;
        }

        // pass results to the parent component and stop loading
        this.props.handleResult(filteredSessions, filter);
        this.props.handleLoading(false);

    }

    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        <FormControl component="fieldset">
                            <MuiThemeProvider theme={radioTheme}>
                                <RadioGroup
                                    aria-label="Compare"
                                    name="compare"
                                    value={this.state.operator}
                                    onChange={this.handleChange}
                                >
                                    <FormControlLabel value=">" control={<Radio/>} label="More than"/>
                                    <FormControlLabel value="<" control={<Radio/>} label="Less than"/>
                                    <FormControlLabel value="=" control={<Radio/>} label="Equal to"/>
                                    <FormControlLabel value="contains" control={<Radio/>} label="Contains"/>
                                </RadioGroup>
                            </MuiThemeProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.operator === 'contains' ?
                            <MuiThemeProvider theme={radioTheme}>
                                <RadioGroup
                                    aria-label="typeOfAction"
                                    name="typeOfAction"
                                    value={this.state.typeOfAction}
                                    onChange={this.handleTypeActionChange}
                                >
                                    <FormControlLabel value="Click" control={<Radio/>} label="Click"/>
                                    <FormControlLabel value="Double Click" control={<Radio/>} label="Double Click"/>
                                    <FormControlLabel value="Drag and Drop" control={<Radio/>} label="Drag and Drop"/>
                                    <FormControlLabel value="Input" control={<Radio/>} label="Input"/>
                                </RadioGroup>
                            </MuiThemeProvider>
                            :

                            <MuiThemeProvider theme={textFieldNumberTheme}>
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
                                    inputProps={{ min: "0", step: "1" }}
                                />
                            </MuiThemeProvider>
                        }
                    </Grid>
                    <Grid item xs={4}>
                        <MuiThemeProvider theme={buttonFindTheme}>
                            <Button variant="contained" onClick={this.requestActionTypes}
                                    disabled={(this.state.operator === '')}>
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

