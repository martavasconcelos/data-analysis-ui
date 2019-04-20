import React from 'react';

/* Material UI */
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid/Grid";
import Divider from '@material-ui/core/Divider';

/* Components */
import ActionTypes from "../Components/ActionTypes";
import Length from "../Components/Length";
import Similarity from "../Components/Similarity"
import Element from "../Components/Element";
import ResultsPanel from "../Components/ResultsPanel";
import Messages from "../Messages";

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            loading: false,
            results: [],
            lastStep: '',
            filterMessage: ''
        };

        this.getStepContent = this.getStepContent.bind(this);
    }

    getSteps() {
        return ['Action Types', 'Element', 'Most common', 'Length'];
    }

    getStepContent(step) {
        switch (step) {
            case 0:
                return <ActionTypes handleLoading={this.handleLoading} handleResult={this.handleResult}/>
            case 1:
                return <Element handleLoading={this.handleLoading} handleResult={this.handleResult}/>;
            case 2:
                return <Similarity handleLoading={this.handleLoading} handleResult={this.handleResult}/>;
            case 3:
                return <Length handleLoading={this.handleLoading} handleResult={this.handleResult}/>;
            default:
                return <div><p>"Ups, an error has occurred!"</p></div>
        }
    }

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleResult = (resultsData, filter) => {
        this.handleReset();
        let filterMessage = this.state.filterMessage.concat(" " + filter);

        this.setState({
            results: resultsData,
            filterMessage
        });

    };

    combineResults = (resultsToCompare) => {
        console.log("combine", resultsToCompare);
        let similarityResults = [];
        let resultsToCombine = [];
        let sortedResults = [];
        let filterMessage = '| ';
        resultsToCompare.forEach((resultToCompare) => {
            filterMessage = filterMessage.concat(resultToCompare.filter).concat(' |');
            if (resultToCompare.filter.trim() === Messages.similarityFilter.trim()) {
                similarityResults = resultToCompare.result;
            }
            else {
                resultsToCombine.push(resultToCompare.result)
            }
        });

        let combinedResults = resultsToCombine.shift().filter(function (v) {
            return resultsToCombine.every(function (a) {
                return a.indexOf(v) !== -1;
            });
        });

        if (similarityResults.length > 0) {
            similarityResults.forEach((similarityResult) => {
                combinedResults.forEach((combinedResult) => {
                    if (combinedResult == similarityResult) {
                        sortedResults.push(similarityResult);
                    }
                })
            });
            combinedResults = sortedResults;
        }
        console.log("sortedResults", combinedResults);
        this.setState({
            results: combinedResults,
            filterMessage
        });
    };

    handleReset = () => {
        this.setState({
            results: [],
            filterMessage: ''
        });
    };

    handleLoading = (loading) => {
        this.setState({
            loading,
        });
    };


    render() {
        const steps = this.getSteps();
        const {activeStep} = this.state;
        return (
            <Grid container spacing={0}>
                <h2 className="appTitle roboto"> Web Analytics </h2>
                <h4 className="appSubTitle roboto"> Data Analysis</h4>
                <p className='appIntroText roboto'> Data retrieved by Web Analytics script was saved in a Neo4J
                    database,
                    saving all user interactions according to each user section. The follow four steps allow to filter
                    the sequences' data saved on Neo4J Database to be filtered by different characteristics: action
                    types,
                    element present, order by the most common or filter by the sequences length. The application's
                    purpose
                    is to download a Json File with the information of the sequences that match the tester criteria,
                    in order to build test cases from it. </p>
                <Divider variant="middle" className="divider"/>

                <Grid item xs={6}>
                    <div className="AnalysisTabsStyles">
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <Typography>{this.getStepContent(index)}</Typography>
                                        <div>
                                            <div className="nexStepButtons">
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={this.handleBack}
                                                >
                                                    Back
                                                </Button>
                                                {activeStep !== steps.length - 1 &&

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleNext}
                                                >
                                                    Next
                                                </Button>
                                                }
                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <ResultsPanel loading={this.state.loading}
                                  result={this.state.results}
                                  handleReset={this.handleReset}
                                  filterMessage={this.state.filterMessage}
                                  combineResults={this.combineResults}/>
                </Grid>
            </Grid>
        );
    }
}

export default Dashboard;