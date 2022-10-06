import React, { useState } from 'react';
import _ from 'lodash';
import SelectLecture from '../modal/SelectLecture';
import MatchingMenu from '../contextMenu/MatchingMenu';
import styled from 'styled-components';
const HoldLoading = styled.div`
    position: absolute;
    width: 20px;
    height: 20px;
    background-image: conic-gradient(orange ${props => props.value}%, white 0%);
    border-radius: 50%;
    z-index: 1;
`;
function Area(props) {
    const { areaHook, itemHook, areaSelectHook, interfaceHook, children, idx, areaEvent } = props;
    const [showLectureModal, setShowLectureModal] = useState(false); //과목정보 모달
    const [modalPosition, setModalPosition] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMatchingMenu, setShowMatchingMenu] = useState(false);

    const init = () => {
        areaEvent.clearCell();
        areaSelectHook.setLecture([]); //좌클릭 드래그 영역
        areaSelectHook.setMatchingTarget([]); //가매칭 영역
        setShowLectureModal(false);
        setShowMatchingMenu(false);
        areaHook.setAreaObj({}); //가매칭 메뉴가 사라지지않아서 추가
    };

    const update = (type, items) => {
        const bindLecture = areaSelectHook.lecture.map(e => {
            return { ...e, lectureSubjectId: items };
        });
        if (type === 'overlap') {
            areaEvent.overlap(bindLecture); //덮어쓰기
        } else if (type === 'add') {
            areaEvent.add(bindLecture, items); //추가하기
        } else if (type === 'pop') {
            areaEvent.pop(bindLecture, items); //빼기
        }
        init();
    };
    const remove = () => {
        areaEvent.removeAll();
        init();
    };
    const cancel = () => {
        init();
    };

    const handleAreaDown = e => {
        init();
        areaEvent.clickDown(e, idx);
    };

    const handleAreaOver = e => {
        //터치 이벤트와 클릭이벤트가 동시에 돌면서 idx 충돌하는 부분이있어서 동작 제어
        // areaHook.isAreaClickDown && areaHook.setIdxOnOver(idx);
        // if (_.isNull(areaHook.touchIdx) && idx != areaHook.idxOnOver) areaEvent.clickOver(idx);
        areaEvent.clickOver(idx);
    };

    const handleAreaUp = e => {
        const openLectureModal = () => {
            setModalPosition({ x: e.clientX, y: e.clientY });
            setShowLectureModal(true);
        };
        const openMatchingModal = () => {
            setMenuPosition({ x: e.clientX, y: e.clientY });
            setShowMatchingMenu(true);
        };
        // areaEvent.clickUp(e, idx, openLectureModal, openMatchingModal, update);
        areaEvent.clickUp(e, idx, openMatchingModal);
    };

    const handleDragEnter = e => {
        init();
        areaEvent.itemDragStart(e, idx);
    };

    const handleItemDrop = e => {
        areaEvent.itemDragEnd(e, idx);
    };

    const handleTouchStart = e => {
        areaHook.setTouchIdx(idx);
        //touch 이벤트와 클릭이벤트의 중복으로 인하여, long check 키로 클릭이벤트를 발생시킬지 제어확인
        // areaHook.setIsTouch(true);
        init();
        // touch-action: none;
        let count = 0;
        const checkHold = setInterval(() => {
            count += 5;
            areaHook.setHoldCount(count);
            if (count === 100) {
                document.querySelector('.contents').classList.add('freeze');
                document.querySelector('body').classList.add('freeze');
                clearInterval(checkHold);
                areaHook.setIsLongTouch(true);
                areaEvent.clickDown(e, idx);
            }
        }, 10);
        areaHook.setHoldInterval(checkHold);
    };
    const handleTouchOver = e => {
        if (areaHook.isLongTouch) {
            areaHook.setIsHoldOver(true);
            var evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            var targetBox = document.elementFromPoint(touch.clientX, touch.clientY);
            const elementIdx = !_.isNull(targetBox) ? targetBox.getAttribute('id') : null;
            areaHook.setIdxOnOver(elementIdx);
            if (!_.isNull(elementIdx) && elementIdx != areaHook.idxOnOver) areaEvent.clickOver(elementIdx); //throttle을 걸면 동작이 부자연스러워서, 중복 이벤트만 피하게
        }
    };
    const handleTouchEnd = e => {
        if (areaHook.isLongTouch && areaHook.isHoldOver) {
            //긴 터치이고 이후 터치오버액션시
            // if (areaHook.isLongTouch) {
            var evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            var targetBox = document.elementFromPoint(touch.clientX, touch.clientY);
            const elementIdx = !_.isNull(targetBox) ? targetBox.getAttribute('id') : null;
            // console.log(elementIdx);
            const openLectureModal = () => {
                setShowLectureModal(true);
            };
            const openMatchingModal = () => {
                setShowMatchingMenu(true);
            };
            if (!_.isNull(elementIdx)) areaEvent.clickUp(e, elementIdx, openLectureModal, openMatchingModal);
        }
        areaHook.setTouchIdx(null);
        areaHook.setIsLongTouch(false);
        areaHook.setIsHoldOver(false);
        areaHook.setHoldCount(null);
        clearInterval(areaHook.holdInterval);
        document.querySelector('.contents').classList.remove('freeze');
        document.querySelector('body').classList.add('freeze');
    };
    return (
        <React.Fragment>
            <div
                onMouseDown={handleAreaDown}
                onMouseOver={handleAreaOver}
                onMouseUp={handleAreaUp}
                onContextMenu={e => e.preventDefault()}
                // onTouchStart={handleTouchStart}
                // onTouchMoveCapture={handleTouchOver}
                // onTouchEnd={handleTouchEnd}
                // onDrop={handleItemDrop}
                // onDragEnter={handleDragEnter}
                // onDragOver={e => e.preventDefault()}
                id={idx}
                className={
                    `item
                    seq_${idx}
                    ${/*areaSelectHook.lecture.some(item => item.timeBlockId === idx) ? 'dragging' : ''*/ ''}
                    ${areaSelectHook.filter.some(item => item.timeBlockId === idx) ? 'filter' : ''}
                    ${areaSelectHook.matchingTarget.some(item => item.timeBlockId === idx) ? 'tempMatching' : ''}
                    ${
                        _.intersectionBy(areaHook.areaData, interfaceHook.filterData, 'timeBlockId').some(item => item.timeBlockId === idx)
                            ? 'equal'
                            : ''
                    }
                ` //클래스명 바꾸고싶다
                }
            >
                {areaHook.holdCount && areaHook.touchIdx === idx && <HoldLoading value={areaHook.holdCount} />}
                {/* {areaHook.holdCount && areaHook.touchIdx === idx && <span style={{ color: 'red' }}>{areaHook.holdCount}</span>} */}
                {children}
            </div>
            {showLectureModal && (
                <SelectLecture
                    position={modalPosition}
                    handleConfirm={update}
                    handleRemove={remove}
                    handleCancel={cancel}
                    areaObj={areaHook.areaObj}
                    areaHook={areaHook}
                    interfaceHook={interfaceHook}
                />
            )}
            {interfaceHook.auth === 'admin' && showMatchingMenu && areaHook.areaObj.idx == idx && (
                <MatchingMenu idx={idx} position={menuPosition} close={init} interfaceHook={interfaceHook} itemHook={itemHook} />
            )}
        </React.Fragment>
    );
}

export default Area;
