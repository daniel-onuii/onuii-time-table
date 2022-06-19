import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Area from './area/Area';
import Item from './item/Item';
import Distribution from './area/Distribution';
import LectureItem from './area/LectureItem';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import { distData } from '../mock/distData';
import { post } from '../util/interface';
import useAreaData from '../hooks/useAreaData';
import useItemData from '../hooks/useItemData';
import useAreaSelectData from '../hooks/useAreaSelectData';
import useInterface from '../hooks/useInterface';
import { tableBody } from '../style/tableBody';
const Layout = styled.div`
    ${tableBody}
`;

function TableBody(props) {
    const interfaceHook = useInterface();
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
    useEffect(() => {
        console.log(interfaceHook.auth);
        post.readyToListen(interfaceHook);
        return () => {
            post.clearListen(interfaceHook);
        };
    }, []);

    useEffect(() => {
        console.log('auth!!', interfaceHook.auth);
    }, [interfaceHook.auth]);

    useEffect(() => {
        post.sendMessage({ name: 'selectMatchingArea', data: { blocks: areaSelectHook.filter } });
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
