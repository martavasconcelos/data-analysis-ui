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
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

/* Styles */
import {buttonTheme, buttonNoMarginTheme} from '../Overrides/ButtonOverride';
import {stepperTheme} from '../Overrides/StepperOverride';

/* Components */
import ActionTypes from "../Components/ActionTypes";
import Length from "../Components/Length";
import Similarity from "../Components/Similarity"
import Element from "../Components/Element";
import ResultsPanel from "../Components/ResultsPanel";
import Messages from "../Messages";
import Url from "../Components/Url";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

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
        return [
            {label: 'Action Types', info: "User interactions are saved as one of four types: click, input, drag and drop or double click. Sequences can be filtered by the number of different action types they have or if they contain a chosen type of action."},
            {label: 'Element', info: "Sequences can be filtered by the ones which contain a provided XPath."},
            {label: 'Most common', info: "Levenshtein algorithm calculates the minimum number of actions" +
                    "(insert, delete, substitution) that required to transform one sequence into another. " +
                    "Accepting that the most common sequence is the one with the lowest sum of the levenshtein distance to all" +
                    "sequences, the sequences can be order by the most common to the less common based on that value. "},
            {label: 'Length', info: "Sequences can be filtered by the sequences length, as well as finding the biggest and the shortest sequence on data."},
            {label: 'Url', info: "The URL where the interaction is made by the user is also saved. Sequences can be filtered by a specific URL. "}];
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
            showCombineOptions: false,
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
                <img className='logo' src={require('../logo.png')}/>
                <h2 className="appTitle roboto"> MARTT - Mining Automated Regression Testing Tool </h2>
                <p className='appIntroText roboto'> The following five steps allow to filtering
                    sequences data, previously saved on a Neo4J Database, by different characteristics: action
                    types, elements, length, url or order by the most common sequence to the less.
                    Start for selecting each filter you want. If you wanna combine filters,
                    select the filter and combine them using the right menu. After that, you can download a JSON file
                    for each chosen session to use it to build automated test cases. </p>
                <Divider variant="middle" className="divider"/>

                <Grid item xs={6}>
                    <div>
                        <MuiThemeProvider theme={stepperTheme}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((item, index) => (
                                <Step key={item.label}>
                                    <StepLabel>{item.label}
                                    <MuiThemeProvider theme={buttonNoMarginTheme}>
                                        <Tooltip title={
                                            <h2 className='introText'>{item.info}</h2>}>
                                            <Button> <img className='info' src={require('../info.png')}/> </Button>
                                        </Tooltip>
                                    </MuiThemeProvider>
                                    </StepLabel>
                                    <StepContent>
                                        <Typography>{this.getStepContent(index)}</Typography>
                                        <div>
                                            <div className="nexStepButtons">
                                                <MuiThemeProvider theme={buttonTheme}>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={this.handleBack}
                                                    >
                                                        Back
                                                    </Button>
                                                    {activeStep !== steps.length - 1 &&

                                                    <Button
                                                        variant="contained"
                                                        onClick={this.handleNext}
                                                    >
                                                        Next
                                                    </Button>
                                                    }
                                                </MuiThemeProvider>
                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                        </MuiThemeProvider>
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