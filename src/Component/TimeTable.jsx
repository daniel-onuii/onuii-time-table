import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Cursor from 'react-cursor-follow';
import FixedItem from './FixedItem';
import Area from './Area';

import { schedule } from '../util/schedule';
import { table } from '../util/table';
import { lecture } from '../util/lecture';
import { useDispatch, useSelector } from 'react-redux';
import { setAreaData, setItemData, setItemGroupData, setTimeListData } from '../store/reducer/schedule.reducer';
import { setAreaActiveType, setAreaGrabbedObj, setAreaObj, setIsAreaAppend, setIsAreaClickDown, setItemObj } from '../store/reducer/trigger.reducer';

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

function TimeTable() {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const { areaData, itemData, itemGroupData, timeListData } = useSelector(state => state.schedule);
    const { areaGrabbedObj, itemObj, areaObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);

    useEffect(() => {
        dispatch(setTimeListData(schedule.getTimeList()));
        dispatch(setItemGroupData(lecture.getGroupByLectureTime(itemData)));
    }, [itemData]);

    const handleClickActiveAreaType = e => {
        return () => {
            dispatch(setAreaActiveType(e));
        };
    };

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
                <div className="head">
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
                            {timeListData.map((e, i) => {
                                const isOntime = i % 4 === 0; //정시조건
                                return (
                                    <React.Fragment key={i}>
                                        <tr className={isOntime ? 'tr_parent' : ''}>
                                            {isOntime ? <th rowSpan="4">{e}</th> : null}
                                            {_.range(0, 7).map((e, ii) => {
                                                const idx = table.getBlockId(e, i);
                                                return (
                                                    //map 테이블 데이터를 state 생성해서 해당 부분만 업데이트
                                                    <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                        {/* <div //과외 가능 시간 데이터 ./.... Area 관련 컴퍼넌트 개발 핸들러 리팩토링
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
                                                        </div> */}
                                                        <Area
                                                            idx={idx}
                                                            areaData={areaData}
                                                            itemData={itemData}
                                                            areaObj={areaObj}
                                                            itemObj={itemObj}
                                                            areaGrabbedObj={areaGrabbedObj}
                                                            isAreaClickDown={isAreaClickDown}
                                                            isAreaAppend={isAreaAppend}
                                                            areaActiveType={areaActiveType}
                                                        />
                                                        {itemGroupData.some(y => y.startIdx === idx) && <FixedItem idx={idx} />}
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

export default TimeTable;
