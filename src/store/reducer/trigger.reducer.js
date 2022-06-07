import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaObj: {},
    itemObj: {},
    areaGrabbedObj: [],
    areaMatchingObj: [],
    isAreaAppend: false,
    isAreaClickDown: false,
    areaActiveType: null,
    message: '',
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
        setAreaMatchingObj(state, action) {
            state.areaMatchingObj = action.payload;
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
        setMessage(state, action) {
            state.message = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const { setAreaObj, setItemObj, setAreaGrabbedObj, setAreaMatchingObj, setIsAreaAppend, setIsAreaClickDown, setAreaActiveType, setMessage } =
    actions;
export default reducer;
