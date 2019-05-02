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
import Url from "../Components/Url";

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            loading: false,
            results: [],
            lastStep: '',
            filterMessage: '',
            showCombineOptions: true
        };

        this.getStepContent = this.getStepContent.bind(this);
    }

    getSteps() {
        return ['Action Types', 'Element', 'Most common', 'Length', 'Url'];
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
            case 4:
                return <Url handleLoading={this.handleLoading} handleResult={this.handleResult}/>;
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
            filterMessage,
            showCombineOptions:false,
        });
    };

    handleReset = () => {
        this.setState({
            results: [],
            filterMessage: '',
            showCombineOptions: true,
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
                <p className='appIntroText roboto'> The following five steps allow to filtering
                    sequences' data, previously saved on a Neo4J Database, by different characteristics: action
                    types, elements, filter by the sequences length, url or order by the most common.
                    Start for selecting each filter you want. If you wanna combine filters,
                    select the filter and combine them all. After that, you can download a JSON file to use it to build automated test cases. </p>
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
                                  combineResults={this.combineResults}
                                  showCombineOptions={this.state.showCombineOptions}/>
                </Grid>
            </Grid>
        );
    }
}

export default Dashboard;