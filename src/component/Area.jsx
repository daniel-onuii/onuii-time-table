import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAreaGrabbedObj, setAreaObj, setIsAreaAppend, setIsAreaClickDown, setItemObj } from '../store/reducer/trigger.reducer';
import { setAreaData, setItemData, setMatchingItemData } from '../store/reducer/schedule.reducer';
import { schedule } from '../util/schedule';
import { table } from '../util/table';
import _ from 'lodash';
import SelectLecture from './modal/SelectLecture';
import { lecture } from '../util/lecture';
import AreaMenu from './contextMenu/AreaMenu';

function Area({ children, idx, areaData, itemData, matchingItemData, areaObj, itemObj, areaGrabbedObj, isAreaClickDown }) {
    const dispatch = useDispatch();
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

    const handleAreaDown = () => {
        setShowAreaContext(false);
        const isFill = table.isFillArea(areaData, idx);
        dispatch(setIsAreaClickDown(true)); //클릭 상태
        dispatch(setIsAreaAppend(isFill)); //대상이 빈칸인지
        dispatch(
            setAreaObj({
                idx: idx,
                startOverIdx: schedule.getTimeIdx(idx),
                endOverIdx: schedule.getTimeIdx(idx + 1),
                startOverDayIdx: schedule.getWeekIdx(idx),
                endOverDayIdx: schedule.getWeekIdx(idx),
            }),
        );
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
        dispatch(setIsAreaClickDown(false));
        if (areaGrabbedObj.length > 0) {
            setModalPosition({ x: e.clientX, y: e.clientY });
            setShowLectureModal(true);
        }
    };

    const dropEvent = (data, setData) => {
        const itemIdx = itemObj.idx;
        const itemLectureId = itemObj.lectureId;
        const time = itemObj.time;
        const endTime = idx + time - 1;
        if (!schedule.checkValidSchedule(endTime, idx, data, itemLectureId, dispatch)) {
            return false;
        }
        if (idx != 0) {
            const removedLecture = _.reject([...data], function (o) {
                //이전 과목 시간은 삭제
                return (
                    (o.block_group_No >= itemIdx && o.block_group_No < itemIdx + time) || (o.block_group_No >= idx && o.block_group_No < idx + time)
                );
            });
            const addLecture = _.range(idx, idx + time).reduce((result, e) => {
                //드롭된 위치에 새롭게 생성
                result.push({ block_group_No: e, lecture_subject_Id: itemLectureId });
                return result;
            }, []);
            dispatch(setData([...removedLecture, ...addLecture]));
        }
    };

    const handleItemDrop = e => {
        e.preventDefault();
        offHover(e);
        dispatch(setItemObj({}));
        if (itemObj.type === 'item') {
            dropEvent(itemData, setItemData);
        }
        if (itemObj.type === 'matching') {
            dropEvent(matchingItemData, setMatchingItemData);
        }
    };
    const handleItemDragOver = e => {
        e.preventDefault();
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
                onDragOver={handleItemDragOver}
                onDragEnter={handleAreaEnter}
                onDragLeave={handleAreaLeave}
                onContextMenu={handleAreaClick}
                className={`item 
                    ${areaData.some(item => item.block_group_No === idx) ? 'active' : ''}
                    ${areaGrabbedObj.some(item => item.block_group_No === idx) ? 'dragging' : ''}
                `}
            >
                {_.find(areaData, { block_group_No: idx })?.areaActiveType?.map((e, i) => {
                    return (
                        <span key={i} className={`lecture_${e} ignoreEnter`}>
                            {e === 'all' ? '상관없음' : lecture.getLectureName(e).slice(0, 1)}
                        </span>
                    );
                })}
                {children}
            </div>
            {showLectureModal && <SelectLecture position={modalPosition} handleConfirm={update} handleRemove={remove} handleCancel={cancel} />}
            {showAreaContext && areaObj.idx == idx && <AreaMenu idx={idx} position={areaContextPosition} close={() => setShowAreaContext(false)} />}
        </React.Fragment>
    );
}

export default React.memo(Area);
