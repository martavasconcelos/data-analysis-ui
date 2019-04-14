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
import AnalysisTabs from "./AnalysisTabs";
import ResultsPanel from "./ResultsPanel";

class ActionTypes extends React.Component {
    constructor(props) {

        super(props);

        this.requestActionTypes = this.requestActionTypes.bind(this);
        this.filterToShow = this.filterToShow.bind(this);

        this.state = {
            operator: '',
            sessionsData: [],
            threshold: '',
            result: [],
            loading: false
        };
    }

    handleChange = event => {
        this.setState({operator: event.target.value});
    };

    handleInputChange = event => {
        this.setState({threshold: event.target.value});
    };


    async requestActionTypes() {

        this.props.handleLoading(true);

        console.log("request");


        axios.post('http://localhost:3000/actiontype', {
            threshold: parseInt(this.state.threshold),
            operator: this.state.operator })
            .then(res => {
                console.log("response: ", res);
              //  this.setState({sessionsData: res.data.records});
                this.filterToShow(res.data.records);
            })
        //todo catch error

    }

    filterToShow(data) {
        console.log("filtered:", data)
        let filteredSessions = [];
        data.map((item) => {
            console.log("item: ", item);
            if(item._fields[0] !== null){
                item._fields[0].map((session) => {
                    filteredSessions.push(session);
                });
            }
        });

        this.props.handleResult(filteredSessions);
        this.props.handleLoading(false);

    }

    render() {
        return (
                    <div>
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

                        <TextField
                            id="standard-number"
                            label="Number of different types"
                            onChange={this.handleInputChange}
                            className="input"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={this.requestActionTypes}
                                disabled={(this.state.threshold === '' || this.state.operator === '')}>
                            Find
                        </Button>
                    </div>

        );
    }
}

export default ActionTypes;

