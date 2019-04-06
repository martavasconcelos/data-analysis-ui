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
        this.filterByThreshold = this.filterByThreshold.bind(this);

        this.state = {
            compare: '',
            sessionsData: [],
            threshold: '',
            result: [],
        };
    }

    handleChange = event => {
        this.setState({compare: event.target.value});
    };

    handleInputChange = event => {
        this.setState({threshold: event.target.value});
        this.filterByThreshold();
    };


    async requestActionTypes() {
        /*
                axios.get('http://localhost:3000/session')
                    .then(res => {
                        console.log("response: ", res.data.records);
                        res.data.records.map((session) => {
                            console.log("response: ", session);
                            axios.post('http://localhost:3000/actiontype', {session: session._fields[0]})
                                .then(res => {
                                    console.log("response type: ", res.data.records);
                                    sessions.push(session._fields);
                                })
                        })
                    })
                    .then(() => {
                            console.log("sessions lo", sessions.length);

                            this.setState({sessionsData: sessions});
                            this.filterByThreshold(sessions);
                        }
                    )
                    */


        axios.post('http://localhost:3000/actiontype', {sessions: ["f830df62-f8fc-e544-83fe-1c87c1fd82a5", "139ac765-0032-27ff-6d2e-0fce4163d254"]})
            .then(res => {
                console.log("response: ", res);
                this.setState({sessionsData: res.data.sessions});
                this.filterByThreshold();
            })

        //todo catch error
    }

    filterByThreshold() {
        let filteredSessions = [];
        this.state.sessionsData.map((session) => {
            if(this.state.compare === "equal") {
                if (session.actionTypes == this.state.threshold) {
                    filteredSessions.push(session.session);
                }
            }
            if(this.state.compare === "more") {
                if (session.actionTypes > this.state.threshold) {
                    filteredSessions.push(session.session);
                }
            }
            if(this.state.compare === "less") {
                if (session.actionTypes < this.state.threshold) {
                    filteredSessions.push(session.session);
                }
            }
        });
        this.setState({result: filteredSessions});
    }

    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <div>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Gender"
                                name="gender1"
                                value={this.state.compare}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="more" control={<Radio/>} label="More than"/>
                                <FormControlLabel value="less" control={<Radio/>} label="Less than"/>
                                <FormControlLabel value="equal" control={<Radio/>} label="Equal to"/>
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
                        <Button variant="contained" color="primary" onClick={this.requestActionTypes} disabled={(this.state.threshold === '' || this.state.compare === '')}>
                            Find
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <ResultsPanel result={this.state.result}/>
                </Grid>
            </Grid>


        );
    }
}

export default ActionTypes;

