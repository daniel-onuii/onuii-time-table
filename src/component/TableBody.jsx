import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
import useAreaData from '../hooks/useAreaData';
import useItemData from '../hooks/useItemData';
import useAreaSelectData from '../hooks/useAreaSelectData';
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

function TableBody(props) {
    const areaHook = useAreaData(props.areaData || []);
    const itemHook = useItemData({
        fixed: props.fixedItemData || [],
        matching: props.matchingItemData || [],
    });
    const areaSelectHook = useAreaSelectData();

    const tableRef = useRef();
    const compareAreaData = useSelector(state => state.compare.areaData);
    const { selectMode } = useSelector(state => state.user);
    const { auth } = props;

    const [areaObj, setAreaObj] = useState({});
    const [itemObj, setItemObj] = useState({});
    const [isAreaClickDown, setIsAreaClickDown] = useState(false);
    const [isAreaAppend, setIsAreaAppend] = useState(false);

    const timeListData = schedule.getTimeList();

    useEffect(() => {
        post.sendMessage({ name: 'selectMatchingArea', data: { blocks: areaSelectHook.filter, lecture_id: selectMode.lecture_subject_Id } });
    }, [areaSelectHook.filter]);

    useEffect(() => {
        post.sendMessage({ name: 'updateMatching', data: itemHook.matchingItemGroupData });
    }, [itemHook.matchingItemGroupData]);

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
                                            const lectureData = _.find(areaHook.areaData, { block_group_No: idx })?.areaActiveType;
                                            const maxBlock = _.maxBy(areaSelectHook.lecture, 'block_group_No');
                                            return (
                                                <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                    <Area
                                                        areaHook={areaHook}
                                                        itemHook={itemHook}
                                                        areaSelectHook={areaSelectHook}
                                                        idx={idx}
                                                        auth={auth}
                                                        areaObj={areaObj}
                                                        itemObj={itemObj}
                                                        isAreaClickDown={isAreaClickDown}
                                                        isAreaAppend={isAreaAppend}
                                                        setAreaObj={setAreaObj}
                                                        setItemObj={setItemObj}
                                                        setIsAreaClickDown={setIsAreaClickDown}
                                                        setIsAreaAppend={setIsAreaAppend}
                                                        compareAreaData={_.intersectionBy(compareAreaData, areaSelectHook.filter, 'block_group_No')}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                        {lectureData?.map((e, i) => (
                                                            <LectureItem key={i} id={e} idx={idx} areaHook={areaHook} />
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
                                                    {itemHook.fixedItemGroupData.some(y => y.startIdx === idx) && (
                                                        <Item
                                                            itemHook={itemHook}
                                                            type={'fixed'}
                                                            idx={idx}
                                                            auth={auth}
                                                            setItemObj={setItemObj}
                                                            setIsAreaClickDown={setIsAreaClickDown}
                                                        />
                                                    )}
                                                    {auth === 'admin' && itemHook.matchingItemGroupData.some(y => y.startIdx === idx) && (
                                                        <Item
                                                            itemHook={itemHook}
                                                            type={'matching'}
                                                            idx={idx}
                                                            auth={auth}
                                                            setItemObj={setItemObj}
                                                            setIsAreaClickDown={setIsAreaClickDown}
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
