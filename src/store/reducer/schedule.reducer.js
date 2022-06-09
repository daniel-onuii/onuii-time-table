import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    timeListData: [],
    areaData: null,
    fixedItemData: null,
    fixedItemGroupData: [],
    matchingItemData: null,
    matchingItemGroupData: [],
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
        setFixedItemGroupData(state, action) {
            state.fixedItemGroupData = action.payload;
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
export const { initData, setAreaData, setFixedItemData, setFixedItemGroupData, setTimeListData, setMatchingItemData, setMatchingItemGroupData } =
    actions;
export default reducer;
