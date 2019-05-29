import {createMuiTheme} from '@material-ui/core/styles';

export const stepperTheme = createMuiTheme({
    overrides: {
        MuiStepIcon: {
            root: {
                color: '#265c8a',
                '&$completed': {
                    color: '#265c8a',
                },
                '&$active': {
                    color: '#265c8a',
                },
            },
            active: {},
            completed: {},
        },
        MuiStepper: {
            root: {
                backgroundColor: '#f6faff',
            },
        },
    }
});
