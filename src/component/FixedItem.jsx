import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import FixedItemDetail from './FixedItemDetail';
import { setItemObj, setIsAreaClickDown } from '../store/reducer/trigger.reducer';
import { getLectureName } from './Timetableutil';
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
const getLectureId = (data, idx) => {
    ///이러한 함수들이 계속 사용될 가능성이 있으므로 캡슐화
    return _.find(data, { block_group_No: idx })?.lecture_subject_Id;
};
const getLectureNameByIdx = (data, idx) => {
    return getLectureName(getLectureId(data, idx));
};
const getLectureRunningTime = (data, idx) => {
    const obj = _.find(data, { startIdx: idx });
    return obj.endTimeIdx - obj.startTimeIdx + 1;
};

function FixedItem({ idx, timeList }) {
    const dispatch = useDispatch();
    const { areaData, itemData, itemGroupData } = useSelector(state => state.schedule);
    const { areaObj, itemObj, areaGrabbedObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);
    const itemLectureName = getLectureNameByIdx(itemData, idx);
    const handleClick = () => {
        dispatch(
            setItemObj({
                idx: idx,
                lectureId: getLectureId(itemData, idx),
                time: getLectureRunningTime(itemGroupData, idx),
                isShow: itemObj.isShow ? false : true,
            }),
        );
    };

    const handleDragStart = () => {
        dispatch(setIsAreaClickDown(false));
        dispatch(
            setItemObj({
                idx: idx,
                lectureId: getLectureId(itemData, idx),
                time: getLectureRunningTime(itemGroupData, idx),
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
                    return idx == y.startIdx && `${timeList[y.startTimeIdx]}~${timeList[y.endTimeIdx + 1]} ${y.endTimeIdx}`;
                })}
            </div>
            {itemObj.isShow && itemObj.idx === idx && <FixedItemDetail idx={idx} itemLectureName={itemLectureName} itemGroupData={itemGroupData} timeList={timeList} />}
        </Layout>
    );
}

export default React.memo(FixedItem);
