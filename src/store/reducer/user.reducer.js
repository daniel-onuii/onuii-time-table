import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    auth: '',
    selectMode: {},
};
const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setInitAuth(state, action) {
            state.auth = action.payload.auth;
            state.selectMode = action.payload.selectMode;
        },
        setAuth(state, action) {
            state.auth = action.payload;
        },
        setSelectMode(state, action) {
            state.selectMode = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { setInitAuth, setAuth, setSelectMode } = actions;
export default reducer;
