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
    const [isLongTouch, setIsLongTouch] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    const init = () => {
        areaSelectHook.setLecture([]); //좌클릭 드래그 영역
        areaSelectHook.setMatchingTarget([]); //가매칭 영역
        setShowLectureModal(false);
        setShowMatchingMenu(false);
        areaHook.setAreaObj({}); //가매칭 메뉴가 사라지지않아서 추가
    };

    const update = (type, items) => {
        const bindLecture = areaSelectHook.lecture.map(e => {
            return { ...e, lectureSubjectIds: items };
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
        !isTouch && areaEvent.clickOver(idx);
    };

    const handleAreaUp = e => {
        const openLectureModal = () => {
            setShowLectureModal(true);
        };
        const openMatchingModal = () => {
            setShowMatchingMenu(true);
        };
        areaEvent.clickUp(e, idx, openLectureModal, openMatchingModal);
    };

    const handleDragEnter = e => {
        init();
        areaEvent.itemDragStart(e, idx);
    };

    const handleItemDrop = e => {
        areaEvent.itemDragEnd(e, idx);
    };

    const [holdInterval, setHoldInterval] = useState();
    const [holdCount, setHoldCount] = useState();
    const [isHoldOver, setIsHoldOver] = useState(false);
    const handleTouchStart = e => {
        //touch 이벤트와 클릭이벤트의 중복으로 인하여, long check 키로 클릭이벤트를 발생시킬지 제어확인
        setIsTouch(true);
        init();
        // touch-action: none;
        let count = 0;
        const checkHold = setInterval(() => {
            setHoldCount(count);
            if (count++ === 100) {
                document.querySelector('.contents').classList.add('freeze');
                clearInterval(checkHold);
                setIsLongTouch(true);
                areaEvent.clickDown(e, idx);
            }
        }, 7);
        setHoldInterval(checkHold);
    };
    const handleTouchOver = e => {
        if (isLongTouch) {
            setIsHoldOver(true);
            var evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            var targetBox = document.elementFromPoint(touch.clientX, touch.clientY);
            const elementIdx = !_.isNull(targetBox) ? targetBox.getAttribute('id') : null;
            if (!_.isNull(elementIdx)) areaEvent.clickOver(elementIdx);
        }
    };
    const handleTouchEnd = e => {
        if (isLongTouch && isHoldOver) {
            //긴 터치이고 이후 터치오버액션시
            // if (isLongTouch) {
            var evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            var targetBox = document.elementFromPoint(touch.clientX, touch.clientY);
            const elementIdx = !_.isNull(targetBox) ? targetBox.getAttribute('id') : null;
            console.log(elementIdx);
            const openLectureModal = () => {
                setShowLectureModal(true);
            };
            const openMatchingModal = () => {
                setShowMatchingMenu(true);
            };
            if (!_.isNull(elementIdx)) areaEvent.clickUp(e, elementIdx, openLectureModal, openMatchingModal);
        }
        setIsTouch(false);
        setIsLongTouch(false);
        setIsHoldOver(false);
        setHoldCount(null);
        clearInterval(holdInterval);
        document.querySelector('.contents').classList.remove('freeze');
    };
    return (
        <React.Fragment>
            <div
                onMouseDown={handleAreaDown}
                onMouseOver={handleAreaOver}
                onMouseUp={handleAreaUp}
                onContextMenu={e => e.preventDefault()}
                onTouchStart={handleTouchStart}
                onTouchMoveCapture={handleTouchOver}
                onTouchEnd={handleTouchEnd}
                // onDrop={handleItemDrop}
                // onDragEnter={handleDragEnter}
                // onDragOver={e => e.preventDefault()}
                id={idx}
                className={
                    `item
                    ${/*areaHook.areaData.some(item => item.timeBlockId === idx) ? 'active' : ''*/ ''}
                    ${areaSelectHook.lecture.some(item => item.timeBlockId === idx) ? 'dragging' : ''}
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
                {holdCount && <HoldLoading value={holdCount} />}
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

export default React.memo(Area);
