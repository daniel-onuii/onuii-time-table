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
        initData(state, action) {
            state.areaData = action.payload.areaData;
            state.itemData = action.payload.itemData;
            state.timeListData = action.payload.timeListData;
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
    },
});

const { actions, reducer } = slice;
export const { initData, setAreaData, setItemData, setItemGroupData } = actions;
export default reducer;
