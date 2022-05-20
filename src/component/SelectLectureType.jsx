import React from 'react';
import { useDispatch } from 'react-redux';
import { setAreaActiveType } from '../store/reducer/trigger.reducer';

function SelectLectureType() {
    const dispatch = useDispatch();
    const handleClickActiveAreaType = e => {
        return () => {
            dispatch(setAreaActiveType(e));
        };
    };

    return (
        <React.Fragment>
            <button style={{ background: '#4eb6ac' }} onClick={handleClickActiveAreaType(null)}>
                상관없음
            </button>
            <button style={{ background: 'cornflowerblue' }} onClick={handleClickActiveAreaType(9168)}>
                국어
            </button>
            <button style={{ background: 'yellowgreen' }} onClick={handleClickActiveAreaType(9169)}>
                영어
            </button>
            <button style={{ background: 'coral' }} onClick={handleClickActiveAreaType(8906)}>
                수학
            </button>
            <button style={{ background: 'plum' }} onClick={handleClickActiveAreaType(9812)}>
                중학과학
            </button>
        </React.Fragment>
    );
}

export default SelectLectureType;
