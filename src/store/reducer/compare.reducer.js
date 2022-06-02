import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaData: {},
};
const slice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        setAreaData(state, action) {
            state.areaData = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { setAreaData } = actions;
export default reducer;
