import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAreaGroupData, setFixedItemGroupData, setMatchingItemGroupData, setTimeListData } from '../store/reducer/schedule.reducer';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import { area } from '../util/area';
import Area from './area/Area';
import Item from './item/Item';
import styled from 'styled-components';
import Distribution from './area/Distribution';
import { distData } from '../mock/distData';
import _ from 'lodash';
import LectureItem from './area/LectureItem';
import { post } from '../util/interface';
const Layout = styled.div`
    table {
        // border: 1px solid #cdcdcd;
        // border-top: none;
        border-right: 1px solid #cdcdcd;
    }
    @media (min-width: 376px) {
        td {
            height: 21px;
        }
    }
    @media (max-width: 375px) {
        td {
            height: 16px;
        }
    }
    .contents {
        height: 504px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: #ccc;
        }
    }
    .onTime {
        border-top: 1px solid #cdcdcd;
    }
    tr:first-child,
    tr:last-child {
        border-top: none;
        border-bottom: none;
    }
    .onTime th {
        font-size: 15px;
        color: #757575;
    }
    th,
    td {
        border-left: 1px solid #cdcdcd;
        text-align: center;
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
        // position: absolute;
        top: 0px;
        z-index: 0;
        color: #b3b3b3;
        display: flex;
    }
    .item:hover {
        cursor: cell;
        background: #efefef;
        :not(.dragging)::after {
            content: '📌';
            color: #fff;
            font-size: 13px;
            z-index: 4;
        }
    }
    .active {
        width: 100%;
        height: 100%;
        // background: #d0ece7;
        color: white;
        z-index: 1;
    }
    .weekend {
        background: #fef0f7;
    }
    .item.over {
        background: #fa8072 !important;
        position: absolute;
        width: 100%;
        top: 0;
        z-index: 0;
    }
    .item.dragging {
        background: #01a8fe !important;
        color: white;
    }
    .item.matching {
        // background-color: rgba(165, 210, 255, 0.4);
        // background-image: linear-gradient(90deg, rgba(165, 210, 255, 0.3) 50%, transparent 50%),
        //     linear-gradient(rgba(165, 210, 255, 0.3) 50%, transparent 50%);
        // background-size: 20px 20px;
        background: green;
    }
    .item.matching .area,
    .item.dragging .area,
    .item.over .area,
    .item.tempMatching .area {
        opacity: 0.2;
    }

    .item.tempMatching {
        box-shadow: 100vw 100vh 0px yellow inset;
    }

    .ignoreEnter {
        pointer-events: none;
    }
    .item.equal {
        background: pink;
    }
    .timeText {
        position: absolute;
        right: 5px;
        z-index: 2;
    }
`;

function TableBody() {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const { areaData, fixedItemData, fixedItemGroupData, timeListData, matchingItemData, matchingItemGroupData } = useSelector(
        state => state.schedule,
    );
    const { areaGrabbedObj, areaMatchingObj, areaObj } = useSelector(state => state.trigger);
    const compareAreaData = useSelector(state => state.compare.areaData);
    const { auth, selectMode } = useSelector(state => state.user);

    useEffect(() => {
        //과외 시간 그룹
        dispatch(setTimeListData(schedule.getTimeList()));
        dispatch(setFixedItemGroupData(lecture.getGroupByLectureTime(fixedItemData)));
        dispatch(setMatchingItemGroupData(lecture.getGroupByLectureTime(matchingItemData)));
    }, [fixedItemData, matchingItemData]);

    useEffect(() => {
        //희망 시간 그룹
        dispatch(setAreaGroupData(area.getAreaGroupData(areaData)));
    }, [areaData]);

    useEffect(() => {
        //가매칭 영역 선택시 postmessage
        post.sendMessage({ name: 'selectMatchingArea', data: { blocks: areaMatchingObj, lecture_id: selectMode.lecture_subject_Id } });
    }, [areaMatchingObj]);

    useEffect(() => {
        post.sendMessage({ name: 'updateMatching', data: matchingItemGroupData });
    }, [matchingItemGroupData]);

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
                                            const lectureData = _.find(areaData, { block_group_No: idx })?.areaActiveType;
                                            const maxBlock = _.maxBy(areaGrabbedObj, 'block_group_No');
                                            return (
                                                <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                    <Area
                                                        idx={idx}
                                                        compareAreaData={_.intersectionBy(compareAreaData, areaMatchingObj, 'block_group_No')}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                        {lectureData?.map((e, i) => (
                                                            <LectureItem key={i} id={e} idx={idx} />
                                                        ))}
                                                        {maxBlock?.block_group_No === idx ? (
                                                            <div className={'timeText'}>
                                                                <span>{`${schedule.getTime(areaObj.startOverIdx)}`}</span> {` - `}
                                                                <span>{`${schedule.getTime(areaObj.endOverIdx)}`}</span>
                                                            </div>
                                                        ) : (
                                                            ''
                                                        )}
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
