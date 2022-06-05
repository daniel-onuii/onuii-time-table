import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setAreaGrabbedObj,
    setAreaMatchingObj,
    setAreaObj,
    setIsAreaAppend,
    setIsAreaClickDown,
    setItemObj,
} from '../../store/reducer/trigger.reducer';
import { setAreaData, setFixedItemData, setMatchingItemData } from '../../store/reducer/schedule.reducer';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import _ from 'lodash';
import SelectLecture from '../modal/SelectLecture';
import AreaMenu from '../contextMenu/AreaMenu';

function Area({
    children,
    idx,
    areaData,
    fixedItemData,
    matchingItemData,
    areaObj,
    itemObj,
    areaGrabbedObj,
    areaMatchingObj,
    isAreaClickDown,
    isAreaAppend,
    compareAreaData,
}) {
    const dispatch = useDispatch();

    const { selectMode } = useSelector(state => state.user);
    const [showLectureModal, setShowLectureModal] = useState(false); //과목정보 모달
    const [modalPosition, setModalPosition] = useState(null);
    const [areaContextPosition, setAreaContextPosition] = useState(null);
    const [showAreaContext, setShowAreaContext] = useState(false);

    const onHover = e => {
        const $this = e.currentTarget;
        $this.classList.add(`over`);
        $this.classList.add(`time${itemObj.time}`);
    };
    const offHover = e => {
        const $this = e.currentTarget;
        $this.classList.remove(`over`);
        $this.classList.remove(`time${itemObj.time}`);
    };

    const init = () => {
        dispatch(setAreaGrabbedObj([]));
        setShowLectureModal(false);
        setShowAreaContext(false);
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
        setShowAreaContext(false);
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
        //드래그 영역만큼 셋팅
        if (_.isEmpty(selectMode)) {
            if (_.isEmpty(areaGrabbedObj)) {
                //드래그를 하지않았다면 기본적으로 1시간값 셋팅,, 1:30분 넘어서 처리 해야함. ㅅ
                dispatch(setIsAreaClickDown(false));
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
                dispatch(setIsAreaClickDown(false));
                if (areaGrabbedObj.length > 0) {
                    setModalPosition({ x: e.clientX, y: e.clientY });
                    setShowLectureModal(true);
                }
            }
        } else {
            dispatch(setIsAreaClickDown(false));
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
        offHover(e);
        switch (itemObj.type) {
            case 'item':
                dropEvent(fixedItemData, setFixedItemData);
                break;
            case 'matching':
                dropEvent(matchingItemData, setMatchingItemData);
                break;
        }
        dispatch(setItemObj({}));
    };
    const handleAreaEnter = e => {
        onHover(e);
    };
    const handleAreaLeave = e => {
        offHover(e);
    };
    const handleAreaClick = e => {
        e.preventDefault();
        setShowAreaContext(true);
        setAreaContextPosition({ x: e.clientX, y: e.clientY });
    };
    return (
        <React.Fragment>
            <div
                onMouseDown={handleAreaDown}
                onMouseOver={handleAreaOver}
                onMouseUp={handleAreaUp}
                onDrop={handleItemDrop}
                onDragOver={e => e.preventDefault()}
                onDragEnter={handleAreaEnter}
                onDragLeave={handleAreaLeave}
                onContextMenu={handleAreaClick}
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
            {showAreaContext && areaObj.idx == idx && <AreaMenu idx={idx} position={areaContextPosition} close={() => setShowAreaContext(false)} />}
        </React.Fragment>
    );
}

export default React.memo(Area);
