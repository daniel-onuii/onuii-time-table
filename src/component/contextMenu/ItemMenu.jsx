import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
const Layout = styled.div`
    position: fixed;
    background: white;
    border: 1px solid #cdcdcd;
    z-index: 3;
    left: ${props => props.left}px;
    top: ${props => props.top}px;
    ul {
        width: 100%;
        list-style: none;
        text-align: left;
        padding: 0px;
        margin: 0px;
    }
    li {
        cursor: pointer;
        padding: 5px;
        border-bottom: 1px solid #efefef;
    }
    li:last-child {
        border: none;
    }
    li:hover {
        background: #efefef;
    }
    .disabled {
        // pointer-events: none;
        opacity: 0.4;
    }
`;
function ItemMenu({ idx, position, close, itemHook }) {
    const boxRef = useRef();
    const newPositionX =
        position.x + boxRef?.current?.clientWidth >= document.body.clientWidth
            ? document.body.clientWidth - boxRef.current.clientWidth - 2
            : position.x + 3;
    const inputKey = e => {
        switch (e.key) {
            case 'Escape':
                close();
                break;
            default:
                null;
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', inputKey);
        return () => {
            document.removeEventListener('keydown', inputKey);
        };
    }, []);
    const handleClick = e => {
        close();
        const target = _.find(itemHook.matchingItemGroupData, { startIdx: idx });
        const result = _.reject(itemHook.matchingItemData, o => _.inRange(o.timeBlockId, target.startIdx, target.endIdx + 1));
        itemHook.setMatchingItemData(result);
    };
    return (
        <Layout left={newPositionX} top={position.y + 3} ref={boxRef}>
            <ul onContextMenu={e => e.preventDefault()}>
                <li onClick={handleClick}>삭제</li>
            </ul>
        </Layout>
    );
}

export default ItemMenu;
