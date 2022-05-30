import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemGroupData, setMatchingItemGroupData, setTimeListData } from '../store/reducer/schedule.reducer';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import Area from './Area';
import FixedItem from './FixedItem';
import styled from 'styled-components';
import Distribution from './Distribution';
import { distData } from '../mock/distData';
import _ from 'lodash';
import MatchingItem from './MatchingItem';
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
        width: 100%;
        position: absolute;
        top: 0px;
        z-index: 0;
        color: #b3b3b3;
    }
    .active {
        cursor: cell;
        width: 100%;
        height: 100%;
        background: #d0ece7;
        color: white;
        z-index: 1;
    }
    .weekend {
        background: #fef0f7;
    }
    .over {
        background: #fa8072 !important;
        position: absolute;
        width: 100%;
        top: 0;
        z-index: 0;
        // border: 2px solid blue;
        // border-radius: 3px;
        // box-shadow: 0 0 0 3px #000 inset;
        // background-color: transparent;
    }
    .time4 {
        height: 84px;
    }
    .time6 {
        height: 127px;
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
        background: #d0ece7;
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
    .lecture_9171 {
        background: plum;
    }
    .ignoreEnter {
        pointer-events: none;
    }
`;

function TableBody() {
    const tableRef = useRef();
    const dispatch = useDispatch();

    const { areaData, itemData, itemGroupData, timeListData, matchingItemData, matchingItemGroupData } = useSelector(state => state.schedule);
    const { areaGrabbedObj, itemObj, areaObj, isAreaClickDown } = useSelector(state => state.trigger);

    useEffect(() => {
        dispatch(setTimeListData(schedule.getTimeList()));
        dispatch(setItemGroupData(lecture.getGroupByLectureTime(itemData)));
        dispatch(setMatchingItemGroupData(lecture.getGroupByLectureTime(matchingItemData)));
    }, [itemData, matchingItemData]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         tableRef.current.scrollTo(0, 681);
    //     }, 0);
    // }, []);

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
                                            const level = _.find(distData, { block_group_No: idx })?.level;
                                            return (
                                                <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                    <Area
                                                        idx={idx}
                                                        areaData={areaData}
                                                        itemData={itemData}
                                                        matchingItemData={matchingItemData}
                                                        areaObj={areaObj}
                                                        itemObj={itemObj}
                                                        areaGrabbedObj={areaGrabbedObj}
                                                        isAreaClickDown={isAreaClickDown}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                    </Area>
                                                    {itemGroupData.some(y => y.startIdx === idx) && <FixedItem idx={idx} />}
                                                    {matchingItemGroupData.some(y => y.startIdx === idx) && <MatchingItem idx={idx} />}
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
