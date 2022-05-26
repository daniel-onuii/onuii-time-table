import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Button from '../../module/button/Button';
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
`;
function SelectLecture({ position, handleConfirm, handleRemove, handleCancel }) {
    const [dynamicX, setDynamicX] = useState();
    const boxRef = useRef();
    const [lecture, setLecture] = useState([]);
    const lectureList = [
        { key: 'all', value: '상관없음' },
        { key: '9168', value: '국어' },
        { key: '9169', value: '영어' },
        { key: '8906', value: '수학' },
        { key: '9171', value: '과학' },
    ];
    const handleConfirmExtend = type => {
        return () => {
            lecture.length === 0 ? alert('과목 선택 안함') : handleConfirm(type, lecture);
        };
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
        const inputKey = e => {
            switch (e.key) {
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
                <React.Fragment>
                    <div style={{ display: 'flex' }}>
                        {lectureList.map((e, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <input type="checkbox" id={e.key} value={e.key} onChange={handleLecture} checked={lecture.includes(e.key)} />
                                    <label htmlFor={e.key}>{e.value}</label>
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <br />
                    <div>
                        <Button title={'덮어쓰기'} handleClick={handleConfirmExtend('overlap')} />
                        <button onClick={handleConfirmExtend('overlap')}>덮어쓰기</button>
                        <button onClick={handleRemove}>삭제하기</button>
                        <button onClick={handleConfirmExtend('add')}>+</button>
                        <button onClick={handleConfirmExtend('pop')}>-</button>
                        <button onClick={handleCancel}>취소</button>
                    </div>
                </React.Fragment>
            </div>
        </Layout>
    );
}

export default SelectLecture;
