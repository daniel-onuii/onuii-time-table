import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Button from '../../module/button/Button';
import Input from '../../module/input/Input';
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
        padding-right: 15px;
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
    input.disabled {
        filter: brightness(80%);
    }
    .disabled {
        pointer-events: none;
    }
`;
function SelectLecture({ position, handleConfirm, handleRemove, handleCancel, areaObj, interfaceHook }) {
    const subject = interfaceHook.subject;
    const boxRef = useRef();
    const [dynamicX, setDynamicX] = useState();
    const [lecture, setLecture] = useState([]);
    const [message, setMessage] = useState('');
    const lectureList = interfaceHook.target === 'student' ? interfaceHook?.userData.lectureData : [{ lectureId: 'all', lecture_name: '가능' }]; //mock data
    const [visibleList, setVisibleList] = useState(lectureList);
    useEffect(() => {
        if (interfaceHook.target === 'student') {
            //학생일때
            !_.isNull(subject) && setVisibleList([_.find(lectureList, { lectureId: subject })]);
            !_.isNull(subject) && setLecture([subject]); //subject값 자동체크
        } else {
            setLecture(['all']);
        }
    }, [subject, interfaceHook.target]);
    const handleConfirmExtend = type => {
        lecture.length === 0 ? setMessage(`${type}과목 선택 안함`) : handleConfirm(type, lecture);
    };
    const handleLecture = e => {
        const value = Number(e.target.value);
        if (value === 'all') {
            lecture.includes(value) ? setLecture(_.without(lecture, value)) : setLecture(['all']);
        } else {
            lecture.includes(value) ? setLecture(_.without(lecture, value)) : setLecture(_.without([...lecture, value], 'all'));
        }
    };
    useEffect(() => {
        const overItems = document.querySelectorAll('.lectureSelect input:not(:checked)');
        if (lecture.length >= 4) {
            _.flatMap(overItems).map(e => {
                e.classList.add('disabled');
                e.nextSibling.classList.add('disabled');
            });
        } else {
            _.flatMap(overItems).map(e => {
                e.classList.remove('disabled');
                e.nextSibling.classList.remove('disabled');
            });
        }
    }, [lecture]);
    useEffect(() => {
        setMessage('');
        const inputKey = e => {
            e.preventDefault();
            switch (e.code) {
                case 'Enter':
                    handleConfirmExtend('add');
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
                <div className={'lectureSelect'} style={{ display: 'inline-block' }}>
                    {visibleList.map((e, i) => {
                        return (
                            <React.Fragment key={i}>
                                {i == 4 && <br />}
                                <div style={{ display: 'inline-block' }}>
                                    <Input
                                        text={e.lecture_name}
                                        id={e.lectureId}
                                        value={e.lectureId}
                                        checked={lecture.includes(e.lectureId)}
                                        handleChange={handleLecture}
                                    />
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
                <br />
                <div className={'message'}>{message}</div>
                <div className={'buttons'}>
                    {/* <Button color={'blue'} text={'덮어쓰기'} alt={'enter'} handleClick={() => handleConfirmExtend('overlap')} /> */}
                    <Button color={'blue'} text={'추가'} handleClick={() => handleConfirmExtend('add')} />
                    <Button color={'red'} text={'삭제'} handleClick={() => handleConfirmExtend('pop')} />
                    <Button color={'red'} text={'초기화'} handleClick={handleRemove} />
                    {/* <Button color={'blue'} text={'설정'} handleClick={() => handleConfirmExtend('set')} /> */}
                    <Button color={'grey'} text={'취소'} handleClick={handleCancel} />
                </div>
            </div>
        </Layout>
    );
}

export default SelectLecture;
