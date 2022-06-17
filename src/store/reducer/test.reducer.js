import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isSendCode: false,
    test: null,
};
const slice = createSlice({
    name: 'test1',
    initialState,
    reducers: {
        codeSend(state, action) {
            state.isSendCode = action.payload;
        },
        setTest(state, action) {
            state.test = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { codeSend, setTest } = actions;
export default reducer;
