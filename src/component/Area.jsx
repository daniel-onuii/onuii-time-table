import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAreaClickDown, setStartGrabIdx } from '../store/reducer/trigger.reducer';
import { setTableData } from '../store/reducer/schedule.reducer';
import { schedule } from '../util/schedule';
import _ from 'lodash';
function Area({ tableData, idx, isActiveArea, isGrabbed, areaType }) {
    const dispatch = useDispatch();
    const isAreaClickDown = useSelector(state => state.trigger.isAreaClickDown);
    const areaActiveType = useSelector(state => state.trigger.areaActiveType);
    const startGrabIdx = useSelector(state => state.trigger.startGrabIdx);

    const handleAreaDown = () => {
        dispatch(setStartGrabIdx(idx));
        dispatch(setIsAreaClickDown(true));
        const off = e => {
            return { ...e, isActiveArea: false, areaType: null };
        };
        const on = e => {
            return { ...e, isActiveArea: true, areaType: areaActiveType };
        };
        const updateTableData = _(tableData)
            .flatten()
            .map(e => {
                return e.block_group_No == idx ? (isActiveArea ? off(e) : on(e)) : e;
            })
            .groupBy(e => e.rowNum)
            .value();
        dispatch(setTableData(_.values(updateTableData)));
    };

    const handleAreaOver = () => {
        if (isAreaClickDown) {
            const startWeekIdx = schedule.getWeekIdx(startGrabIdx);
            const endWeekIdx = schedule.getWeekIdx(idx);
            const startRange = schedule.getTimeIdx(startGrabIdx);
            const endRange = schedule.getTimeIdx(idx);
            const intervalDay = _.range(
                startWeekIdx < endWeekIdx ? startWeekIdx : endWeekIdx,
                startWeekIdx > endWeekIdx ? startWeekIdx + 1 : endWeekIdx + 1,
            );
            const currentGrabbedData = intervalDay.reduce((result, e) => {
                result.push(
                    _.range(e * 96 + 36 + startRange, e * 96 + 36 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                        return { block_group_No: ee, areaActiveType: areaActiveType };
                    }),
                );
                return result;
            }, []);

            const updateTableData = _(tableData)
                .flatten()
                .map(e => {
                    return _.find(_.flatten(currentGrabbedData), { block_group_No: e.block_group_No })
                        ? { ...e, isGrabbed: true }
                        : { ...e, isGrabbed: false };
                })
                .groupBy(e => e.rowNum)
                .value();
            dispatch(setTableData(_.values(updateTableData)));
        }
    };
    const handleAreaUp = () => {
        dispatch(setIsAreaClickDown(false));

        const isAppend = _(tableData).flatten().find({ block_group_No: startGrabIdx }).isActiveArea; //첫 블럭의 상태값으로 on/off여부 체크

        const updateTableData = _(tableData)
            .flatten()
            .map(e => {
                return e.isGrabbed
                    ? { ...e, isGrabbed: false, isActiveArea: isAppend, areaType: isAppend ? areaActiveType : null }
                    : { ...e, isGrabbed: false };
            })
            .groupBy(e => e.rowNum)
            .value();
        dispatch(setTableData(_.values(updateTableData)));
        //     dispatch(setItemObj({}));
    };
    // const handleItemDrop = e => {
    //     dispatch(setItemObj({}));
    //     const itemIdx = itemObj.idx;
    //     const itemLectureId = itemObj.lectureId;
    //     const time = itemObj.time;
    //     const endTime = idx + time - 1;
    //     if (!schedule.checkValidSchedule(endTime, idx, itemData, itemLectureId)) {
    //         return false;
    //     }
    //     if (idx != 0) {
    //         const removedLecture = _.reject([...itemData], function (o) {
    //             //이전 과목 시간은 삭제
    //             return (o.block_group_No >= itemIdx && o.block_group_No < itemIdx + time) || (o.block_group_No >= idx && o.block_group_No < idx + time);
    //         });
    //         const addLecture = _.range(idx, idx + time).reduce((result, e) => {
    //             //드롭된 위치에 새롭게 생성
    //             result.push({ block_group_No: e, lecture_subject_Id: itemLectureId });
    //             return result;
    //         }, []);
    //         dispatch(setItemData([...removedLecture, ...addLecture]));
    //     }
    // };

    // const handleAreaEnter = () => {
    //     dispatch(setItemObj({ ...itemObj, target: idx }));
    // };
    return (
        <div
            onMouseDown={handleAreaDown}
            onMouseOver={handleAreaOver}
            onMouseUp={handleAreaUp}
            // onDrop={handleItemDrop}
            // onDragOver={e => e.preventDefault()}
            // onDragEnter={handleAreaEnter}
            className={`item
                ${isActiveArea ? 'active' : ''}
                ${isGrabbed ? 'dragging' : ''}
                lecture_${areaType}
            `}
            // className={`item
            // ${areaData.some(item => item.block_group_No === idx) ? 'active' : ''}
            // ${itemObj.target <= idx && itemObj.target + itemObj?.time > idx ? 'over' : ''}
            // ${areaGrabbedObj.some(item => item.block_group_No === idx) ? 'dragging' : ''}
            // lecture_${_.find(areaData, o => o.block_group_No === idx)?.areaActiveType}
            // `}
        >
            {isGrabbed}
            {idx}
        </div>
    );
}

export default React.memo(Area);
