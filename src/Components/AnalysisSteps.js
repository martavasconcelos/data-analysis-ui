import React from 'react';

/* Material UI */
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ActionTypes from "./ActionTypes";
import Length from "./Length";
import Similarity from "./Similarity"
import Element from "./Element";
import Grid from "@material-ui/core/Grid/Grid";
import ResultsPanel from "./ResultsPanel";
import Divider from '@material-ui/core/Divider';


class AnalysisSteps extends React.Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            loading: false,
            results: []
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

    handleResult = (resultsData, common = false) => {
        // if there is no results yet, set the results as the ones received
        if (this.state.results.length === 0) {
            this.setState({
                results: resultsData,
            });
        }
        // if there is already previous results, it is needed to combine them to have a proper response
        else {
            this.combineResults(resultsData, common);
        }
    };

    /* in order to not change how the results are sorted,
     if the new results are coming from similarity, the way to combine them has to be different
     since the results to show need to be in new results' order. */
    combineResults(newResults, common) {
        let resultsToShow = [];

        if (common) {
            newResults.forEach((newResult) => {
                this.state.results.forEach((result) => {
                    if (newResult == result) {
                        resultsToShow.push(newResult);
                    }
                })
            });
        }
        else {
            this.state.results.forEach((result) => {
                newResults.forEach((newResult => {
                    if (newResult == result) {
                        resultsToShow.push(newResult);
                    }
                }))
            });
        }
        this.setState({
            results: resultsToShow,
        });
    }

    handleReset = () => {
        this.setState({
            results: [],
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
                    <ResultsPanel loading={this.state.loading} result={this.state.results}
                                  handleReset={this.handleReset}/>
                </Grid>
            </Grid>
        );
    }
}

export default AnalysisSteps;