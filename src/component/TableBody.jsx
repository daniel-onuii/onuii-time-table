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
    // useEffect(() => {
    // console.log(interfaceHook);
    // }, [interfaceHook]);
    useEffect(() => {
        if (!_.isNull(interfaceHook.subject)) {
            link.sendMessage({ name: 'loadComplete', type: interfaceHook.target }); //areaData 변경될때마다 return i
        }
    }, [areaHook.areaData, interfaceHook.subject]);
    useEffect(() => {
        link.readyToListen(); //addEventMessage
        return () => {
            link.clearListen(); //removeEventMessage
        };
    }, []);

    useEffect(() => {
        const reName = areaHook.areaData.reduce((result, e) => {
            // api 에서 사용할 ids 이름 변경로직인데 graphql로 바로 저장하지않아서 당장은 필요없어짐
            result.push({
                timeBlockId: e.timeBlockId > 671 ? e.timeBlockId - 672 : e.timeBlockId,
                lectureSubjectId: _.without(e.lectureSubjectId, 'all'), //선생님차트 또는 학생 null 데이터때 표시하던 all 더미 값 제거
            });
            return result;
        }, []);
        const userLectureInfo = interfaceHook?.userData?.lectureData;
        // const checkValidation = !_.isEmpty(userLectureInfo) ? schedule.checkAreaValidation(userLectureInfo, areaHook.areaData) : null;
        const checkValidation = () => {
            if (!_.isEmpty(userLectureInfo)) {
                const processIds = schedule.processingData.reduce((result, e) => {
                    result.push(e.subject.subjectId);
                    return result;
                }, []);
                const validList = schedule.checkAreaValidation(userLectureInfo, areaHook.areaData); //매칭중인 과목은 validation 제외
                const finalValidList = _.filter(validList, function (o) {
                    return !processIds.includes(o.lectureId);
                });
                return finalValidList;
            } else {
                return null;
            }
        };
        link.sendMessage({ name: 'responseRealTimeBlockData', data: reName, validation: checkValidation() }); //areaData 변경될때마다 return interface
        areaSelectHook.setMatchingTarget([]); //초기화
        areaHook.setAreaObj({}); //초기화
        //----//
        if (interfaceHook.auth === 'user') {
            // areaHook.setHistoryAreaData([...areaHook.historyAreaData, areaHook.areaData]);
            const handler = e => {
                if (e.data.id === 'onuii-time-table') {
                    switch (e.data.name) {
                        case 'getBlockData': //데이터 요청
                            link.sendMessage({ name: 'responseBlockData', data: reName, validation: checkValidation }); //가매칭 filter 영역 선택시 데이터 post
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
    // useEffect(() => {
    //     console.log(areaHook.historyAreaData);
    // }, [areaHook.historyAreaData]);
    useEffect(() => {
        link.sendMessage({ name: 'selectMatchingArea', data: { blocks: areaSelectHook.filter } }); //가매칭 filter 영역 선택시 데이터 post
    }, [areaSelectHook.filter]);

    useEffect(() => {
        if (!_.isEmpty(itemHook.matchingItemGroupData) && interfaceHook.auth === 'admin' && interfaceHook.target === 'teacher') {
            const rename = itemHook.matchingItemGroupData.reduce((result, e) => {
                result.push({ ...e, startIdx: e.startIdx > 671 ? e.startIdx - 672 : e.startIdx, endIdx: e.endIdx > 671 ? e.endIdx - 672 : e.endIdx });
                return result;
            }, []);
            const handler = e => {
                if (e.data.id === 'onuii-time-table') {
                    switch (e.data.name) {
                        case 'getMatchingData': //데이터 요청
                            link.sendMessage({
                                name: 'responseMatchingData',
                                // data: _.filter(itemHook.matchingItemGroupData, { lectureId: interfaceHook.subject }),
                                data: _.filter(rename, { lectureId: interfaceHook.subject }),
                                option: _.find(interfaceHook?.userData?.lectureData, { lectureId: interfaceHook.subject })?.lesson_time,
                            }); //가매칭 filter 영역 선택시 데이터 post
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

    useEffect(() => {
        const inputKey = e => {
            if (interfaceHook.auth === 'user') {
                switch (e.key) {
                    case 'Escape':
                        areaEvent.clickCancel();
                        break;
                    default:
                    // console.log(e.key);
                }
            }
        };
        document.addEventListener('keydown', inputKey);
        return () => {
            document.removeEventListener('keydown', inputKey);
        };
    }, []);
    return (
        <Layout>
            <div className={`contents ${interfaceHook.target} ${_.isNull(interfaceHook.subject) ? 'ignoreEnter' : ''}`} ref={tableRef}>
                <table style={{ pointerEvents: interfaceHook.auth === 'user' && interfaceHook.subject === null ? 'none' : '' }}>
                    <tbody>
                        {timeListData.map((e, i) => {
                            const isOntime = i % 4 === 0; //정시조건
                            return (
                                <React.Fragment key={i}>
                                    <tr className={`${isOntime ? 'onTime' : ''} ${i % 2 ? '' : 'grey'}`}>
                                        {isOntime ? (
                                            <th rowSpan="4" className={i >= 40 ? 'night' : 'day'}>
                                                {e.split(':')[0]}
                                            </th>
                                        ) : null}
                                        {_.range(0, 7).map((e, ii) => {
                                            const idx = table.getBlockId(e, i);
                                            // const level = _.find(distData, { timeBlockId: idx })?.level;
                                            const lectureData = _.find(areaHook.areaData, { timeBlockId: idx })?.lectureSubjectId;
                                            // const maxBlock = _.maxBy(areaSelectHook.lecture, 'timeBlockId');
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
                                                        {/* {level && <Distribution level={level} />} */}
                                                        {lectureData?.map((e, i) => (
                                                            // <span style={{ color: 'red' }}>{i}</span>
                                                            <LectureItem key={i} id={e} idx={idx} areaHook={areaHook} interfaceHook={interfaceHook} />
                                                        ))}
                                                        {/* {maxBlock?.timeBlockId === idx ? (
                                                            <div id={idx} className={'timeText'}>
                                                                <span id={idx}>{`${schedule.getTime(areaHook.areaObj.startOverIdx)}`}</span> {` - `}
                                                                <span id={idx}>{`${schedule.getTime(areaHook.areaObj.endOverIdx)}`}</span>
                                                            </div>
                                                        ) : (
                                                            ''
                                                        )} */}
                                                    </Area>
                                                    {itemHook.fixedItemGroupData.some(y => y.startIdx === idx) && (
                                                        <Item
                                                            type={'fixed'}
                                                            idx={idx}
                                                            itemHook={itemHook}
                                                            areaHook={areaHook}
                                                            areaSelectHook={areaSelectHook}
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
                                                                areaSelectHook={areaSelectHook}
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
                        {interfaceHook.auth === 'user' && (
                            <React.Fragment>
                                <tr style={{ height: '56px', borderTop: '1px solid #DDDDDD' }}>
                                    <td colSpan={7}>
                                        <span style={{ color: '#777777' }}>오전 1시 30분까지 선택 가능합니다.</span>
                                    </td>
                                </tr>
                            </React.Fragment>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default TableBody;
