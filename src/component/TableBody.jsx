import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Area from './area/Area';
import Item from './item/Item';
import Distribution from './area/Distribution';
import LectureItem from './area/LectureItem';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import { distData } from '../mock/distData';
import { LinkAdmin } from '../util/interface';
import useAreaData from '../hooks/useAreaData';
import useItemData from '../hooks/useItemData';
import useAreaSelectData from '../hooks/useAreaSelectData';
import useInterface from '../hooks/useInterface';
import { tableBody } from '../style/tableBody';
const Layout = styled.div`
    ${tableBody}
`;

function TableBody(props) {
    const interfaceHook = useInterface(props);
    const areaHook = useAreaData(props.areaData || []);
    const itemHook = useItemData({
        fixed: props.fixedItemData || [],
        matching: props.matchingItemData || [],
    });
    const areaSelectHook = useAreaSelectData();
    const tableRef = useRef();
    const timeListData = schedule.getTimeList();
    const link = new LinkAdmin(interfaceHook); //admin interface link class
    useEffect(() => {
        link.readyToListen(); //addEventMessage
        return () => {
            link.clearListen(); //removeEventMessage
        };
    }, []);
    useEffect(() => {
        //admin에서 학생 변경시
        if (!_.isEmpty(interfaceHook.studentData) && interfaceHook.auth === 'admin' && interfaceHook.target === 'student') {
            areaHook.setAreaData(interfaceHook.studentData.areaData);
            itemHook.setFixedItemData(interfaceHook.studentData.fixedItemData);
            itemHook.setMatchingItemData(interfaceHook.studentData.matchingItemData);
        }
    }, [interfaceHook.studentData]);
    useEffect(() => {
        //admin에서 선생님 변경시
        if (!_.isEmpty(interfaceHook.teacherData) && interfaceHook.auth === 'admin' && interfaceHook.target === 'teacher') {
            areaHook.setAreaData(interfaceHook.teacherData.areaData);
            itemHook.setFixedItemData(interfaceHook.teacherData.fixedItemData);
            itemHook.setMatchingItemData(interfaceHook.teacherData.matchingItemData);
        }
    }, [interfaceHook.teacherData]);

    useEffect(() => {
        link.sendMessage({ name: 'selectMatchingArea', data: { blocks: areaSelectHook.filter } }); //가매칭 filter 영역 선택시 데이터 post
    }, [areaSelectHook.filter]);
    useEffect(() => {
        link.sendMessage({ name: 'updateMatching', data: itemHook.matchingItemGroupData }); //추가한 가매칭 그룹 정보
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
                                                        interfaceHook={interfaceHook}
                                                        idx={idx}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                        {lectureData?.map((e, i) => (
                                                            <LectureItem key={i} id={e} idx={idx} areaHook={areaHook} interfaceHook={interfaceHook} />
                                                        ))}
                                                        {maxBlock?.block_group_No === idx ? (
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
                                                            itemHook={itemHook}
                                                            areaHook={areaHook}
                                                            interfaceHook={interfaceHook}
                                                            type={'fixed'}
                                                            idx={idx}
                                                        />
                                                    )}
                                                    {interfaceHook.auth === 'admin' &&
                                                        itemHook.matchingItemGroupData.some(y => y.startIdx === idx) && (
                                                            <Item
                                                                itemHook={itemHook}
                                                                areaHook={areaHook}
                                                                interfaceHook={interfaceHook}
                                                                type={'matching'}
                                                                idx={idx}
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
