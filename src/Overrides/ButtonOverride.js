import {createMuiTheme} from '@material-ui/core/styles';

export const buttonTheme = createMuiTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                margin: 14,
                width: '5vw',
            },
        },
        MuiButton: {
            contained: {
                backgroundColor: '#265c8a',
                color: '#ffffff',
            },
        },
    },
});
export const largerButtonTheme = createMuiTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                margin: 14,
                width: '8vw',
            },
        },
        MuiButton: {
            contained: {
                backgroundColor: '#265c8a',
                color: '#ffffff',
            },
        },
    },
});

export const buttonNoMarginTheme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                padding: 0,
                width: '2%',
            },
        },
    },
});


export const buttonFindTheme = createMuiTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                marginTop: '18%',
                width: '6vw',
            },
        },
        MuiButton: {
            contained: {
                backgroundColor: '#265c8a',
                color: '#ffffff',
            },
        },
    },
});

export const buttonOrderTheme = createMuiTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                marginTop: '10%',
                marginLeft: '25%',
                width: '20vw',
            },
        },
        MuiButton: {
            contained: {
                backgroundColor: '#265c8a',
                color: '#ffffff',
            },
        },
    },
});

export const deleteButtonTheme = createMuiTheme({
    overrides: {
        MuiButton: {
            contained: {
                backgroundColor: 'transparent',
                color: '#b92a09',
                boxShadow: 'none',
            },
            label: {
                fontSize: '20px',
                fontWeight: 800,
            }
        },
    },
});
export const radioTheme = createMuiTheme({
    overrides: {
        MuiRadio: {
            colorSecondary: {
                color: '#265c8a',
                '&$checked': {
                    color: '#265c8a',
                },
            },
        },
    }
});

export const checkBoxTheme = createMuiTheme({
    overrides: {
        MuiCheckbox: {
            colorSecondary: {
                color: '#265c8a',
                '&$checked': {
                    color: '#265c8a',
                },
            },
        },
    }
});