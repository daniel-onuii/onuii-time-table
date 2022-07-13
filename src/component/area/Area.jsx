import React, { useState } from 'react';
import _ from 'lodash';
import SelectLecture from '../modal/SelectLecture';
import MatchingMenu from '../contextMenu/MatchingMenu';

function Area(props) {
    const { areaHook, itemHook, areaSelectHook, interfaceHook, children, idx, areaEvent } = props;
    const [showLectureModal, setShowLectureModal] = useState(false); //과목정보 모달
    const [modalPosition, setModalPosition] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMatchingMenu, setShowMatchingMenu] = useState(false);

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
    const handleAreaOver = () => {
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
        areaEvent.clickUp(e, idx, openLectureModal, openMatchingModal);
    };
    const handleDragEnter = e => {
        init();
        areaEvent.itemDragStart(e, idx);
    };
    const handleItemDrop = e => {
        areaEvent.itemDragEnd(e, idx);
    };
    return (
        <React.Fragment>
            <div
                onMouseDown={handleAreaDown}
                onMouseOver={handleAreaOver}
                onMouseUp={handleAreaUp}
                onContextMenu={e => e.preventDefault()}
                // onDrop={handleItemDrop}
                // onDragEnter={handleDragEnter}
                // onDragOver={e => e.preventDefault()}
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
