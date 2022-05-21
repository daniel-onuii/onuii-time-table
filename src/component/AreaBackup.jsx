import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAreaGrabbedObj, setAreaObj, setIsAreaAppend, setIsAreaClickDown, setItemObj } from '../store/reducer/trigger.reducer';
import { setAreaData, setItemData, setItemGroupData } from '../store/reducer/schedule.reducer';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import _ from 'lodash';
function Area({ idx, itemData, areaObj, itemObj, areaGrabbedObj }) {
    // function Area({ idx }) {
    const dispatch = useDispatch();
    // const { areaData, itemData } = useSelector(state => state.schedule);
    // const { areaObj, itemObj, areaGrabbedObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);
    const areaData = useSelector(state => state.schedule.areaData);
    const isAreaClickDown = useSelector(state => state.trigger.isAreaClickDown);
    const isAreaAppend = useSelector(state => state.trigger.isAreaAppend);
    const areaActiveType = useSelector(state => state.trigger.areaActiveType);
    const handleAreaDown = () => {
        dispatch(setIsAreaAppend(table.isFillArea(areaData, idx)));
        dispatch(
            setAreaObj({
                idx: idx,
                startOverIdx: schedule.getTimeIdx(idx),
                endOverIdx: schedule.getTimeIdx(idx + 1),
                startOverDayIdx: schedule.getWeekIdx(idx),
                endOverDayIdx: schedule.getWeekIdx(idx),
            }),
        );

        dispatch(setIsAreaClickDown(true));
        table.isFillArea(areaData, idx)
            ? dispatch(setAreaData(_.reject(areaData, { block_group_No: idx })))
            : dispatch(setAreaData([...areaData, { block_group_No: idx, areaActiveType: areaActiveType }]));
    };

    const handleAreaOver = () => {
        if (isAreaClickDown) {
            const startOverIdx = areaObj.idx;
            const endOverIdx = idx;
            const startOverDayIdx = schedule.getWeekIdx(startOverIdx);
            const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
            const startRange = schedule.getTimeIdx(startOverIdx);
            const endRange = schedule.getTimeIdx(endOverIdx);
            const intervalDay = _.range(startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx, startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1);
            const selectedInfo = intervalDay.reduce((result, e) => {
                result.push(
                    _.range(e * 96 + 36 + startRange, e * 96 + 36 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                        return { block_group_No: ee, areaActiveType: areaActiveType };
                    }),
                );
                return result;
            }, []);
            dispatch(setAreaGrabbedObj(_.flattenDeep(selectedInfo)));
            dispatch(
                setAreaObj({
                    ...areaObj,
                    startOverIdx: startRange < endRange ? startRange : endRange,
                    endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
                    startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                    endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                }),
            );
        }
    };
    const handleAreaUp = () => {
        dispatch(setIsAreaClickDown(false));
        const removeResult = _.reject(areaData, o => {
            return areaGrabbedObj.some(item => item.block_group_No === o.block_group_No);
        });
        isAreaAppend ? dispatch(setAreaData(removeResult)) : dispatch(setAreaData([...areaData, ...areaGrabbedObj]));
        dispatch(setAreaGrabbedObj([]));
        dispatch(setItemObj({}));
    };
    const handleItemDrop = e => {
        dispatch(setItemObj({}));
        const itemIdx = itemObj.idx;
        const itemLectureId = itemObj.lectureId;
        const time = itemObj.time;
        const endTime = idx + time - 1;
        if (!schedule.checkValidSchedule(endTime, idx, itemData, itemLectureId)) {
            return false;
        }
        if (idx != 0) {
            const removedLecture = _.reject([...itemData], function (o) {
                //이전 과목 시간은 삭제
                return (o.block_group_No >= itemIdx && o.block_group_No < itemIdx + time) || (o.block_group_No >= idx && o.block_group_No < idx + time);
            });
            const addLecture = _.range(idx, idx + time).reduce((result, e) => {
                //드롭된 위치에 새롭게 생성
                result.push({ block_group_No: e, lecture_subject_Id: itemLectureId });
                return result;
            }, []);
            dispatch(setItemData([...removedLecture, ...addLecture]));
        }
    };

    const handleAreaEnter = () => {
        dispatch(setItemObj({ ...itemObj, target: idx }));
    };
    return (
        <div
            onMouseDown={handleAreaDown}
            onMouseOver={handleAreaOver}
            onMouseUp={handleAreaUp}
            onDrop={handleItemDrop}
            onDragOver={e => e.preventDefault()}
            onDragEnter={handleAreaEnter}
            className={`item 
            ${areaData.some(item => item.block_group_No === idx) ? 'active' : ''}
            ${itemObj.target <= idx && itemObj.target + itemObj?.time > idx ? 'over' : ''}
            ${areaGrabbedObj.some(item => item.block_group_No === idx) ? 'dragging' : ''}
            lecture_${_.find(areaData, o => o.block_group_No === idx)?.areaActiveType}`}
        >
            {idx}
        </div>
    );
}

export default React.memo(Area);
