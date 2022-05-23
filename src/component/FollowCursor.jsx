import React from 'react';
import Cursor from 'react-cursor-follow';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setAreaActiveType } from '../store/reducer/trigger.reducer';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';
const Layout = styled.div`
    #cursor {
        z-index: 9999;
    }
    button {
        color: white;
        border: 0px;
        padding: 5px;
        border-radius: 3px;
        margin: 6px 3px;
        width: 60px;
    }
`;
const Tooltip = styled.div`
    position: absolute;
    width: 150px;
    top: -70px;
    color: white;
    font-size: 15px;
    padding: 7px;
    border-radius: 4px;
    border: 2px solid #cdcdcd;
`;
function FollowCursor() {
    const dispatch = useDispatch();
    const { areaObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);

    const handleClickActiveAreaType = e => {
        return () => {
            dispatch(setAreaActiveType(e));
        };
    };

    return (
        <Layout>
            {isAreaClickDown && (
                <Cursor duration={0} size={0}>
                    {isAreaAppend ? (
                        <Tooltip style={{ background: 'red', width: '50px', textAlign: 'center' }}>삭제</Tooltip>
                    ) : (
                        <Tooltip className={`lecture_${areaActiveType ? `${areaActiveType}` : 'all'}`}>
                            <span>{areaActiveType == null ? '상관없음' : lecture.getLectureName(areaActiveType)}</span>
                            <br />
                            <span>{`${schedule.getWeekText(areaObj.startOverDayIdx)} ${schedule.getTime(areaObj.startOverIdx)}`}</span> {` ~ `}
                            <span>{`${schedule.getWeekText(areaObj.endOverDayIdx)} ${schedule.getTime(areaObj.endOverIdx)}`}</span>
                        </Tooltip>
                    )}
                </Cursor>
            )}

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
        </Layout>
    );
}

export default FollowCursor;
