import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaData: null,
    fixedItemData: null,
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
            state.fixedItemData = action.payload.fixedItemData;
            state.matchingItemData = action.payload.matchingItemData;
        },
        setAreaData(state, action) {
            state.areaData = action.payload;
        },
        setFixedItemData(state, action) {
            state.fixedItemData = action.payload;
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
export const { initData, setAreaData, setFixedItemData, setItemGroupData, setTimeListData, setMatchingItemData, setMatchingItemGroupData } = actions;
export default reducer;
