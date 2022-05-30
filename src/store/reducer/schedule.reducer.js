import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaData: null,
    itemData: null,
    itemGroupData: [],
    matchingItemData: null,
    matchingItemGroupData: [],
    timeListData: [],
};
const slice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        initData(state, action) {
            state.areaData = action.payload.areaData;
            state.itemData = action.payload.itemData;
            state.matchingItemData = action.payload.matchingItemData;
        },
        setAreaData(state, action) {
            state.areaData = action.payload;
        },
        setItemData(state, action) {
            state.itemData = action.payload;
        },
        setItemGroupData(state, action) {
            state.itemGroupData = action.payload;
        },
        setMatchingItemData(state, action) {
            state.matchingItemData = action.payload;
        },
        setMatchingItemGroupData(state, action) {
            state.matchingItemGroupData = action.payload;
        },
        setTimeListData(state, action) {
            state.timeListData = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { initData, setAreaData, setItemData, setItemGroupData, setTimeListData, setMatchingItemData, setMatchingItemGroupData } = actions;
export default reducer;
