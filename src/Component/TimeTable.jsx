import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Cursor from 'react-cursor-follow';
import FollowCursor from './FollowCursor';
import FixedItem from './FixedItem';
import { schedule, Table } from './Timetableutil';
import { ToastOption } from './ToastOption';
import { toast } from 'react-toastify';

// import React, { useEffect, useRef, useState } from 'react';
// import styled from 'styled-components';
// import _ from 'lodash';
// import { getLectureName } from 'src/util/lib';
// import { toast } from 'react-toastify';
// import FollowCursor from '../cursor/FollowCursor';
// import ToastOption from 'src/components/common/toastOption';
// import FixedItem from './FixedItem';
// import Area from './Area';
// import { schedule, Table } from './timetableutil';

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
function TimeTable({ mode, areaData, itemData }) {
    const [isAreaClickDown, setIsAreaClickDown] = useState(false); //영역 클릭 상태
    const [isAreaAppend, setIsAreaAppend] = useState(false); //영역 추가, 삭제 여부

    const [areaRowData, setAreaRowData] = useState([]); //영역 데이터
    const [itemRowData, setItemRowData] = useState([]); //아이템 데이터
    const [itemGroupData, setItemGroupData] = useState([]); //아이템 그룹 데이터

    const [objArea, setObjArea] = useState({}); //영역 핸들링 데이터
    const [objItem, setObjItem] = useState({}); //아이템 핸들링 데이터
    const [grabbedAreaData, setGrabbedAreaData] = useState([]); //드래그중인 영역 데이터

    const [activeAreaType, setActiveAreaType] = useState(); //선택된 과목값
    const tableRef = useRef();

    const InitScroll = () => {
        tableRef.current.scrollTo(0, 673);
    };

    useEffect(() => {
        InitScroll();
        master.init({ mode: mode, area: areaData.concat(itemData), item: itemData });
        setItemRowData(itemData);
        setAreaRowData(areaData.concat(itemData));
    }, []);

    useEffect(() => {
        master.update({ area: areaRowData, item: itemRowData });
    }, [itemRowData, areaRowData]);

    useEffect(() => {
        //아이템 변경시 그룹 업데이트
        setItemGroupData(timeCalc(itemRowData));
    }, [itemRowData]);

    const handleAreaDown = e => {
        const idx = Number(e.target.getAttribute('idx'));
        setIsAreaAppend(master.isFillArea(idx));

        setObjArea({
            idx: idx,
            startOverIdx: schedule.getTimeIdx(idx),
            endOverIdx: schedule.getTimeIdx(idx + 1),
            startOverDayIdx: schedule.getWeekIdx(idx),
            endOverDayIdx: schedule.getWeekIdx(idx),
        });

        setIsAreaClickDown(true);
        master.isFillArea(idx) ? setAreaRowData(_.reject(areaRowData, { block_group_No: idx })) : setAreaRowData([...areaRowData, { block_group_No: idx, activeAreaType: activeAreaType }]);
    };
    const handleAreaOver = e => {
        if (isAreaClickDown) {
            const idx = Number(e.target.getAttribute('idx'));
            const startOverIdx = objArea.idx; //start target
            const endOverIdx = idx; //end target
            const startOverDayIdx = schedule.getWeekIdx(startOverIdx); //[0,1,2...]월,화,수...
            const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
            const startRange = schedule.getTimeIdx(startOverIdx);
            const endRange = schedule.getTimeIdx(endOverIdx);
            const intervalDay = _.range(startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx, startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1);
            const selectedInfo = intervalDay.reduce((result, e) => {
                result.push(
                    _.range(e * 96 + 36 + startRange, e * 96 + 36 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                        return { block_group_No: ee, activeAreaType: activeAreaType };
                    }),
                );
                return result;
            }, []);
            setGrabbedAreaData(_.flattenDeep(selectedInfo));

            setObjArea({
                ...objArea,
                startOverIdx: startRange < endRange ? startRange : endRange,
                endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
                startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
            });
        }
    };

    const handleAreaUp = e => {
        setIsAreaClickDown(false);
        const removeResult = _.reject(areaRowData, o => {
            return grabbedAreaData.some(item => item.block_group_No === o.block_group_No);
        });
        isAreaAppend ? setAreaRowData(removeResult) : setAreaRowData([...areaRowData, ...grabbedAreaData]);
        setGrabbedAreaData([]);
        setObjItem({});
    };

    const handleAreaEnter = e => {
        const targetItemIdx = Number(e.target.getAttribute('idx'));
        setObjItem({ ...objItem, target: targetItemIdx });
    };

    const handleItemClick = e => {
        setObjItem({
            idx: Number(e.target.getAttribute('itemidx')),
            lectureId: Number(e.target.getAttribute('itemlectureid')),
            time: Number(e.target.getAttribute('time')),
            isShow: objItem.isShow ? false : true,
        });
    };

    function handleItemDrag(e) {
        setIsAreaClickDown(false);
        setObjItem({
            idx: Number(e.target.getAttribute('itemidx')),
            lectureId: Number(e.target.getAttribute('itemlectureid')),
            time: Number(e.target.getAttribute('time')),
        });
    }

    const handleItemDragEnter = () => {
        setObjItem({ ...objItem, target: null });
    };

    const handleItemDrop = e => {
        e.preventDefault();
        setObjItem({});
        const itemIdx = objItem.idx;
        const itemLectureId = objItem.lectureId;
        const time = objItem.time;
        const targetItemIdx = Number(e.target.getAttribute('idx'));
        const endTime = targetItemIdx + time - 1;
        if (!checkValidSchedule(endTime, targetItemIdx, itemRowData, itemLectureId)) {
            return false;
        }
        if (targetItemIdx != 0) {
            const removedLecture = _.reject([...itemRowData], function (o) {
                //이전 과목 시간은 삭제
                return (o.block_group_No >= itemIdx && o.block_group_No < itemIdx + time) || (o.block_group_No >= targetItemIdx && o.block_group_No < targetItemIdx + time);
            });
            const addLecture = _.range(targetItemIdx, targetItemIdx + time).reduce((result, e) => {
                //드롭된 위치에 새롭게 생성
                result.push({ block_group_No: e, lecture_subject_Id: itemLectureId });
                return result;
            }, []);
            setItemRowData([...removedLecture, ...addLecture]);
        }
    };

    function handleItemDragOver(e) {
        e.preventDefault();
    }

    const handleClickActiveAreaType = e => {
        return () => {
            setActiveAreaType(e);
        };
    };
    return (
        <React.Fragment>
            <Layout>
                {isAreaClickDown && (
                    // <FollowCursor duration={0} size={0}>
                    <Cursor duration={0} size={0}>
                        {isAreaAppend ? (
                            <Tooltip style={{ background: 'red', width: '50px', textAlign: 'center' }}>삭제</Tooltip>
                        ) : (
                            <Tooltip className={`lecture_${activeAreaType ? `${activeAreaType}` : 'all'}`}>
                                <span>{activeAreaType == null ? '상관없음' : master.getLectureName(activeAreaType)}</span>
                                <br />
                                <span>{`${schedule.getWeekText(objArea.startOverDayIdx)} ${schedule.getTime(objArea.startOverIdx)}`}</span> {` ~ `}
                                <span>{`${schedule.getWeekText(objArea.endOverDayIdx)} ${schedule.getTime(objArea.endOverIdx)}`}</span>
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
                                                        <div //과외 가능 시간 데이터
                                                            idx={idx}
                                                            onMouseOver={handleAreaOver}
                                                            onMouseUp={handleAreaUp}
                                                            onMouseDown={handleAreaDown}
                                                            onDrop={handleItemDrop}
                                                            onDragOver={handleItemDragOver}
                                                            onDragEnter={handleAreaEnter}
                                                            className={`item ${areaRowData.some(item => item.block_group_No === idx) ? 'active' : ''} 
                                                            ${objItem.target <= idx && objItem.target + objItem?.time > idx ? 'over' : ''} 
                                                            ${grabbedAreaData.some(item => item.block_group_No === idx) ? 'dragging' : ''}
                                                            lecture_${_.find(areaRowData, o => o.block_group_No === idx)?.activeAreaType}`}
                                                        >
                                                            {idx}
                                                        </div>
                                                        {/* <Area /> */}
                                                        {itemGroupData.some(y => y.startIdx === idx) && (
                                                            <React.Fragment>
                                                                <FixedItem
                                                                    master={master}
                                                                    idx={idx}
                                                                    itemlectureid={master.getLectureId(idx) ? master.getLectureId(idx) : ''}
                                                                    handleDragStart={handleItemDrag}
                                                                    handleDragEnter={handleItemDragEnter}
                                                                    handleClick={handleItemClick}
                                                                    itemGroupData={master.getItemGruopData()}
                                                                    itemLectureName={master.getLectureName(idx)}
                                                                    timeList={timeList}
                                                                    itemObj={objItem}
                                                                />
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
