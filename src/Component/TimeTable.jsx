import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Cursor from 'react-cursor-follow';
import FixedItem from './FixedItem';
import { schedule, Table } from './Timetableutil';
import { ToastOption } from './ToastOption';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setAreaData, setItemData, setItemGroupData } from '../store/reducer/schedule.reducer';
import { setAreaObj, setItemObj, setAreaGrabbedObj, setIsAreaClickDown, setIsAreaAppend, setAreaActiveType } from '../store/reducer/trigger.reducer';

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
const Layout = styled.div`
    body::-webkit-scrollbar {
        display: none;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #cdcdcd;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    th,
    td {
        border-left: 1px solid #cdcdcd;
        text-align: center;
        height: 21px;
        vertical-align: middle;
        width: 10%;
        position: relative;
        padding: 0;
        border-spacing: 0;
        font-size: 12px;
    }
    td:hover {
        background: #cfcfcf;
        cursor: cell;
    }
    th:first-child {
        width: 12%;
    }
    .head {
        overflow-y: scroll;
    }
    .head th {
        height: 30px;
        font-size: 15px;
        color: #757575;
    }
    .contents {
        height: 504px;
        overflow-y: scroll;
    }
    .tr_parent {
        border-top: 1px solid #cdcdcd;
    }
    .tr_parent th {
        font-size: 15px;
        color: #757575;
    }
    .item {
        height: 100%;
        color: #b3b3b3;
    }
    .active {
        cursor: cell;
        width: 100%;
        height: 100%;
        background: #4eb6ac;
        color: white;
    }
    .weekend {
        background: #fef0f7;
    }
    .droptarget {
        float: left;
        width: 100px;
        height: 35px;
        margin: 15px;
        padding: 10px;
        border: 1px solid #aaaaaa;
    }
    .over {
        background: red !important;
        opacity: 0.5;
        position: absolute;
        width: 100%;
        top: 0;
    }
    input {
        width: 64px !important;
        margin: 0px !important;
        height: 16px !important;
        padding: 5px !important;
        font-size: 12px !important;
    }
    .dragging {
        background: #01a8fe !important;
        color: white;
    }
    .lecture_all {
        background: #4eb6ac;
    }
    .lecture_8906 {
        background: coral;
    }
    .lecture_9168 {
        background: cornflowerblue;
    }
    .lecture_9169 {
        background: yellowgreen;
    }
    .lecture_9812 {
        background: plum;
    }
    button {
        color: white;
        border: 0px;
        padding: 5px;
        border-radius: 3px;
        margin: 6px 3px;
        width: 60px;
    }
    #cursor {
        z-index: 9999;
    }
`;
function checkValidSchedule(endTime, startTime, itemRowData, itemLectureId) {
    if (
        (endTime > 101 && endTime < 132) ||
        (endTime > 197 && endTime < 228) ||
        (endTime > 293 && endTime < 324) ||
        (endTime > 389 && endTime < 420) ||
        (endTime > 485 && endTime < 516) ||
        (endTime > 581 && endTime < 612) ||
        endTime > 677
    ) {
        toast.error('유효하지않은 범위입니다.', ToastOption);
        return false;
    } else {
        const isInvalidEndtime = itemRowData.some(item => item.lecture_subject_Id !== itemLectureId && (item.block_group_No === endTime || item.block_group_No === endTime + 2));
        const isInvalidStart = itemRowData.some(item => item.lecture_subject_Id !== itemLectureId && item.block_group_No === startTime - 2);
        if (isInvalidEndtime || isInvalidStart) {
            toast.error('강의 사이에 최소 30분의 시간이 필요합니다.', ToastOption);
            return false;
        } else {
            return true;
        }
    }
}

