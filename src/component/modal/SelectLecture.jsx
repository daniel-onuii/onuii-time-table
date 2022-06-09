import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Button from '../../module/button/Button';
import Input from '../../module/input/Input';
import { useSelector } from 'react-redux';
import { schedule } from '../../util/schedule';
const Layout = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 3;
    background: rgb(0, 0, 0, 0.2);
    .timeInfo {
        text-align: left;
        font-size: 18px;
        padding-bottom: 15px;
    }
    .modalLectureBox {
        position: absolute;
        padding: 15px;
        z-index: 9999999;
        background: white;
        border: 1px solid #cdcdcd;
        border-radius: 4px;
        top: 20px;
        background: white;
        color: black;
        width: 400px;
    }
    .modalLectureBox input {
        width: 15px !important;
        cursor: pointer;
    }
    .modalLectureBox label {
        cursor: pointer;
        padding-left: 10px;
        padding-right: 10px;
    }
    .buttons div {
        margin-right: 5px;
        margin-top: 5px;
    }
    .message {
        text-align: left;
        color: red;
    }
    input {
        width: 64px !important;
        margin: 0px !important;
        height: 16px !important;
        padding: 5px !important;
        font-size: 12px !important;
    }
`;
function SelectLecture({ position, handleConfirm, handleRemove, handleCancel }) {
    const { areaObj, areaGrabbedObj } = useSelector(state => state.trigger);
    const boxRef = useRef();
    // useEffect(() => {
    //     console.log(areaGrabbedObj);
    //     console.log(areaObj, '얘 없앨수있는지');
    // }, []);
    const [dynamicX, setDynamicX] = useState();
    const [lecture, setLecture] = useState([]);
    const [message, setMessage] = useState('');
    const lectureList = [
        { key: 'all', value: '상관없음' },
        { key: '9168', value: '국어' },
        { key: '9169', value: '영어' },
        { key: '8906', value: '수학' },
        { key: '9171', value: '과학' },
    ];
    const handleConfirmExtend = type => {
        lecture.length === 0 ? setMessage(`${type}과목 선택 안함`) : handleConfirm(type, lecture);
    };
    const handleLecture = e => {
        const value = e.target.value;
        if (value === 'all') {
            // lecture.includes(value) ? setLecture(_.sortBy(_.without(lecture, value))) : setLecture(['all']);
            lecture.includes(value) ? setLecture(_.without(lecture, value)) : setLecture(['all']);
        } else {
            // lecture.includes(value) ? setLecture(_.sortBy(_.without(lecture, value))) : setLecture(_.sortBy(_.without([...lecture, value], 'all')));
            lecture.includes(value) ? setLecture(_.without(lecture, value)) : setLecture(_.without([...lecture, value], 'all'));
        }
    };
    useEffect(() => {
        setMessage('');
        const inputKey = e => {
            e.preventDefault();
            switch (e.code) {
                case 'Enter':
                    handleConfirmExtend('overlap');
                    break;
                case 'Backspace':
                    handleRemove();
                    break;
                case 'Delete':
                    handleRemove();
                    break;
                case 'Escape':
                    handleCancel();
                    break;
                case 'KeyA':
                    handleConfirmExtend('add');
                    break;
                case 'KeyD':
                    handleConfirmExtend('pop');
                    break;
                default:
                    null;
            }
        };
        document.addEventListener('keydown', inputKey);
        return () => {
            document.removeEventListener('keydown', inputKey);
        };
    }, [lecture]);

    useEffect(() => {
        position.x + boxRef.current.clientWidth >= document.body.clientWidth
            ? setDynamicX(document.body.clientWidth - boxRef.current.clientWidth - 2)
            : setDynamicX(position.x);
    }, []);
    return (
        <Layout>
            <div ref={boxRef} className={'modalLectureBox'} style={{ left: dynamicX, top: position.y }}>
                <div className={'timeInfo'}>
                    <span>{`${schedule.getWeekText(areaObj.startOverDayIdx)} ${schedule.getTime(areaObj.startOverIdx)}`}</span> {` ~ `}
                    <span>{`${schedule.getWeekText(areaObj.endOverDayIdx)} ${schedule.getTime(areaObj.endOverIdx)}`}</span>
                    <span>({(areaObj.endOverIdx - areaObj.startOverIdx) * 15}분)</span>
                </div>
                <div style={{ display: 'flex' }}>
                    {lectureList.map((e, i) => {
                        return (
                            <React.Fragment key={i}>
                                <Input text={e.value} id={e.key} value={e.key} checked={lecture.includes(e.key)} handleChange={handleLecture} />
                            </React.Fragment>
                        );
                    })}
                </div>
                <br />
                <div className={'message'}>{message}</div>
                <div className={'buttons'}>
                    <Button color={'blue'} text={'덮어쓰기'} alt={'enter'} handleClick={() => handleConfirmExtend('overlap')} />
                    <Button color={'red'} text={'초기화'} handleClick={handleRemove} />
                    <Button color={'blue'} text={'추가'} handleClick={() => handleConfirmExtend('add')} />
                    <Button color={'red'} text={'삭제'} handleClick={() => handleConfirmExtend('pop')} />
                    <Button color={'grey'} text={'취소'} handleClick={handleCancel} />
                </div>
            </div>
        </Layout>
    );
}

export default SelectLecture;
