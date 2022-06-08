import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setItemObj, setIsAreaClickDown } from '../../store/reducer/trigger.reducer';
import { lecture } from '../../util/lecture';
import { schedule } from '../../util/schedule';
import { table } from '../../util/table';
import _ from 'lodash';
import ItemMenu from '../contextMenu/ItemMenu';
const Layout = styled.div`
    .lectureItem {
        cursor: pointer;
        width: 85%;
        height: 100%;
        position: absolute;
        top: 0px;
        color: white;
        border-radius: 5px;
        padding-top: 4px;
    }
    .lectureItem:hover {
        -webkit-filter: brightness(110%);
    }
    .lectureItem.fixed {
        background: #6495ed;
    }
    .lectureItem.matching {
        background: #ec7063;
    }
`;
function Item({ idx, type, itemData, itemGroupData }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state.user);
    // const { matchingItemData, matchingItemGroupData } = useSelector(state => state.schedule);
    const { itemObj } = useSelector(state => state.trigger);
    const itemLectureName = lecture.getLectureNameByIdx(itemData, idx);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const handleClick = () => {
        setShowMenu(false);
        // dispatch(
        //     setItemObj({
        //         idx: idx,
        //         type: type,
        //         lectureId: lecture.getLectureId(itemData, idx),
        //         time: lecture.getLectureRunningTime(itemGroupData, idx),
        //         isShow: itemObj.isShow ? false : true,
        //     }),
        // );
    };
    const handleDragStart = () => {
        dispatch(setIsAreaClickDown(false));
        dispatch(
            setItemObj({
                idx: idx,
                type: type,
                lectureId: lecture.getLectureId(itemData, idx),
                time: lecture.getLectureRunningTime(itemGroupData, idx),
            }),
        );
    };
    const handleRightClick = e => {
        e.preventDefault();
        // const isEmpty = _.isEmpty(_.find(itemData, { block_group_No: idx }));
        // if (isEmpty) {
        setShowMenu(true);
        setMenuPosition({ x: e.clientX, y: e.clientY });
        // } else {
        //     dispatch(setMessage('해당 범위에 가매칭 과목이있음'));
        // }
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
                        idx == y.startIdx && result.push((y.endTimeIdx + 1 - y.startTimeIdx) * 20 + 'px');
                        return result;
                    }, [])}`,
                }}
            >
                <div style={{ padding: '5px' }}>
                    {itemLectureName}
                    <br />
                    {itemGroupData.map(y => {
                        return idx == y.startIdx && `${schedule.getTime(y.startTimeIdx)}~${schedule.getTime(y.endTimeIdx + 1)} `;
                    })}
                </div>
            </div>
            {auth === 'admin' && showMenu && <ItemMenu idx={idx} position={menuPosition} close={() => setShowMenu(false)} />}
        </Layout>
    );
}

export default React.memo(Item);
