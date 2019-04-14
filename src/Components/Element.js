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

class Element extends React.Component {
    constructor(props) {

        super(props);

        this.requestElement = this.requestElement.bind(this);
        this.filterByCompareAction = this.filterByCompareAction.bind(this);

        this.state = {
            path: '',
            compare: '',
            sessionsData: [],
            result: [],
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

        axios.post('http://localhost:3000/element', {path: this.state.path})
            .then(res => {
                console.log("response: ", res);
                this.setState({sessionsData: res.data.records});
                this.filterByCompareAction();
            })
        //todo catch error
    }

    filterByCompareAction() {
        if (this.state.sessionsData.length > 0) {
            let filteredSessions = [];

            if (this.state.compare === "contain") {
                this.state.sessionsData.map((session) => {
                    filteredSessions.push(session._fields[0]);

                });
            }

            if (this.state.compare === "begin") {
                this.state.sessionsData.map((session) => {
                    if (session._fields[2] == 1.0) {
                        filteredSessions.push(session._fields[0]);
                    }
                });
            }
            if (this.state.compare === "end") {
                this.state.sessionsData.map((session) => {
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

                <TextField
                    id="standard-dense"
                    label="Element's XPath"
                    onChange={this.handleInputChange}
                    className="input"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="dense"
                />
                <Button variant="contained" color="primary" onClick={this.requestElement}
                        disabled={(this.state.path === '' || this.state.compare === '')}>
                    Find
                </Button>
            </div>
        );
    }
}

export default Element;

