import { createStitches } from '@stitches/react';

export const { styled, getCssText, createTheme, globalCss } = createStitches({
    media: {
        bp1: `(min-width:0px)`,
        bp2: `(min-width:321px)`,
        bp3: `(min-width:376px)`,
        bp4: `(min-width: 426px)`,
        bp5: `(min-width: 769px)`,
        bp6: `(min-width: 1025px)`,
    },
    theme: {
        colors: {
            text: '#626fe6',
            background: 'white',
        },
    },
});

// define the dark theme using the de-constructed function
export const darkTheme = createTheme({
    colors: {
        text: 'white',
        background: 'black',
    },
});
