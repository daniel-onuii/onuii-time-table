import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Area from './area/Area';
import Item from './item/Item';
import Distribution from './area/Distribution';
import LectureItem from './area/LectureItem';
import useAreaData from '../hooks/useAreaData';
import useItemData from '../hooks/useItemData';
import useAreaSelectData from '../hooks/useAreaSelectData';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import { distData } from '../mock/distData';
import { tableBody } from '../style/tableBody';
import { LinkAdmin } from '../util/interface';
import { AreaEvent } from '../util/event';
const Layout = styled.div`
    ${tableBody}
`;

function TableBody(props) {
    const tableRef = useRef();
    const interfaceHook = props.interfaceHook;
    const timeListData = schedule.getTimeList();
    const areaSelectHook = useAreaSelectData();
    const areaHook = useAreaData(props?.areaData || []);
    const itemHook = useItemData({
        fixed: props?.fixedItemData || [],
        matching: props?.matchingItemData || [],
    });
    const link = new LinkAdmin(interfaceHook, areaSelectHook, areaHook); //admin interface link class
    const areaEvent = new AreaEvent({ areaHook: areaHook, areaSelectHook: areaSelectHook, interfaceHook: interfaceHook, itemHook: itemHook });

    useEffect(() => {
        link.readyToListen(); //addEventMessage
        return () => {
            link.clearListen(); //removeEventMessage
        };
    }, []);

    useEffect(() => {
        if (interfaceHook.auth === 'user') {
            const handler = e => {
                if (e.data.id === 'onuii-time-table') {
                    switch (e.data.name) {
                        case 'getBlockData': //데이터 요청
                            const reName = areaHook.areaData.reduce((result, e) => {
                                result.push({
                                    timeBlockId: e.timeBlockId,
                                    lectureSubjectId: e.lectureSubjectIds,
                                });
                                return result;
                            }, []);
                            link.sendMessage({ name: 'responseBlockData', data: reName }); //가매칭 filter 영역 선택시 데이터 post
                            break;
                    }
                }
            };
            window.addEventListener('message', handler);
            return () => {
                window.removeEventListener('message', handler);
            };
        }
    }, [areaHook.areaData]);
    useEffect(() => {
        areaSelectHook.setMatchingTarget([]);
        areaHook.setAreaObj({});
        // console.log('check validation', interfaceHook.userData?.lectureData, areaHook.areaData);
    }, [areaHook.areaData]);

    useEffect(() => {
        link.sendMessage({ name: 'selectMatchingArea', data: { blocks: areaSelectHook.filter } }); //가매칭 filter 영역 선택시 데이터 post
    }, [areaSelectHook.filter]);

    useEffect(() => {
        if (!_.isEmpty(itemHook.matchingItemGroupData) && interfaceHook.auth === 'admin' && interfaceHook.target === 'teacher') {
            const handler = e => {
                if (e.data.id === 'onuii-time-table') {
                    switch (e.data.name) {
                        case 'getMatchingData': //데이터 요청
                            link.sendMessage({ name: 'responseMatchingData', data: itemHook.matchingItemGroupData }); //가매칭 filter 영역 선택시 데이터 post
                            break;
                    }
                }
            };
            window.addEventListener('message', handler);
            return () => {
                window.removeEventListener('message', handler);
            };
        }
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
                                        {isOntime ? (
                                            <th rowSpan="4" className={i >= 40 ? 'night' : 'day'}>
                                                {e.split(':')[0]}시
                                            </th>
                                        ) : null}
                                        {_.range(0, 7).map((e, ii) => {
                                            const idx = table.getBlockId(e, i);
                                            const level = _.find(distData, { timeBlockId: idx })?.level;
                                            const lectureData = _.find(areaHook.areaData, { timeBlockId: idx })?.lectureSubjectIds;
                                            const maxBlock = _.maxBy(areaSelectHook.lecture, 'timeBlockId');
                                            return (
                                                <td key={ii} className={`${e >= 6 ? 'weekend' : ''}`}>
                                                    <Area
                                                        idx={idx}
                                                        areaHook={areaHook}
                                                        itemHook={itemHook}
                                                        areaSelectHook={areaSelectHook}
                                                        interfaceHook={interfaceHook}
                                                        areaEvent={areaEvent}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                        {lectureData?.map((e, i) => (
                                                            <LectureItem key={i} id={e} idx={idx} areaHook={areaHook} interfaceHook={interfaceHook} />
                                                        ))}
                                                        {maxBlock?.timeBlockId === idx ? (
                                                            <div className={'timeText'}>
                                                                <span>{`${schedule.getTime(areaHook.areaObj.startOverIdx)}`}</span> {` - `}
                                                                <span>{`${schedule.getTime(areaHook.areaObj.endOverIdx)}`}</span>
                                                            </div>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </Area>
                                                    {itemHook.fixedItemGroupData.some(y => y.startIdx === idx) && (
                                                        <Item
                                                            type={'fixed'}
                                                            idx={idx}
                                                            itemHook={itemHook}
                                                            areaHook={areaHook}
                                                            interfaceHook={interfaceHook}
                                                        />
                                                    )}
                                                    {interfaceHook.auth === 'admin' &&
                                                        itemHook.matchingItemGroupData.some(y => y.startIdx === idx) && (
                                                            <Item
                                                                idx={idx}
                                                                type={'matching'}
                                                                itemHook={itemHook}
                                                                areaHook={areaHook}
                                                                interfaceHook={interfaceHook}
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
            {/* <div style={{ width: 'calc(100% - 4px)', borderBottom: '1px solid #cdcdcd' }}></div> */}
        </Layout>
    );
}

export default TableBody;
