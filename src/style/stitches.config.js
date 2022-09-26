import { createStitches } from '@stitches/react';

export const { styled, getCssText, createTheme, globalCss } = createStitches({
    media: {
        bp1: `(min-width:0px)`,
        bp2: `(min-width:320px)`,
        bp3: `(min-width:375px)`,
        bp4: `(min-width: 425px)`,
        bp5: `(min-width: 768px)`,
        bp6: `(min-width: 1024px)`,
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
