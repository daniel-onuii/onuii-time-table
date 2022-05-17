import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaObj: {},
    itemObj: {},
    areaGrabbedObj: [],
    isAreaAppend: false,
    isAreaClickDown: false,
    areaActiveType: null,
};
const slice = createSlice({
    name: 'trigger',
    initialState,
    reducers: {
        setAreaObj(state, action) {
            state.areaObj = action.payload;
        },
        setItemObj(state, action) {
            state.itemObj = action.payload;
        },
        setAreaGrabbedObj(state, action) {
            state.areaGrabbedObj = action.payload;
        },
        setIsAreaAppend(state, action) {
            state.isAreaAppend = action.payload;
        },
        setIsAreaClickDown(state, action) {
            state.isAreaClickDown = action.payload;
        },
        setAreaActiveType(state, action) {
            state.areaActiveType = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { setAreaObj, setItemObj, setAreaGrabbedObj, setIsAreaAppend, setIsAreaClickDown, setAreaActiveType } = actions;
export default reducer;
