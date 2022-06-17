import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { lecture } from '../../util/lecture';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import _ from 'lodash';
import ItemMenu from '../contextMenu/ItemMenu';
const Layout = styled.div`
    @media (min-width: 376px) {
    }
    @media (max-width: 375px) {
        .lectureItem {
            font-size: 10px;
        }
    }
    .lectureItem {
        display: flex;
        cursor: pointer;
        width: 85%;
        position: absolute;
        top: 0px;
        border-radius: 5px;
        color: black;
        box-shadow: 2px 2px 3px grey;
    }
    .lectureItem:hover {
        -webkit-filter: brightness(110%);
    }
    .lectureItem.fixed {
        border: 1px solid #6495ed;
    }
    .lectureItem.matching {
        border: 1px solid #ec7063;
    }
    .lectureBar {
        height: 100%;
        width: 7px;
    }
    .fixed .lectureBar {
        background: #6495ed;
    }
    .matching .lectureBar {
        background: #ec7063;
    }
    .lectureContents {
        width: 100%;
        border-radius: 0 5px 5px 0;
        padding: 8px 0 8px 0px;
    }
    .fixed .lectureContents {
        background: #6495ed;
        -webkit-filter: brightness(215%);
    }
    .matching .lectureContents {
        background: #ec7063;
        -webkit-filter: brightness(215%);
    }
`;
function Item({
    auth,
    idx,
    type,
    itemData,
    itemGroupData,
    setItemObj,
    setIsAreaClickDown,
    setMatchingItemData,
    matchingItemData,
    matchingItemGroupData,
}) {
    const itemLectureName = lecture.getLectureNameByIdx(itemData, idx);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const handleClick = () => {
        setShowMenu(false);
    };
    const handleDragStart = () => {
        setIsAreaClickDown(false);

        setItemObj({
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
                className={`lectureItem ${type}`}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={table.removeOver}
                onClick={handleClick}
                onContextMenu={handleRightClick}
                style={{
                    zIndex: 2,
                    height: `${itemGroupData.reduce((result, y) => {
                        idx == y.startIdx && result.push((y.endTimeIdx + 1 - y.startTimeIdx) * 21 + 'px');
                        return result;
                    }, [])}`,
                }}
            >
                <div className={`lectureBar`}></div>
                <div className={`lectureContents`}>
                    <span>{type === 'fixed' ? '정규수업' : '가매칭수업'}</span>
                    <br />
                    <span>
                        <b>{itemLectureName}</b>
                    </span>
                    <br />
                    <span>
                        {itemGroupData.map(y => {
                            return idx == y.startIdx && `${schedule.getTime(y.startTimeIdx)}~${schedule.getTime(y.endTimeIdx + 1)} `;
                        })}
                    </span>
                </div>
            </div>
            {auth === 'admin' && showMenu && (
                <ItemMenu
                    setMatchingItemData={setMatchingItemData}
                    matchingItemData={matchingItemData}
                    matchingItemGroupData={matchingItemGroupData}
                    idx={idx}
                    type={type}
                    position={menuPosition}
                    close={() => setShowMenu(false)}
                />
            )}
        </Layout>
    );
}

export default React.memo(Item);
