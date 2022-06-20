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
    const [areaObj, setAreaObj] = useState({}); //trigger 관련 state도 custome hook 처리 해야함
    const [itemObj, setItemObj] = useState({});
    const [isAreaClickDown, setIsAreaClickDown] = useState(false);
    const [isAreaAppend, setIsAreaAppend] = useState(false);
    const timeListData = schedule.getTimeList();

    const link = new LinkAdmin(interfaceHook); //admin interface link class
    useEffect(() => {
        link.readyToListen(); //addEventMessage
        return () => {
            link.clearListen(); //removeEventMessage
        };
    }, []);
    // useEffect(() => {
    //     //실제 분리되면 사용되지않을???
    //     areaHook.setAreaData(props.areaData);
    //     itemHook.setFixedItemData(props.fixedItemData);
    //     itemHook.setMatchingItemData(props.matchingItemData);
    // }, [interfaceHook.target]);
    useEffect(() => {
        if (interfaceHook.target === 'teacher' && interfaceHook.auth === 'admin') {
            !_.isEmpty(interfaceHook.teacherData) && areaHook.setAreaData(interfaceHook.teacherData);
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
                                                        areaObj={areaObj}
                                                        itemObj={itemObj}
                                                        isAreaClickDown={isAreaClickDown}
                                                        isAreaAppend={isAreaAppend}
                                                        setAreaObj={setAreaObj}
                                                        setItemObj={setItemObj}
                                                        setIsAreaClickDown={setIsAreaClickDown}
                                                        setIsAreaAppend={setIsAreaAppend}
                                                    >
                                                        {level && <Distribution level={level} />}
                                                        {lectureData?.map((e, i) => (
                                                            <LectureItem key={i} id={e} idx={idx} areaHook={areaHook} interfaceHook={interfaceHook} />
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
                                                            interfaceHook={interfaceHook}
                                                            type={'fixed'}
                                                            idx={idx}
                                                            setItemObj={setItemObj}
                                                            setIsAreaClickDown={setIsAreaClickDown}
                                                        />
                                                    )}
                                                    {interfaceHook.auth === 'admin' &&
                                                        itemHook.matchingItemGroupData.some(y => y.startIdx === idx) && (
                                                            <Item
                                                                itemHook={itemHook}
                                                                interfaceHook={interfaceHook}
                                                                type={'matching'}
                                                                idx={idx}
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
