import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemGroupData, setTimeListData } from '../store/reducer/schedule.reducer';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import Area from './Area';
import FixedItem from './FixedItem';
import styled from 'styled-components';
const Layout = styled.div`
    .contents {
        height: 504px;
        overflow-y: scroll;
    }
    .onTime {
        border-top: 1px solid #cdcdcd;
    }
    .onTime th {
        font-size: 15px;
        color: #757575;
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
        z-index: 0;
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
        // z-index: 999;
    }
    .time4 {
        height: 80px;
    }
    .time6 {
        height: 120px;
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
`;

function TableBody() {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const { areaData, itemData, itemGroupData, timeListData } = useSelector(state => state.schedule);
    const { areaGrabbedObj, itemObj, areaObj, isAreaClickDown, isAreaAppend, areaActiveType } = useSelector(state => state.trigger);

    useEffect(() => {
        dispatch(setTimeListData(schedule.getTimeList()));
        dispatch(setItemGroupData(lecture.getGroupByLectureTime(itemData)));
    }, [itemData]);

    return (
        <Layout>
            <div className="contents" ref={tableRef}>
                <table>
                    <tbody>
                        {timeListData.map((e, i) => {
                            const isOntime = i % 4 === 0; //정시조건
                            return (
                                <React.Fragment key={i}>
                                    <tr className={isOntime ? 'onTime' : ''}>
                                        {isOntime ? <th rowSpan="4">{e}</th> : null}
                                        {_.range(0, 7).map((e, ii) => {
                                            const idx = table.getBlockId(e, i);
                                            return (
                                                <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
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
    );
}

export default TableBody;
