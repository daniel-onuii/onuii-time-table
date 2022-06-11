import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
    setAreaGrabbedObj,
    setAreaMatchingObj,
    setAreaObj,
    setIsAreaAppend,
    setIsAreaClickDown,
    setItemObj,
    setMessage,
} from '../../store/reducer/trigger.reducer';
import { setAreaData, setFixedItemData, setMatchingItemData } from '../../store/reducer/schedule.reducer';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import SelectLecture from '../modal/SelectLecture';
import AreaMenu from '../contextMenu/AreaMenu';

function Area({ children, idx, compareAreaData }) {
    const dispatch = useDispatch();
    const { areaData, fixedItemData, matchingItemData } = useSelector(state => state.schedule);
    const { areaGrabbedObj, areaMatchingObj, itemObj, areaObj, isAreaClickDown, isAreaAppend } = useSelector(state => state.trigger);
    const { selectMode, auth } = useSelector(state => state.user);
    const [showLectureModal, setShowLectureModal] = useState(false); //과목정보 모달
    const [modalPosition, setModalPosition] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const init = () => {
        dispatch(setAreaGrabbedObj([]));
        setShowLectureModal(false);
        setShowMenu(false);
    };

    const update = (type, items) => {
        const bindLecture = areaGrabbedObj.map(e => {
            return { ...e, areaActiveType: items };
        });
        if (type === 'overlap') {
            //덮어쓰기
            const newAreaData = areaData.reduce((result, e) => {
                !bindLecture.some(item => item.block_group_No === e.block_group_No) && result.push(e);
                return result;
            }, []);
            dispatch(setAreaData([...newAreaData, ...bindLecture]));
        } else if (type === 'add') {
            //추가하기
            const newAreaData = areaData.reduce((result, e) => {
                const target = _.find(bindLecture, { block_group_No: e.block_group_No });
                const beforLecture = e.areaActiveType ? e.areaActiveType : [];
                const addData = _.uniq([...beforLecture, ...items]);
                // const addData = _.isEmpty(beforLecture) ? items : _.without(_.uniq([...beforLecture, ...items]), 'all');
                target ? result.push({ ...target, areaActiveType: addData }) : result.push(e);
                return result;
            }, []);
            dispatch(setAreaData([...newAreaData, ...bindLecture]));
        } else if (type === 'pop') {
            //빼기
            const newAreaData = areaData.reduce((result, e) => {
                const target = _.find(bindLecture, { block_group_No: e.block_group_No });
                const beforLecture = e.areaActiveType ? e.areaActiveType : [];
                const popData = _.without(beforLecture, ...items);
                target ? !_.isEmpty(popData) && result.push({ ...target, areaActiveType: popData }) : result.push(e);
                // target ? result.push({ ...target, areaActiveType: _.isEmpty(popData) ? ['all'] : popData }) : result.push(e);
                return result;
            }, []);
            dispatch(setAreaData(newAreaData));
        }
        init();
    };
    const remove = () => {
        const removeResult = _.reject(areaData, o => {
            return areaGrabbedObj.some(item => item.block_group_No === o.block_group_No);
        });
        dispatch(setAreaData(removeResult));
        init();
    };
    const cancel = () => {
        init();
    };
    const handleAreaDown = e => {
        setShowMenu(false);
        dispatch(
            setAreaObj({
                idx: idx,
                startOverIdx: schedule.getTimeIdx(idx),
                endOverIdx: schedule.getTimeIdx(idx + 1),
                startOverDayIdx: schedule.getWeekIdx(idx),
                endOverDayIdx: schedule.getWeekIdx(idx),
            }),
        );
        if (e.buttons !== 1) return false; //좌클릭 이외는 전부 false
        dispatch(setIsAreaClickDown(true)); //클릭 상태
        const isFill = table.isFillArea(areaMatchingObj, idx); //가매칭모드때 사용
        dispatch(setIsAreaAppend(isFill)); //대상이 빈칸인지
    };

    const handleAreaOver = () => {
        if (isAreaClickDown) {
            const startOverIdx = areaObj.idx;
            const endOverIdx = idx;
            const startOverDayIdx = schedule.getWeekIdx(startOverIdx);
            const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
            const startRange = schedule.getTimeIdx(startOverIdx);
            const endRange = schedule.getTimeIdx(endOverIdx);
            const intervalDay = _.range(
                startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1,
            );
            const selectedInfo = intervalDay.reduce((result, e) => {
                result.push(
                    _.range(e * 96 + 36 + startRange, e * 96 + 36 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                        // return { block_group_No: ee, areaActiveType: areaActiveType };
                        return { block_group_No: ee };
                    }),
                );
                return result;
            }, []);
            dispatch(setAreaGrabbedObj(_.flatten(selectedInfo)));
            dispatch(
                setAreaObj({
                    ...areaObj,
                    startOverIdx: startRange < endRange ? startRange : endRange,
                    endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
                    startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                    endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                }),
            );
        }
    };
    const handleAreaUp = e => {
        if (e.button !== 0) {
            //좌클릭일때만
            return false;
        }
        dispatch(setIsAreaClickDown(false)); //클릭 상태
        if (_.isEmpty(selectMode)) {
            //일반 과목 선택 모드
            if (_.isEmpty(areaGrabbedObj)) {
                //셀 클릭시
                setModalPosition({ x: e.clientX, y: e.clientY });
                dispatch(
                    setAreaObj({
                        idx: idx,
                        startOverIdx: schedule.getTimeIdx(idx),
                        endOverIdx: schedule.getTimeIdx(idx + 4),
                        startOverDayIdx: schedule.getWeekIdx(idx),
                        endOverDayIdx: schedule.getWeekIdx(idx),
                    }),
                );
                dispatch(
                    setAreaGrabbedObj(
                        _.range(idx, idx + 4).map(e => {
                            return { block_group_No: e };
                        }),
                    ),
                );
                setShowLectureModal(true);
            } else {
                //셀 드래그 앤 드롭
                if (areaGrabbedObj.length > 0) {
                    setModalPosition({ x: e.clientX, y: e.clientY });
                    setShowLectureModal(true);
                }
            }
        } else {
            //가매칭 모드
            if (_.isEmpty(areaGrabbedObj)) {
                //셀 클릭시
                // 가매칭 범위를 위한 상태값이 필요함.
                // console.log(selectMode);
                const tempMatching = _.range(idx, idx + 6).map(e => {
                    return { block_group_No: e };
                });
                // dispatch(setAreaGrabbedObj(tempMatching));
            } else {
                //셀 드래그 앤 드롭
                dispatch(setAreaGrabbedObj([]));
                if (!isAreaAppend) {
                    dispatch(setAreaMatchingObj([...areaMatchingObj, ...areaGrabbedObj]));
                } else {
                    const removeResult = _.reject(areaMatchingObj, o => {
                        return areaGrabbedObj.some(item => item.block_group_No === o.block_group_No);
                    });
                    dispatch(setAreaMatchingObj(removeResult));
                }
            }
        }
    };

    const dropEvent = (data, setData) => {
        const endTime = idx + itemObj.time - 1;
        if (!schedule.checkValidSchedule(endTime, idx, data, itemObj.lectureId, dispatch)) {
            return false;
        }
        if (idx != 0) {
            const removedLecture = _.reject(
                [...data],
                o =>
                    (o.block_group_No >= itemObj.idx && o.block_group_No < itemObj.idx + itemObj.time) ||
                    (o.block_group_No >= idx && o.block_group_No < idx + itemObj.time),
            );
            const addLecture = _.range(idx, idx + itemObj.time).reduce((result, e) => {
                result.push({ block_group_No: e, lecture_subject_Id: itemObj.lectureId });
                return result;
            }, []);
            dispatch(setData([...removedLecture, ...addLecture]));
        }
    };
    const handleItemDrop = e => {
        e.preventDefault();
        table.removeOver();
        switch (itemObj.type) {
            case 'fixed':
                dropEvent(fixedItemData, setFixedItemData);
                break;
            case 'matching':
                dropEvent(matchingItemData, setMatchingItemData);
                break;
        }
        dispatch(setItemObj({}));
    };
    const handleDragEnter = e => {
        table.removeOver();
        const $this = e.currentTarget;
        const weekIdx = schedule.getWeekIdx(idx);
        const $tr = e.currentTarget.parentNode.parentNode;
        $this.classList.add(`over`);
        const arrTr = [];
        for (var i = 0; i < itemObj.time - 1; i++) {
            _.isEmpty(arrTr) ? arrTr.push($tr.nextSibling) : arrTr.push(arrTr[i - 1]?.nextSibling);
        }
        arrTr.map(ee => {
            ee && ee.childNodes[ee.childNodes.length === 8 ? weekIdx + 1 : weekIdx].childNodes[0].classList.add(`over`);
        });
    };
    const handleAreaRightClick = e => {
        e.preventDefault();
        const isEmpty = _.isEmpty(_.find(matchingItemData, { block_group_No: idx }));
        if (isEmpty) {
            setShowMenu(true);
            setMenuPosition({ x: e.clientX, y: e.clientY });
        } else {
            dispatch(setMessage('해당 범위에 가매칭 과목이있음'));
        }
    };
    return (
        <React.Fragment>
            <div
                onMouseDown={handleAreaDown}
                onMouseOver={handleAreaOver}
                onMouseUp={handleAreaUp}
                onDrop={handleItemDrop}
                onDragOver={e => e.preventDefault()}
                onDragEnter={handleDragEnter}
                onContextMenu={handleAreaRightClick}
                className={`item 
                    ${areaData.some(item => item.block_group_No === idx) ? 'active' : ''}
                    ${areaGrabbedObj.some(item => item.block_group_No === idx) ? 'dragging' : ''}
                    ${areaMatchingObj.some(item => item.block_group_No === idx) ? 'matching' : ''}
                    ${_.find(compareAreaData, { block_group_No: idx }) ? 'equal' : ''}
                `}
            >
                {children}
            </div>
            {showLectureModal && <SelectLecture position={modalPosition} handleConfirm={update} handleRemove={remove} handleCancel={cancel} />}
            {auth === 'admin' && showMenu && areaObj.idx == idx && <AreaMenu idx={idx} position={menuPosition} close={() => setShowMenu(false)} />}
        </React.Fragment>
    );
}

export default React.memo(Area);
