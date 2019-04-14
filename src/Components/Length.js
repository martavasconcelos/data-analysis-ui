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

class Length extends React.Component {
    constructor(props) {

        super(props);

        this.requestLength = this.requestLength.bind(this);
        this.filterByLength = this.filterByLength.bind(this);

        this.state = {
            compare: '',
            sessionsData: [],
            length: '',
            result: [],
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

        axios.get('http://localhost:3000/allsessions')
            .then(res => {
                console.log("response: ", res);
                this.setState({sessionsData: res.data.records});
                this.filterByLength();
            })
        //todo catch error
    }

    filterByLength() {
        if (this.state.sessionsData.length > 0) {
            console.log("filter: ", this.state.sessionsData[0]._fields[0]);

            let filteredSessions = [];

            if (this.state.compare === "biggest") {
                filteredSessions.push(this.state.sessionsData[0]._fields[0]);


            }
            if (this.state.compare === "shortest") {
                filteredSessions.push(this.state.sessionsData[this.state.sessionsData.length - 1]._fields[0]);

            }
            if (this.state.compare === "biggerThan") {
                this.state.sessionsData.map((session) => {
                    console.log("limit: ", this.state.length);
                    console.log("length: ", session._fields[1].low);
                    if (session._fields[1].low > this.state.length) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }
            if (this.state.compare === "shorterThan") {
                this.state.sessionsData.map((session) => {
                    if (session._fields[1].low < this.state.length) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }

            this.props.handleLoading(false);
            this.props.handleResult(filteredSessions);        }

    }

    render() {
        return (
                    <div>
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
                        {(this.state.compare === "biggerThan" || this.state.compare === 'shorterThan') &&
                        <TextField
                            id="standard-number"
                            label="Number of interactions"
                            onChange={this.handleInputChange}
                            className="input"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        }
                        <Button variant="contained" color="primary" onClick={this.requestLength}
                                disabled={this.state.compare === ''}>
                            Find
                        </Button>
                    </div>


        );
    }
}

export default Length;

