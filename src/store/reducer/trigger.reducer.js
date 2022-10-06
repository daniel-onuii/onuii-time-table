import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    areaObj: {},
    itemObj: {},
    areaGrabbedObj: [],
    areaMatchingObj: [], //후보선생님 필터링을 위한 범위
    isAreaAppend: false,
    isAreaClickDown: false,
    lectureSubjectId: null,
    message: '',
    matchingGrabbedObj: [], //가매칭으로 추가 될 범위(60,90분)
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
            state.lectureSubjectId = action.payload;
        },
        setMessage(state, action) {
            state.message = action.payload;
        },
        setMatchingGrabbedObj(state, action) {
            state.matchingGrabbedObj = action.payload;
        },
    },
});

const { actions, reducer } = slice;
export const {
    setAreaObj,
    setItemObj,
    setAreaGrabbedObj,
    setAreaMatchingObj,
    setIsAreaAppend,
    setIsAreaClickDown,
    setAreaActiveType,
    setMessage,
    setMatchingGrabbedObj,
} = actions;
export default reducer;
