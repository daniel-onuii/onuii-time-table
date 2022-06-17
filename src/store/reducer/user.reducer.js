import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    auth: '',
    lvt: null,
    lessonOption: null,
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
        setLVT(state, action) {
            state.lvt = action.payload;
        },
        setLessonOption(state, action) {
            state.lessonOption = action.payload;
        },
        setSelectMode(state, action) {
            state.selectMode = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { setInitAuth, setAuth, setLVT, setLessonOption, setSelectMode } = actions;
export default reducer;
