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
            loading: false,
        };
    }

    handleChange = event => {
        this.setState({algorithm: event.target.value});
    };

    handleInputChange = event => {
        this.setState({percentage: parseInt(event.target.value)});
    };


    async requestSimilarity() {
        this.setState({
            loading: true,
        });
        axios.get('http://localhost:3000/path')
            .then(res => {
                console.log("response from path id: ", res);
                this.setState({sessionsData: res.data.records});
                this.getSimilarityMatrixTest();
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
        if (this.state.sessionsData !== []) {
            this.setState({
                loading: false,
            })
        }
    }


    getSimilarityMatrixTest() {
        let mat = [];
        let similarityValues = []
        let similaritySessions = []
        let length = 10;

        console.table("matrix init: ", mat);

        let i;
        for (i = 0; i < length; i++) {
            mat[i] = [];
        }

        // increment each column in the first row
        let b;
        for (b = 0; b < length; b++) {
            mat[0][b] = [];
        }

        console.table("matrix foo: ", mat);

        //mudar para nao calcular 2x distance
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                console.log("sim between: ", this.state.sessionsData[i]._fields[0], "and ", this.state.sessionsData[j]._fields[0])
                console.log("sim between: ", this.state.sessionsData[i]._fields[1], "and ", this.state.sessionsData[j]._fields[1])
                let distance = this.getLevenshteinDistance(this.state.sessionsData[i + 10]._fields[1], this.state.sessionsData[j + 10]._fields[1]);
                mat[i][j] = distance;
            }
        }

        console.table("matrix sim: ", mat);


        for (let i = 0; i < length; i++) {
            let value = 0;
            for (let j = 1; j < length; j++) {
                console.log("value: ", mat[i][j]);
                value += mat[i][j];
            }
            let x = {session: this.state.sessionsData[i]._fields[0], value: value}

            similarityValues.push(x);
        }
        similarityValues.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

        similarityValues.map((sessionData)=>{
            similaritySessions.push(sessionData.session)
            }
        );

        console.table("matrix final: ", similarityValues);

        this.setState({result: similaritySessions});

        if (this.state.sessionsData !== []) {
            this.setState({
                loading: false,
            })
        }
    }


    getSimilarityMatrix() {
        let matrix = [];

        let i;
        for (i = 0; i < this.state.sessionsData.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        let b;
        for (b = 0; b < this.state.sessionsData.length; b++) {
            matrix[0][b] = b;
        }

        for (let i = 1; i < this.state.sessionsData.length; i++) {
            for (let j = 1; j < this.state.sessionsData.length; j++) {
                let distance = this.getLevenshteinDistance(this.state.sessionsData[i]._fields[1], this.state.sessionsData[j]._fields[1]);
                matrix[i][j] = 0;
                matrix[i][j - 1] = distance;
                matrix[i - 1][j] = distance;
            }
        }

        console.log("matrix 1: ", matrix[0][1]);
        console.log("matrix 2: ", matrix[1][0]);
        console.log("matrix 3: ", matrix[10][10]);
        console.log("matrix 4: ", matrix[10][9]);
        console.log("matrix 5: ", matrix[9][10]);
        console.log("matrix 6: ", matrix);

        if (this.state.sessionsData !== []) {
            this.setState({
                loading: false,
            })
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
                    <ResultsPanel loading={this.state.loading} result={this.state.result}/>
                </Grid>
            </Grid>

        );
    }
}

export default Length;

