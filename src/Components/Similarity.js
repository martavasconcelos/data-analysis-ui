import React from 'react';
import axios from 'axios';

/* Material UI */
import Button from '@material-ui/core/Button';

import {apiUrl} from "../config";

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

    async requestSimilarity() {
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
        //todo mudar para nao calcular 2x distance
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                let distance = this.getLevenshteinDistance(sessionsData[i]._fields[1], sessionsData[j]._fields[1]);
                mat[i][j] = distance;
            }
        }

        // sum levenshtein distance of each session to all sequences
        for (let i = 0; i < length; i++) {
            let value = 0;
            for (let j = 1; j < length; j++) {
                value += mat[i][j];
            }
            let x = {session: sessionsData[i]._fields[0], value: value}

            similarityValues.push(x);
        }
        // sort by the most common (lowest value) to the less common
        similarityValues.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

        similarityValues.map((sessionData) => {
                similaritySessions.push(sessionData.session)
            }
        );

        this.props.handleLoading(false);
        this.props.handleResult(similaritySessions, true);
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
            <div>
                <p className='introText'> Levenshtein algorithm calculates the minimum number of actions
                    (insert, delete, substitution) that required to transform one sequence into another.
                    Accepting that the most common sequence is the one with the lowest sum of the levenshtein distance
                    to all
                    sequences, the sequences can be order by the most common to the less common
                    based on that value. </p>
                <Button variant="contained" color="primary" onClick={this.requestSimilarity}>
                    Order
                </Button>
            </div>
        );
    }
}

export default Length;

