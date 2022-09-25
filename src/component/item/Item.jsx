import React, { useState } from 'react';
import styled from 'styled-components';
import { lecture } from '../../util/lecture';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import _ from 'lodash';
import ItemMenu from '../contextMenu/ItemMenu';
import { styled as sstyled } from '../../style/stitches.config';

const Header = sstyled('div', {
    height: '30px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    paddingLeft: '10px',
    '& span': {
        position: 'relative',
        top: '5px',
    },
});
const Contents = sstyled('div', { margin: '0px 5px 5px 5px', background: '#fff', height: 'calc(100% - 35px)' });
const MainTitle = sstyled('div', {
    fontSize: '18px',
    fontWeight: 700,
    paddingLeft: '6px',
    paddingTop: '8px',
    color: '#333',
});
const SubTitle = sstyled('div', {
    fontSize: '15px',
    fontWeight: 500,
    paddingLeft: '6px',
    paddingTop: '3px',
});
const Time = sstyled('div', {
    color: '#999999',
    fontSize: '12px',
    fontWeight: 400,
    paddingLeft: '6px',
    paddingTop: '8px',
});

const Layout = styled.div`
    .lectureItem {
        cursor: pointer;
        width: calc(100%);
        position: absolute;
        top: 0px;
        // box-shadow: 2px 2px 3px grey;
        text-align: left;
    }
    .lectureItem:hover {
        -webkit-filter: brightness(110%);
    }
    // .lectureContents {
    //     width: 100%;
    //     border-radius: 0 5px 5px 0;
    //     padding: 8px 0 8px 0px;
    // }
    .lectureItem.fixed {
        // color: #122f50;
        // border: 1px solid #4f6fd2;
    }
    // .fixed .lectureBar {
    //     background: #4f6fd2;
    // }
    // .fixed .lectureContents {
    //     background: #f4f4f4;
    // }
    .lectureItem.matching {
        // color: #802b2c;
        // border: 1px solid #ff8a30;
    }
    // .matching .lectureBar {
    //     background: #ff8a30;
    // }
    // .matching .lectureContents {
    //     background: #fff9cf;
    // }
`;
function Item({ itemHook, interfaceHook, idx, type, areaHook }) {
    const itemData = type === 'fixed' ? itemHook.fixedItemData : itemHook.matchingItemData;
    const itemGroupData = type === 'fixed' ? itemHook.fixedItemGroupData : itemHook.matchingItemGroupData;
    const itemLectureName = lecture.getLectureNameByIdx(itemData, idx);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const id = lecture.getLectureId(itemData, idx);
    const colorIndex = interfaceHook.target === 'student' ? _.findIndex(interfaceHook?.userData?.lectureData, { lectureId: id }) : '_all';
    const handleClick = () => {
        setShowMenu(false);
    };

    const handleDragStart = () => {
        areaHook.setIsAreaClickDown(false);
        itemHook.setItemObj({
            idx: idx,
            type: type,
            lectureId: lecture.getLectureId(itemData, idx),
            time: lecture.getLectureRunningTime(itemGroupData, idx),
        });
    };
    const handleRightClick = e => {
        e.preventDefault();
        setShowMenu(true);
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };
    return (
        <Layout>
            <div
                className={`lectureItem ${type} hcolor${colorIndex}`}
                // draggable={true}
                // onDragStart={handleDragStart}
                // onDragOver={table.removeOver}
                onClick={handleClick}
                onContextMenu={handleRightClick}
                style={{
                    zIndex: 2,
                    height: `${itemGroupData.reduce((result, y) => {
                        idx == y.startIdx && result.push((y.endTimeIdx + 1 - y.startTimeIdx) * 28 + 'px');
                        return result;
                    }, [])}`,
                }}
            >
                <Header>
                    <span>{type === 'fixed' ? '수강중' : '가매칭중'}</span>
                </Header>
                <Contents>
                    <span>
                        {/* <b>{itemLectureName}</b> */}

                        {_.isNull(lecture.getMainSubject(id)) ? (
                            <MainTitle>{lecture.getLectureName(id)}</MainTitle>
                        ) : (
                            <React.Fragment>
                                <MainTitle>{lecture.getMainSubject(id)}</MainTitle>
                                <SubTitle>{lecture.getLectureName(id)}</SubTitle>
                            </React.Fragment>
                        )}
                    </span>
                    <Time>
                        <span>
                            {itemGroupData.map(y => {
                                return (
                                    idx == y.startIdx &&
                                    `${schedule.getTime(y.startTimeIdx)}
                            ~
                            ${schedule.getTime(y.endTimeIdx + 1)} `
                                );
                            })}
                        </span>
                    </Time>
                </Contents>
            </div>
            {interfaceHook.auth === 'admin' && showMenu && type === 'matching' && (
                <ItemMenu itemHook={itemHook} idx={idx} position={menuPosition} close={() => setShowMenu(false)} />
            )}
        </Layout>
    );
}

export default React.memo(Item);
