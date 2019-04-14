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


class AnalysisTabs extends React.Component {
    constructor(props) {
        super(props);
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
        console.log("result!", resultsData);
        if (this.state.results.length === 0) {
            this.setState({
                results: resultsData,
            });
        }
        else {
            console.log("combine!");
            this.combineResults(resultsData, common);
        }
    };

    combineResults(newResults, common) {
        let resultsToShow = [];
        //sort ->common
        if (common) {
            /*    console.log("combine common");
                this.state.results.forEach((result) => {
                    let index = newResults.findIndex(result);
                    console.log("session: ", result, "index: ", index);
                    resultsToShow.push({session: result, index});
                });
                console.log("results to show: ", resultsToShow);
                resultsToShow.sort((a, b) => parseFloat(a.index) - parseFloat(b.index));
                console.log("results to show sorted: ", resultsToShow);*/


            newResults.forEach((newResult) => {
                this.state.results.forEach((result) => {
                    if (newResult == result) {
                        console.log("pushed!");
                        resultsToShow.push(newResult);
                    }
                })
            });
        }
        else {

            this.state.results.forEach((result) => {
                newResults.forEach((newResult => {
                    if (newResult == result) {
                        console.log("pushed!");
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
        console.log("laoding!");
        this.setState({
            loading,
        });
    };


    render() {
        const steps = this.getSteps();
        const {activeStep} = this.state;
        return (
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <div className="AnalysisTabsStyles">
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <Typography>{this.getStepContent(index)}</Typography>
                                        <div>
                                            <div>
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={this.handleBack}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleNext}
                                                >
                                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
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

export default AnalysisTabs;