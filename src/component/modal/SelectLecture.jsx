import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Button from '../../module/button/Button';
import Input from '../../module/input/Input';
const Layout = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 3;
    background: rgb(0, 0, 0, 0.2);
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
`;
function SelectLecture({ position, handleConfirm, handleRemove, handleCancel }) {
    const boxRef = useRef();
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
            lecture.includes(value) ? setLecture(_.without(lecture, value)) : setLecture(['all']);
        } else {
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
                <div style={{ display: 'flex' }}>
                    {lectureList.map((e, i) => {
                        return (
                            <React.Fragment key={i}>
                                {/* <input type="checkbox" id={e.key} value={e.key} onChange={handleLecture} checked={lecture.includes(e.key)} />
                                    <label htmlFor={e.key}>{e.value}</label> */}
                                <Input text={e.value} id={e.key} value={e.key} checked={lecture.includes(e.key)} handleChange={handleLecture} />
                            </React.Fragment>
                        );
                    })}
                </div>
                <br />
                <div className={'message'}>{message}</div>
                <div className={'buttons'}>
                    <Button color={'blue'} text={'덮어쓰기 enter'} handleClick={() => handleConfirmExtend('overlap')} />
                    <Button color={'red'} text={'삭제하기 del backspace'} handleClick={handleRemove} />
                    <br />
                    <Button color={'blue'} text={'선택 추가 a'} handleClick={() => handleConfirmExtend('add')} />
                    <Button color={'red'} text={'선택 삭제 d'} handleClick={() => handleConfirmExtend('pop')} />
                    {/* <Button color={'yellow'} text={'가매칭 m'} handleClick={handleCancel} /> */}
                    <Button color={'grey'} text={'취소 esc'} handleClick={handleCancel} />
                </div>
            </div>
        </Layout>
    );
}

export default SelectLecture;
