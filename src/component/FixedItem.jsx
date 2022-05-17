import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FixedItemDetail from './FixedItemDetail';

const Layout = styled.div`
    .lectureItem {
        cursor: pointer;
        width: 85%;
        height: 100%;
        position: absolute;
        top: 0px;
        background: #feb74e;
        color: white;
        border-radius: 5px;
        padding-top: 4px;
    }
`;
function FixedItem({ master, idx, itemlectureid, itemLectureName, handleClick, handleDragStart, handleDragEnter, itemGroupData, timeList, itemObj }) {
    useEffect(() => {
        console.log(master);
        console.log(timeList);
        // console.log(_.filter(itemGroupData, { startIdx: idx }));
    }, []);
    return (
        <Layout>
            <div
                className={`lectureItem`}
                itemidx={idx}
                itemlectureid={itemlectureid}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onClick={handleClick}
                style={{
                    zIndex: 2,
                    height: `${itemGroupData.reduce((result, y) => {
                        idx == y.startIdx && result.push((y.endTimeIdx + 1 - y.startTimeIdx) * 20 + 'px');
                        return result;
                    }, [])}`,
                }}
                time={itemGroupData.reduce((result, y) => {
                    idx == y.startIdx && result.push(y.endTimeIdx + 1 - y.startTimeIdx);
                    return result;
                }, [])}
            >
                {itemLectureName}
                <br />
                {itemGroupData.map(y => {
                    //과외시간
                    return idx == y.startIdx && `${timeList[y.startTimeIdx]}~${timeList[y.endTimeIdx + 1]} ${y.endTimeIdx}`;
                })}
            </div>
            {itemObj.isShow && itemObj.idx === idx && <FixedItemDetail idx={idx} itemLectureName={itemLectureName} itemGroupData={itemGroupData} timeList={timeList} />}
        </Layout>
    );
}

export default React.memo(FixedItem);
