import {createMuiTheme} from '@material-ui/core/styles';

export const buttonTheme = createMuiTheme({
    overrides: {
        MuiButtonBase: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                margin: 14,
                width: '6vw',

            },
        },
    },
});


export const buttonFindTheme = createMuiTheme({
    overrides: {
        MuiButtonBase: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                marginTop: '18%',
                width: '6vw',
            },
        },
    },
});