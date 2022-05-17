import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    test: 'lll',
};
const slice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setTest(state, action) {
            state.test = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { codeSend } = actions;
export default reducer;
