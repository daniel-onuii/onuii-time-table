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
`;
function AreaMenu({ idx, position, close }) {
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
        const lecture = Number(e.target.getAttribute('lecture'));
        const time = Number(e.target.getAttribute('time'));
        const weekCount = Number(e.target.getAttribute('weekcount'));
        const lessonCount = _.filter(matchingItemGroupData, { lecture_subject_Id: lecture }).length;
        close();
        if (lessonCount >= weekCount) {
            dispatch(setMessage('횟수가 초과됨.'));
            return false;
        } else {
            const data = _.range(idx, idx + time).map((e, i) => {
                return { block_group_No: e, lecture_subject_Id: lecture };
            });
            dispatch(setMatchingItemData([...matchingItemData, ...data]));
        }
    };
    return (
        <Layout left={newPositionX} top={position.y + 3} ref={boxRef}>
            <ul>
                <li lecture={'9171'} time={4} weekcount={2} onClick={handleClick}>
                    매칭 추가(과학60분 주2회)
                </li>
                <li lecture={'8906'} time={6} weekcount={1} onClick={handleClick}>
                    매칭 추가(수학90분 주1회)
                </li>
            </ul>
        </Layout>
    );
}

export default AreaMenu;
