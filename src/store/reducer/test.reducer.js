import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isSendCode: false,
};
const slice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        codeSend(state, action) {
            state.isSendCode = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { codeSend } = actions;
export default reducer;
