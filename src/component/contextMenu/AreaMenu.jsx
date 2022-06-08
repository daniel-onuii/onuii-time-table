import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setMatchingItemData } from '../../store/reducer/schedule.reducer';
import _ from 'lodash';
import { setMessage } from '../../store/reducer/trigger.reducer';
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
function AreaMenu({ idx, position, close }) {
    const userLectureInfo = [
        //유저의 가매칭 대기중인 mock data
        { lecture_subject_Id: 9168, count: 1, time: 6, title: '국어' },
        { lecture_subject_Id: 8906, count: 3, time: 4, title: '수학' },
        { lecture_subject_Id: 9171, count: 2, time: 6, title: '과학' },
    ];

    const dispatch = useDispatch();
    const { matchingItemData, matchingItemGroupData } = useSelector(state => state.schedule);
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
        const lecture = Number(e.target.getAttribute('lecture'));
        const time = Number(e.target.getAttribute('time'));
        const weekCount = Number(e.target.getAttribute('weekcount'));
        const lessonCount = _.filter(matchingItemGroupData, { lecture_subject_Id: lecture }).length;
        if (lessonCount >= weekCount) {
            dispatch(setMessage('횟수가 초과됨.'));
            return false;
        } else {
            // console.log(idx, idx + time);
            const endTime = idx - 1 + time;
            matchingItemGroupData.map(e => {
                console.log(_.inRange(endTime, e.startIdx, e.endIdx + 1));
                console.log(_.inRange(e.startIdx, idx, endTime) && _.inRange(e.endIdx, idx, endTime));
            });

            const data = _.range(idx, idx + time).map((e, i) => {
                return { block_group_No: e, lecture_subject_Id: lecture };
            });
            dispatch(setMatchingItemData([...matchingItemData, ...data]));
        }
    };
    return (
        <Layout left={newPositionX} top={position.y + 3} ref={boxRef}>
            <ul onContextMenu={e => e.preventDefault()}>
                {userLectureInfo &&
                    userLectureInfo.map((e, i) => {
                        const isDisabled =
                            _.filter(matchingItemGroupData, { lecture_subject_Id: e.lecture_subject_Id }).length >= e.count ? 'disabled' : '';
                        return (
                            <li key={i} lecture={e.lecture_subject_Id} time={e.time} weekcount={e.count} onClick={handleClick} className={isDisabled}>
                                {`${e.title} ${e.time * 15}분 주${e.count}회`}
                            </li>
                        );
                    })}
            </ul>
        </Layout>
    );
}

export default AreaMenu;
