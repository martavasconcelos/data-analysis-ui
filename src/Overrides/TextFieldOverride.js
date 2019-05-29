import { createMuiTheme } from '@material-ui/core/styles';

export const textFieldNumberTheme = createMuiTheme({
    overrides: {
        MuiInputBase: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                width: '10%',
                marginLeft: 20,

            },
        },

        MuiFormControl: {
            marginNormal: {
                marginTop: 40,
            }
        },

        MuiFormLabel: {
            root: {
                marginLeft: 20,
                '&$focused': {
                    color: '#265c8a',
                },
            }
        }
    },
});

export const textFieldTextTheme = createMuiTheme({
    overrides: {
        MuiInputBase: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                width: '60%',
                marginLeft: 20,

            },
        },

        MuiFormControl: {
            marginNormal: {
                marginTop: 40,
            }
        },

        MuiFormLabel: {
            root: {
                marginLeft: 20,
            }
        }
    },
});