import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setItemObj, setIsAreaClickDown } from '../../store/reducer/trigger.reducer';
import { lecture } from '../../util/lecture';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import _ from 'lodash';
const Layout = styled.div`
    .lectureItem {
        cursor: pointer;
        width: 85%;
        height: 100%;
        position: absolute;
        top: 0px;
        background: #ec7063;
        color: white;
        border-radius: 5px;
        padding-top: 4px;
    }
`;
function MatchingItem({ idx }) {
    const dispatch = useDispatch();
    const { matchingItemData, matchingItemGroupData } = useSelector(state => state.schedule);
    const { itemObj } = useSelector(state => state.trigger);
    const itemLectureName = lecture.getLectureNameByIdx(matchingItemData, idx);
    const handleClick = () => {
        dispatch(
            setItemObj({
                idx: idx,
                type: 'matching',
                lectureId: lecture.getLectureId(matchingItemData, idx),
                time: lecture.getLectureRunningTime(matchingItemGroupData, idx),
                isShow: itemObj.isShow ? false : true,
            }),
        );
    };
    const handleDragStart = () => {
        dispatch(setIsAreaClickDown(false));
        dispatch(
            setItemObj({
                idx: idx,
                type: 'matching',
                lectureId: lecture.getLectureId(matchingItemData, idx),
                time: lecture.getLectureRunningTime(matchingItemGroupData, idx),
            }),
        );
    };

    return (
        <Layout>
            <div
                className={`lectureItem`}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={table.removeOver}
                onClick={handleClick}
                style={{
                    zIndex: 2,
                    height: `${matchingItemGroupData.reduce((result, y) => {
                        idx == y.startIdx && result.push((y.endTimeIdx + 1 - y.startTimeIdx) * 20 + 'px');
                        return result;
                    }, [])}`,
                }}
            >
                <div style={{ padding: '5px' }}>
                    {itemLectureName}
                    <br />
                    {matchingItemGroupData.map(y => {
                        return idx == y.startIdx && `${schedule.getTime(y.startTimeIdx)}~${schedule.getTime(y.endTimeIdx + 1)} `;
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default React.memo(MatchingItem);
