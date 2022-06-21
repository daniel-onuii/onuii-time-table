import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import SelectLecture from '../modal/SelectLecture';
import AreaMenu from '../contextMenu/AreaMenu';
import MatchingMenu from '../contextMenu/MatchingMenu';

function Area(props) {
    const { areaHook, itemHook, areaSelectHook, interfaceHook, children, idx } = props;
    const dispatch = useDispatch();
    const [showLectureModal, setShowLectureModal] = useState(false); //과목정보 모달
    const [modalPosition, setModalPosition] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showMatchingMenu, setShowMatchingMenu] = useState(false);

    const init = () => {
        areaSelectHook.setLecture([]); //좌클릭 드래그 영역
        areaSelectHook.setMatchingTarget([]); //가매칭 영역
        setShowLectureModal(false);
        setShowMenu(false);
        setShowMatchingMenu(false);
    };

    const update = (type, items) => {
        const bindLecture = areaSelectHook.lecture.map(e => {
            return { ...e, areaActiveType: items };
        });
        if (type === 'overlap') {
            //덮어쓰기
            const newAreaData = areaHook.areaData.reduce((result, e) => {
                !bindLecture.some(item => item.block_group_No === e.block_group_No) && result.push(e);
                return result;
            }, []);
            areaHook.setAreaData([...newAreaData, ...bindLecture]);
        } else if (type === 'add') {
            //추가하기
            const newAreaData = areaHook.areaData.reduce((result, e) => {
                const target = _.find(bindLecture, { block_group_No: e.block_group_No });
                const beforLecture = e.areaActiveType ? e.areaActiveType : [];
                const addData = _.uniq([...beforLecture, ...items]);
                target ? result.push({ ...target, areaActiveType: addData }) : result.push(e);
                return result;
            }, []);
            areaHook.setAreaData([...newAreaData, ..._.differenceBy(bindLecture, areaHook.areaData, 'block_group_No')]);
        } else if (type === 'pop') {
            //빼기
            const newAreaData = areaHook.areaData.reduce((result, e) => {
                const target = _.find(bindLecture, { block_group_No: e.block_group_No });
                const beforLecture = e.areaActiveType ? e.areaActiveType : [];
                const popData = _.without(beforLecture, ...items);
                target ? !_.isEmpty(popData) && result.push({ ...target, areaActiveType: popData }) : result.push(e);
                return result;
            }, []);
            areaHook.setAreaData(newAreaData);
        }
        init();
    };
    const remove = () => {
        const removeResult = _.reject(areaHook.areaData, o => {
            return areaSelectHook.lecture.some(item => item.block_group_No === o.block_group_No);
        });
        areaHook.setAreaData(removeResult);
        init();
    };
    const cancel = () => {
        init();
    };
    const handleAreaDown = e => {
        setShowMenu(false);
        setShowMatchingMenu(false);
        areaSelectHook.setMatchingTarget([]); //가매칭 영역
        areaHook.setAreaObj({
            idx: idx,
            startOverIdx: schedule.getTimeIdx(idx),
            endOverIdx: schedule.getTimeIdx(idx + 1),
            startOverDayIdx: schedule.getWeekIdx(idx),
            endOverDayIdx: schedule.getWeekIdx(idx),
        });
        if (e.buttons !== 1) return false; //좌클릭 이외는 전부 false
        if (interfaceHook.auth === 'admin' && interfaceHook.target === 'teacher') return false; //관리자 + 선생은 가매칭 추가만 가능
        areaHook.setIsAreaClickDown(true); //클릭 상태
        const isFill = table.isFillArea(areaSelectHook.filter, idx); //가매칭모드때 사용
        areaHook.setIsAreaAppend(isFill); //대상이 빈칸인지
    };

    const handleAreaOver = () => {
        if (areaHook.isAreaClickDown) {
            const startOverIdx = areaHook.areaObj.idx;
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
                    _.range(e * 96 + 32 + startRange, e * 96 + 32 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                        return { block_group_No: ee };
                    }),
                );
                return result;
            }, []);
            areaSelectHook.setLecture(_.flatten(selectedInfo));

            areaHook.setAreaObj({
                ...areaHook.areaObj,
                startOverIdx: startRange < endRange ? startRange : endRange,
                endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
                startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
                endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
            });
        }
    };
    const handleAreaUp = e => {
        ////////////여기 리팩토링해주세요
        if (e.button !== 0) {
            //좌클릭일때만
            return false;
        }
        areaHook.setIsAreaClickDown(false); //클릭 상태
        // if (_.isEmpty(interfaceHook?.selectMode) && interfaceHook.auth === 'user') {
        if (interfaceHook.auth === 'user') {
            //과목 추가는 유저 모드에서만 가능(어드민도 과목 추가 화면은 유저기능으로)
            //일반 과목 선택 모드
            if (_.isEmpty(areaSelectHook.lecture)) {
                //셀 클릭시
                setModalPosition({ x: e.clientX, y: e.clientY });
                areaHook.setAreaObj({
                    idx: idx,
                    startOverIdx: schedule.getTimeIdx(idx),
                    endOverIdx: schedule.getTimeIdx(idx + 4),
                    startOverDayIdx: schedule.getWeekIdx(idx),
                    endOverDayIdx: schedule.getWeekIdx(idx),
                }),
                    areaSelectHook.setLecture(
                        _.range(idx, idx + 4).map(e => {
                            return { block_group_No: e };
                        }),
                    ),
                    setShowLectureModal(true);
            } else {
                //셀 드래그 앤 드롭
                if (areaSelectHook.lecture.length > 0) {
                    setModalPosition({ x: e.clientX, y: e.clientY });
                    setShowLectureModal(true);
                }
            }
        } else {
            //admin
            if (_.isEmpty(areaSelectHook.lecture)) {
                //셀 클릭시c
                if (interfaceHook.target === 'teacher' && !_.isNull(interfaceHook.lvt)) {
                    const tempMatching = _.range(idx, idx + 6).map(e => {
                        return { block_group_No: e };
                    });
                    areaSelectHook.setMatchingTarget(tempMatching);
                    setShowMatchingMenu(true);
                    setMenuPosition({ x: e.clientX, y: e.clientY });
                }

                // 정규 , 다른가매칭 시간 예외처리 후 post message to admin.
            } else {
                //셀 드래그 앤 드롭
                if (interfaceHook.target === 'student') {
                    areaSelectHook.setLecture([]);
                    if (!areaHook.isAreaAppend) {
                        areaSelectHook.setFilter([...areaSelectHook.filter, ...areaSelectHook.lecture]);
                    } else {
                        const removeResult = _.reject(areaSelectHook.filter, o => {
                            return areaSelectHook.lecture.some(item => item.block_group_No === o.block_group_No);
                        });
                        areaSelectHook.setFilter(removeResult);
                    }
                }
            }
        }
    };

    const dropEvent = (data, setData) => {
        const endTime = idx + itemHook.itemObj.time - 1;
        if (!schedule.checkValidSchedule(endTime, idx, data, itemHook.itemObj.lectureId, dispatch)) {
            return false;
        }
        if (idx != 0) {
            const removedLecture = _.reject(
                [...data],
                o =>
                    (o.block_group_No >= itemHook.itemObj.idx && o.block_group_No < itemHook.itemObj.idx + itemHook.itemObj.time) ||
                    (o.block_group_No >= idx && o.block_group_No < idx + itemHook.itemObj.time),
            );
            const addLecture = _.range(idx, idx + itemHook.itemObj.time).reduce((result, e) => {
                result.push({ block_group_No: e, lecture_subject_Id: itemHook.itemObj.lectureId });
                return result;
            }, []);
            setData([...removedLecture, ...addLecture]);
        }
    };
    const handleItemDrop = e => {
        e.preventDefault();
        table.removeOver();
        switch (itemHook.itemObj.type) {
            case 'fixed':
                dropEvent(itemHook.fixedItemData, itemHook.setFixedItemData);
                break;
            case 'matching':
                dropEvent(itemHook.matchingItemData, itemHook.setMatchingItemData);
                break;
        }
        itemHook.setItemObj({});
    };
    const handleDragEnter = e => {
        table.removeOver();
        const $this = e.currentTarget;
        const weekIdx = schedule.getWeekIdx(idx);
        const $tr = e.currentTarget.parentNode.parentNode;
        $this.classList.add(`over`);
        const arrTr = [];
        for (var i = 0; i < itemHook.itemObj.time - 1; i++) {
            _.isEmpty(arrTr) ? arrTr.push($tr.nextSibling) : arrTr.push(arrTr[i - 1]?.nextSibling);
        }
        arrTr.map(ee => {
            ee && ee.childNodes[ee.childNodes.length === 8 ? weekIdx + 1 : weekIdx].childNodes[0].classList.add(`over`);
        });
    };
    const handleAreaRightClick = e => {
        e.preventDefault();
        //     const isEmpty = _.isEmpty(_.find(matchingItemData, { block_group_No: idx }));
        //     if (isEmpty) {
        //         setShowMenu(true);
        //         setMenuPosition({ x: e.clientX, y: e.clientY });
        //     } else {
        //         dispatch(setMessage('해당 범위에 가매칭 과목이있음'));
        //     }
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
                className={
                    `item
                    ${areaHook.areaData.some(item => item.block_group_No === idx) ? 'active' : ''}
                    ${areaSelectHook.lecture.some(item => item.block_group_No === idx) ? 'dragging' : ''}
                    ${areaSelectHook.filter.some(item => item.block_group_No === idx) ? 'matching' : ''}
                    ${areaSelectHook.matchingTarget.some(item => item.block_group_No === idx) ? 'tempMatching' : ''}
                    ${
                        _.intersectionBy(interfaceHook.teacherData?.areaData, areaSelectHook.filter, 'block_group_No').some(
                            item => item.block_group_No === idx,
                        )
                            ? 'equal'
                            : ''
                    }
                    
                ` //클래스명 바꾸고싶다
                }
            >
                {children}
            </div>
            {showLectureModal && (
                <SelectLecture
                    position={modalPosition}
                    handleConfirm={update}
                    handleRemove={remove}
                    handleCancel={cancel}
                    areaObj={areaHook.areaObj}
                    interfaceHook={interfaceHook}
                />
            )}
            {interfaceHook.auth === 'admin' && showMatchingMenu && areaHook.areaObj.idx == idx && (
                <MatchingMenu
                    idx={idx}
                    time={6}
                    weekcount={4}
                    position={menuPosition}
                    close={init}
                    interfaceHook={interfaceHook}
                    itemHook={itemHook}
                />
            )}
            {/* {auth === 'admin' && showMenu && areaObj.idx == idx && <AreaMenu idx={idx} position={menuPosition} close={() => setShowMenu(false)} />} */}
        </React.Fragment>
    );
}

export default React.memo(Area);
