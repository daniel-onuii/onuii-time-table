import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaData: null,
    itemData: null,
    itemGroupData: [],
    timeListData: [],
};
const slice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setAreaData(state, action) {
            state.areaData = action.payload;
        },
        setItemData(state, action) {
            state.itemData = action.payload;
        },
        setItemGroupData(state, action) {
            state.itemGroupData = action.payload;
        },
        setTimeListData(state, action) {
            state.timeListData = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { setAreaData, setItemData, setItemGroupData, setTimeListData } = actions;
export default reducer;
