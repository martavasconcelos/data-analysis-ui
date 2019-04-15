import { createMuiTheme } from '@material-ui/core/styles';

export const textFieldTheme = createMuiTheme({
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
            }
        }
    },
});