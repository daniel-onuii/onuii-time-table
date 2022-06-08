import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemGroupData, setMatchingItemGroupData, setTimeListData } from '../store/reducer/schedule.reducer';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import Area from './area/Area';
import Item from './item/Item';
import styled from 'styled-components';
import Distribution from './area/Distribution';
import { distData } from '../mock/distData';
import _ from 'lodash';
import LectureItem from './area/LectureItem';
import { post } from '../util/interface';
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
    .item {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0px;
        z-index: 0;
        color: #b3b3b3;
        display: flex;
    }
    .item:hover {
        background: #cfcfcf;
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
    }
    .dragging {
        background: #01a8fe !important;
        color: white;
    }
    .matching {
        background: yellow;
        color: white;
    }
    .ignoreEnter {
        pointer-events: none;
    }
    .equal {
        background: pink;
    }
`;

function TableBody() {
    const tableRef = useRef();
    const dispatch = useDispatch();

    const { areaData, fixedItemData, fixedItemGroupData, timeListData, matchingItemData, matchingItemGroupData } = useSelector(
        state => state.schedule,
    );
    const { areaGrabbedObj, areaMatchingObj, itemObj, areaObj, isAreaClickDown, isAreaAppend } = useSelector(state => state.trigger);
    const compareAreaData = useSelector(state => state.compare.areaData);
    const { auth, selectMode } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(setTimeListData(schedule.getTimeList()));
        dispatch(setItemGroupData(lecture.getGroupByLectureTime(fixedItemData)));
        dispatch(setMatchingItemGroupData(lecture.getGroupByLectureTime(matchingItemData)));
    }, [fixedItemData, matchingItemData]);

    useEffect(() => {
        post.sendMessage({ name: 'matchingObj', data: { blocks: areaMatchingObj, lecture_id: selectMode.lecture_subject_Id } });
    }, [areaMatchingObj]);

    // useEffect(() => {
    //     console.log(areaData);
    //     console.log(fixedItemGroupData);
    // }, [areaData]);

    // useEffect(() => {
    //     console.log('!!', compareAreaData, areaMatchingObj);
    //     console.log('??', _.intersectionBy(compareAreaData, areaMatchingObj, 'block_group_No'));
    // }, [compareAreaData]);
    // useEffect(() => {
    //     //     setTimeout(() => {
    //     //         tableRef.current.scrollTo(0, 681);
    //     //     }, 0);
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
                                            const lectureData = _.find(areaData, { block_group_No: idx })?.areaActiveType;
                                            return (
                                                <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                    <Area
                                                        idx={idx}
                                                        areaData={areaData}
                                                        fixedItemData={fixedItemData}
                                                        matchingItemData={matchingItemData}
                                                        areaObj={areaObj}
                                                        itemObj={itemObj}
                                                        areaGrabbedObj={areaGrabbedObj}
                                                        areaMatchingObj={areaMatchingObj}
                                                        isAreaClickDown={isAreaClickDown}
                                                        isAreaAppend={isAreaAppend}
                                                        compareAreaData={_.intersectionBy(compareAreaData, areaMatchingObj, 'block_group_No')}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                        {lectureData?.map((e, i) => (
                                                            <LectureItem key={i} id={e} idx={idx} />
                                                        ))}
                                                    </Area>
                                                    {fixedItemGroupData.some(y => y.startIdx === idx) && (
                                                        <Item type={'fixed'} idx={idx} itemData={fixedItemData} itemGroupData={fixedItemGroupData} />
                                                    )}
                                                    {auth === 'admin' && matchingItemGroupData.some(y => y.startIdx === idx) && (
                                                        <Item
                                                            type={'matching'}
                                                            idx={idx}
                                                            itemData={matchingItemData}
                                                            itemGroupData={matchingItemGroupData}
                                                        />
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
    );
}

export default TableBody;
