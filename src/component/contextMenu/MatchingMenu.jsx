import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
// import { setMatchingItemData } from '../../store/reducer/schedule.reducer';
import _ from 'lodash';
import { setMessage } from '../../store/reducer/trigger.reducer';
import { schedule } from '../../util/schedule';
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
function MatchingMenu({ idx, position, close, itemHook, interfaceHook }) {
    const dispatch = useDispatch();
    const [time, setTime] = useState();
    const [weekCount, setWeekCount] = useState();
    const subject = interfaceHook.subject;
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
        // const lectureOption = _.find(interfaceHook.userData?.lectureData, { lectureId: subject });

        setTime(interfaceHook.lessonTime.time);
        setWeekCount(interfaceHook.lessonTime.weekCount);
        document.addEventListener('keydown', inputKey);
        return () => {
            document.removeEventListener('keydown', inputKey);
        };
    }, []);
    const handleClick = () => {
        close();
        if (_.isEmpty(interfaceHook.userData)) return false;
        const lessonCount = _.filter(itemHook.matchingItemGroupData, { lectureId: subject }).length;
        if (lessonCount >= weekCount) {
            dispatch(setMessage('횟수가 초과됨.'));
            return false;
        } else {
            const endTime = idx - 1 + time;
            const checkCrash = schedule.checkCrashItemTime(itemHook.matchingItemGroupData, idx, endTime, subject);
            if (!_.isEmpty(checkCrash)) {
                dispatch(setMessage(checkCrash));
                return false;
            }
            const data = _.range(idx, idx + time).map((e, i) => {
                return { timeBlockId: e, lectureId: subject };
            });
            itemHook.setMatchingItemData([...itemHook.matchingItemData, ...data]);
        }
    };
    return (
        <Layout left={newPositionX} top={position.y + 3} ref={boxRef}>
            <ul onContextMenu={e => e.preventDefault()}>
                <li onClick={handleClick}>해당 영역으로 가매칭</li>
            </ul>
        </Layout>
    );
}

export default MatchingMenu;
