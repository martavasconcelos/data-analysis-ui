import React from 'react';
import axios from 'axios';

/* Material UI */
import Button from '@material-ui/core/Button';

import {apiUrl} from "../config";
import Messages from "../Messages";
import Grid from "@material-ui/core/Grid/Grid";
import FormControl from "@material-ui/core/FormControl/FormControl";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {buttonFindTheme, radioTheme} from "../Overrides/ButtonOverride";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/Radio/Radio";
import TextField from "@material-ui/core/TextField/TextField";

class Length extends React.Component {
    constructor(props) {

        super(props);

        this.requestSimilarity = this.requestSimilarity.bind(this);

        this.state = {
            algorithm: 'levenshtein',
            sessionsData: [],
            percentage: -1,
            result: [],
            loading: false,
        };
    }

    requestSimilarity() {
        this.props.handleLoading(true);

        axios.get(apiUrl + 'path')
            .then(res => {
                console.log("response from path id: ", res);
                this.getSimilarityMatrix(res.data.records);
            })
            .catch(error => {
                console.error('Error during request:', error);
            });
    }

    // to be implemented in case of having more algorithms
    handleChange = event => {
    };

    getSimilarityMatrix(sessionsData) {

        let mat = [];
        let similarityValues = [];
        let similaritySessions = [];
        let length = sessionsData.length;

        // increment first row
        let i;
        for (i = 0; i < length; i++) {
            mat[i] = [];
        }

        // increment each column in the first row
        let b;
        for (b = 0; b < length; b++) {
            mat[0][b] = [];
        }

        // get levenshtein distance for each pair of sessions
        for (let i = 0; i < length; i++) {
            for (let j = i; j < length; j++) {
                let distance;
                // no need to calculate distance between two equal sessions
                if (i === j) {
                    distance = 0;
                }
                else {
                    distance = this.getLevenshteinDistance(sessionsData[i]._fields[1], sessionsData[j]._fields[1]);
                }
                mat[i][j] = distance;
                mat[j][i] = distance;
            }
        }

        // sum levenshtein distance of each session to all sequences
        for (let i = 0; i < length; i++) {
            let value = 0;
            for (let j = 1; j < length; j++) {
                value += mat[i][j];
            }
            let x = {session: sessionsData[i]._fields[0], value: value / length}

            similarityValues.push(x);
        }
        // sort by the most common (lowest value) to the less common
        similarityValues.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

        similarityValues.forEach((sessionData) => {
                similaritySessions.push(sessionData.session)
            }
        );

        this.props.handleLoading(false);
        this.props.handleResult(similaritySessions, Messages.similarityFilter);
    }


    getLevenshteinDistance(a, b) {
        // Compute the edit distance between the two given strings
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        let matrix = [];

        // increment along the first column of each row
        let i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        let j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1)); // deletion
                }
            }
        }
        let biggerLength = (a.length > b.length ? a.length : b.length);
        return 1 - (matrix[b.length][a.length] / biggerLength);
    }

    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <Grid item xs={8}>
                        <FormControl component="fieldset">
                            <MuiThemeProvider theme={radioTheme}>
                                <RadioGroup
                                    aria-label="Compare"
                                    name="compare"
                                    value={this.state.algorithm}
                                    onChange={this.handleChange}
                                >
                                    <FormControlLabel className="extraPadding" value="levenshtein" control={<Radio/>} label="Levenshtein Algorithm"/>
                                </RadioGroup>
                            </MuiThemeProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <MuiThemeProvider theme={buttonFindTheme}>
                        <Button variant="contained" onClick={this.requestSimilarity}>
                            Order
                        </Button>
                        </MuiThemeProvider>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Length;