function timeCalc(data) {
    let seq = 0;
    const rowData = _.sortBy(data, 'block_group_No').reduce((result, e) => {
        const isCheckSeq = result.slice(-1)[0]?.block_group_No === e.block_group_No - 1; //연속성 체크
        result.push({ week: schedule.getWeekIdx(e.block_group_No), block_group_No: e.block_group_No, lecture_subject_Id: e.lecture_subject_Id, seq: isCheckSeq ? seq : (seq += 1) });
        return result;
    }, []);
    const possibleObj = _(rowData)
        .groupBy(x => x.seq)
        .map((value, key) => ({
            seq: key,
            week: value[0]?.week,
            lecture_subject_Id: value[0]?.lecture_subject_Id,
            startIdx: value.slice(0, 1)[0]?.block_group_No,
            endIdx: value.slice(-1)[0]?.block_group_No,
            startTimeIdx: schedule.getTimeIdx(value.slice(0, 1)[0]?.block_group_No),
            endTimeIdx: schedule.getTimeIdx(value.slice(-1)[0]?.block_group_No),
        }))
        .value();
    return possibleObj;
}
const timeList = schedule.getTimeList();
const master = new Table();
function TimeTable() {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const { areaData, itemData, itemGroupData } = useSelector(state => state.schedule);
    const { areaObj, itemObj, areaGrabbedObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);

    useEffect(() => {
        master.setInitScroll(tableRef, 681);
        master.init({ area: areaData.concat(itemData), item: itemData });
    }, []);

    useEffect(() => {
        master.update({ area: areaData, item: itemData });
    }, [itemData, areaData]);

    useEffect(() => {
        dispatch(setItemGroupData(timeCalc(itemData)));
    }, [itemData]);

    const handleAreaDown = e => {
        const idx = Number(e.target.getAttribute('idx'));
        dispatch(setIsAreaAppend(master.isFillArea(idx)));
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
        master.isFillArea(idx) ? dispatch(setAreaData(_.reject(areaData, { block_group_No: idx }))) : dispatch(setAreaData([...areaData, { block_group_No: idx, areaActiveType: areaActiveType }]));
    };
    const handleAreaOver = e => {
        if (isAreaClickDown) {
            const idx = Number(e.target.getAttribute('idx'));
            const startOverIdx = areaObj.idx; //start target
            const endOverIdx = idx; //end target
            const startOverDayIdx = schedule.getWeekIdx(startOverIdx); //[0,1,2...]월,화,수...
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
            // setGrabbedAreaData(_.flattenDeep(selectedInfo));
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

    const handleAreaUp = e => {
        dispatch(setIsAreaClickDown(false));
        const removeResult = _.reject(areaData, o => {
            return areaGrabbedObj.some(item => item.block_group_No === o.block_group_No);
        });
        isAreaAppend ? dispatch(setAreaData(removeResult)) : dispatch(setAreaData([...areaData, ...areaGrabbedObj]));

        // setGrabbedAreaData([]);

        dispatch(setAreaGrabbedObj([]));
        dispatch(setItemObj({}));
    };

    const handleAreaEnter = e => {
        const targetItemIdx = Number(e.target.getAttribute('idx'));
        dispatch(setItemObj({ ...itemObj, target: targetItemIdx }));
    };

    const handleItemDrop = e => {
        e.preventDefault();
        dispatch(setItemObj({}));
        const itemIdx = itemObj.idx;
        const itemLectureId = itemObj.lectureId;
        const time = itemObj.time;
        const targetItemIdx = Number(e.target.getAttribute('idx'));
        const endTime = targetItemIdx + time - 1;
        if (!checkValidSchedule(endTime, targetItemIdx, itemData, itemLectureId)) {
            return false;
        }
        if (targetItemIdx != 0) {
            const removedLecture = _.reject([...itemData], function (o) {
                //이전 과목 시간은 삭제
                return (o.block_group_No >= itemIdx && o.block_group_No < itemIdx + time) || (o.block_group_No >= targetItemIdx && o.block_group_No < targetItemIdx + time);
            });
            const addLecture = _.range(targetItemIdx, targetItemIdx + time).reduce((result, e) => {
                //드롭된 위치에 새롭게 생성
                result.push({ block_group_No: e, lecture_subject_Id: itemLectureId });
                return result;
            }, []);
            dispatch(setItemData([...removedLecture, ...addLecture]));
        }
    };

    function handleItemDragOver(e) {
        e.preventDefault();
    }

    const handleClickActiveAreaType = e => {
        return () => {
            // setActiveAreaType(e);
            dispatch(setAreaActiveType(e));
        };
    };
    return (
        <React.Fragment>
            <Layout>
                {isAreaClickDown && (
                    <Cursor duration={0} size={0} style={{ border: '1px solid red' }}>
                        {isAreaAppend ? (
                            <Tooltip style={{ background: 'red', width: '50px', textAlign: 'center' }}>삭제</Tooltip>
                        ) : (
                            <Tooltip className={`lecture_${areaActiveType ? `${areaActiveType}` : 'all'}`}>
                                <span>{areaActiveType == null ? '상관없음' : master.getLectureName(areaActiveType)}</span>
                                <br />
                                <span>{`${schedule.getWeekText(areaObj.startOverDayIdx)} ${schedule.getTime(areaObj.startOverIdx)}`}</span> {` ~ `}
                                <span>{`${schedule.getWeekText(areaObj.endOverDayIdx)} ${schedule.getTime(areaObj.endOverIdx)}`}</span>
                            </Tooltip>
                        )}
                    </Cursor>
                )}
                <div className="head">
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
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>월</th>
                                <th>화</th>
                                <th>수</th>
                                <th>목</th>
                                <th>금</th>
                                <th>토</th>
                                <th style={{ color: 'red' }}>일</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="contents" ref={tableRef}>
                    <table>
                        <tbody>
                            {timeList.map((e, i) => {
                                const isOntime = i % 4 === 0; //정시조건
                                const getIdBlock = (rowIdx, i) => rowIdx * 96 + 36 + i; //스케줄 db값
                                return (
                                    <React.Fragment key={i}>
                                        <tr className={isOntime ? 'tr_parent' : ''}>
                                            {isOntime ? <th rowSpan="4">{e}</th> : null}
                                            {_.range(0, 7).map((e, ii) => {
                                                const idx = getIdBlock(e, i);
                                                return (
                                                    <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                        <div //과외 가능 시간 데이터 ./.... Area 관련 컴퍼넌트 개발 핸들러 리팩토링
                                                            idx={idx}
                                                            onMouseOver={handleAreaOver}
                                                            onMouseUp={handleAreaUp}
                                                            onMouseDown={handleAreaDown}
                                                            onDrop={handleItemDrop}
                                                            onDragOver={handleItemDragOver}
                                                            onDragEnter={handleAreaEnter}
                                                            className={`item ${areaData.some(item => item.block_group_No === idx) ? 'active' : ''} 
                                                            ${itemObj.target <= idx && itemObj.target + itemObj?.time > idx ? 'over' : ''} 
                                                            ${areaGrabbedObj.some(item => item.block_group_No === idx) ? 'dragging' : ''}
                                                            lecture_${_.find(areaData, o => o.block_group_No === idx)?.areaActiveType}`}
                                                        >
                                                            {idx}
                                                        </div>
                                                        {/* <Area /> */}
                                                        {itemGroupData.some(y => y.startIdx === idx) && (
                                                            <React.Fragment>
                                                                <FixedItem idx={idx} timeList={timeList} />
                                                            </React.Fragment>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </React.Fragment>
    );
}

export default React.memo(TimeTable);
