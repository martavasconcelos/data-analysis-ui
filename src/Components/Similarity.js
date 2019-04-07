import React from 'react';
import axios from 'axios';
import Table from './Table';

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

        this.requestSimilarity = this.requestSimilarity.bind(this);

        this.state = {
            algorithm: '',
            sessionsData: [],
            percentage: -1,
            result: [],
        };
    }

    handleChange = event => {
        this.setState({algorithm: event.target.value});
    };

    handleInputChange = event => {
        this.setState({percentage: parseInt(event.target.value)});
    };


    async requestSimilarity() {
        axios.get('http://localhost:3000/pathid')
            .then(res => {
                console.log("response from path id: ", res);
                this.setState({sessionsData: res.data.records});
                this.getSimilarity();
            })
        //todo catch error
    }

    getSimilarity() {
        //fazer os pares
        for (let i = 0; i < this.state.sessionsData.length; i++) {

            let trSession1 = document.getElementById(this.state.sessionsData[i]._fields[0]);
            console.log("tr: ", trSession1);
            let thSimilaritySession1 = document.createElement("th");
            thSimilaritySession1.appendChild(document.createTextNode("----"));
            trSession1.appendChild(thSimilaritySession1);

            for (var j = i + 1; j < this.state.sessionsData.length; j++) {

                let session1 = this.state.sessionsData[i]._fields[0];
                let seq1 = this.state.sessionsData[i]._fields[1];
                let session2 = this.state.sessionsData[j]._fields[0];
                let seq2 = this.state.sessionsData[j]._fields[1];

                let similarity;
                if (session1 !== session2) {
                    console.log("seq: ", seq1);
                    console.log("seq: ", seq2);
                    similarity = this.getLevenshteinDistance(seq1, seq2);
                }
                else {
                    similarity = null;

                }
                let trSession2 = document.getElementById(session2);

                let thSimilaritySession2 = document.createElement("th");
                thSimilaritySession2.appendChild(document.createTextNode(similarity));
                trSession2.appendChild(thSimilaritySession2);

                let trSession1 = document.getElementById(session1);

                let thSimilaritySession1 = document.createElement("th");
                thSimilaritySession1.appendChild(document.createTextNode(similarity));
                trSession1.appendChild(thSimilaritySession1);
            }
        }
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

        return matrix[b.length][a.length];
    }

    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <div>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Algorithm"
                                name="algorithm"
                                value={this.state.algorithm}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="levenshtein" control={<Radio/>} label="Levenshtein"/>
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            id="standard-number"
                            label="Similarity %"
                            onChange={this.handleInputChange}
                            className="input"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={this.requestSimilarity}
                                disabled={!(this.state.percentage >= 0)}>
                            Find
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Table sessions={this.state.sessionsData}/>

                </Grid>
            </Grid>

        );
    }
}

export default Length;

