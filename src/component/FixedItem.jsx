import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import FixedItemDetail from './FixedItemDetail';
import { setItemObj, setIsAreaClickDown } from '../store/reducer/trigger.reducer';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';
import _ from 'lodash';
const Layout = styled.div`
    .lectureItem {
        cursor: pointer;
        width: 85%;
        height: 100%;
        position: absolute;
        top: 0px;
        background: #feb74e;
        color: white;
        border-radius: 5px;
        padding-top: 4px;
    }
`;
function FixedItem({ idx }) {
    const dispatch = useDispatch();
    const { itemData, itemGroupData, timeListData } = useSelector(state => state.schedule);
    const { itemObj } = useSelector(state => state.trigger);
    const itemLectureName = lecture.getLectureNameByIdx(itemData, idx);
    const handleClick = () => {
        dispatch(
            setItemObj({
                idx: idx,
                lectureId: lecture.getLectureId(itemData, idx),
                time: lecture.getLectureRunningTime(itemGroupData, idx),
                isShow: itemObj.isShow ? false : true,
            }),
        );
    };
    const handleDragStart = () => {
        dispatch(setIsAreaClickDown(false));
        dispatch(
            setItemObj({
                idx: idx,
                lectureId: lecture.getLectureId(itemData, idx),
                time: lecture.getLectureRunningTime(itemGroupData, idx),
            }),
        );
    };

    const handleDragEnter = () => {
        dispatch(setItemObj({ ...itemObj, target: null }));
    };
    return (
        <Layout>
            <div
                className={`lectureItem`}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onClick={handleClick}
                style={{
                    zIndex: 2,
                    height: `${itemGroupData.reduce((result, y) => {
                        idx == y.startIdx && result.push((y.endTimeIdx + 1 - y.startTimeIdx) * 20 + 'px');
                        return result;
                    }, [])}`,
                }}
            >
                {itemLectureName}
                <br />
                {itemGroupData.map(y => {
                    return idx == y.startIdx && `${schedule.getTime(y.startTimeIdx)}~${schedule.getTime(y.endTimeIdx + 1)} `;
                })}
            </div>
            {itemObj.isShow && itemObj.idx === idx && <FixedItemDetail idx={idx} />}
        </Layout>
    );
}

export default React.memo(FixedItem);
