import React from 'react';
import Cursor from 'react-cursor-follow';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { schedule } from '../util/schedule';
import { lecture } from '../util/lecture';
const Layout = styled.div`
    #cursor {
        z-index: 9999;
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
    const { areaObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);
    return (
        <React.Fragment>
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
            </Layout>
        </React.Fragment>
    );
}

export default FollowCursor;
