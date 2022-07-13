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
        padding-bottom: 10px;
    }
    .modalLectureBox {
        position: fixed;
        // position: absolute;
        // top: 20px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        padding: 15px;
        z-index: 9999999;
        background: white;
        border: 1px solid #cdcdcd;
        border-radius: 4px;
        background: white;
        color: black;
        width: 300px;
    }
    .modalLectureBox input {
        width: 15px !important;
        cursor: pointer;
    }
    .modalLectureBox label {
        cursor: pointer;
        padding-left: 5px;
        // padding-right: 15px;
    }
    .buttons div {
        margin-right: 5px;
        margin-top: 5px;
    }
    .message {
        height: 15px;
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
    span.lectureName {
        border-radius: 4px;
        font-weight: bold;
        margin-right: 4px;
        color: #fff;
        padding: 3px 10px;
    }
    .validation,
    .alert {
        margin-left: 5px;
        cursor: pointer;
    }
`;
function SelectLecture({ position, handleConfirm, handleRemove, handleCancel, areaHook, interfaceHook }) {
    const totalMin = (areaHook.areaObj.endOverIdx - areaHook.areaObj.startOverIdx) * 15;
    const subject = interfaceHook.subject;
    const boxRef = useRef();
    const [dynamicX, setDynamicX] = useState();
    const [lecture, setLecture] = useState([]);
    const [message, setMessage] = useState('');
    const lectureList = interfaceHook.target === 'student' ? interfaceHook?.userData.lectureData : [{ lectureId: 'all', lecture_name: '가능' }]; //mock data
    const [visibleList, setVisibleList] = useState(lectureList);
    const [checkValidation, setcheckValidation] = useState([]);
    useEffect(() => {
        const userLectureInfo = interfaceHook.userData.lectureData;
        setcheckValidation(schedule.checkAreaValidation(userLectureInfo, areaHook.areaData));
    }, []);
    // useEffect(() => {
    //     console.log(checkValidation);
    // }, [checkValidation]);
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
        lecture.length === 0 ? setMessage(`${type === 'add' ? '추가 할 ' : '삭제 할 '}과목을 선택해주세요.`) : handleConfirm(type, lecture);
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
            //최대 선택 과목 4개
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

    // useEffect(() => {
    // position.x + boxRef.current.clientWidth >= document.body.clientWidth
    //     ? setDynamicX(document.body.clientWidth - boxRef.current.clientWidth - 2)
    //     : setDynamicX(position.x);
    // }, []);
    const handleAlert = lectureId => {
        const msgObj = _.find(checkValidation, { lectureId: lectureId });
        alert(`${msgObj.lecture_name}${msgObj.message}`);
        // alert(lectureId)/;
    };
    return (
        <Layout>
            {/* <div ref={boxRef} className={'modalLectureBox'} style={{ left: dynamicX, top: position.y }}> */}
            <div ref={boxRef} className={'modalLectureBox'}>
                <div className={'timeInfo'}>
                    <span>{`${schedule.getWeekText(areaHook.areaObj.startOverDayIdx)} ${schedule.getTime(areaHook.areaObj.startOverIdx)}`}</span>{' '}
                    {` ~ `}
                    <span>{`${schedule.getWeekText(areaHook.areaObj.endOverDayIdx)} ${schedule.getTime(areaHook.areaObj.endOverIdx)}`}</span>
                    <span>({`${parseInt(totalMin / 60)}시간 ${totalMin % 60}분`})</span>
                </div>
                <div className={'lectureSelect'} style={{ display: 'inline-block' }}>
                    {visibleList.map((e, i) => {
                        const isSuccess = _.find(checkValidation, { lectureId: e.lectureId })?.isSuccess;
                        return (
                            <React.Fragment key={i}>
                                <div style={{ margin: '10px 0px', display: 'flex' }}>
                                    <Input
                                        // text={`${e.lecture_name} 주3회 50분`}
                                        id={e.lectureId}
                                        value={e.lectureId}
                                        checked={lecture.includes(e.lectureId)}
                                        handleChange={handleLecture}
                                    >
                                        <label htmlFor={e.lectureId} id={e.lectureId}>
                                            <span className={`lectureName ${interfaceHook.target === 'student' ? `color${i}` : 'color_all'}`}>
                                                {e.lecture_name}
                                            </span>
                                            {interfaceHook.target === 'student'
                                                ? ` ${`주${Number(e.lesson_time?.split('_')[0]?.replace('W', ''))}회 ${Number(
                                                      e.lesson_time?.split('_')[1]?.replace('H', ''),
                                                  )}분`} `
                                                : ''}
                                        </label>
                                        {interfaceHook.target === 'student' && <span className="validation">{isSuccess ? '✅' : '❌'}</span>}
                                    </Input>
                                    {!isSuccess && interfaceHook.target === 'student' && (
                                        <span className="alert" onClick={() => handleAlert(e.lectureId)}>
                                            💬
                                        </span>
                                    )}
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
                    <Button color={'grey'} text={'취소'} handleClick={handleCancel} />
                </div>
            </div>
        </Layout>
    );
}

export default SelectLecture;
