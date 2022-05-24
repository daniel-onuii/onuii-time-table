import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
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
    }
    .modalLectureBox span {
        padding-left: 10px;
        padding-right: 10px;
    }
`;
function SelectLecture({ isAreaAppend, position, handleConfirm, handleCancel }) {
    const [dynamicX, setDynamicX] = useState();
    const boxRef = useRef();
    const [lecture, setLecture] = useState([]);
    const handleExtendConfirm = () => {
        handleConfirm(lecture);
    };
    const handleLecture = e => {
        setLecture([...lecture, e.target.value]);
    };
    useEffect(() => {
        position.x + boxRef.current.clientWidth >= document.body.clientWidth ? setDynamicX(document.body.clientWidth - boxRef.current.clientWidth - 2) : setDynamicX(position.x);
    }, []);
    return (
        <Layout>
            <div ref={boxRef} className={'modalLectureBox'} style={{ left: dynamicX, top: position.y }}>
                {!isAreaAppend ? (
                    <React.Fragment>
                        <div style={{ display: 'flex' }}>
                            <input type="checkbox" value={'all'} onClick={handleLecture} /> <span>상관없음</span>
                            <input type="checkbox" value={9168} onClick={handleLecture} /> <span>국어</span>
                            <input type="checkbox" value={9169} onClick={handleLecture} /> <span>영어</span>
                            <input type="checkbox" value={8906} onClick={handleLecture} /> <span>수학</span>
                            <input type="checkbox" value={9171} onClick={handleLecture} /> <span>과학</span>
                        </div>
                        <br />
                        <div>
                            <button onClick={handleExtendConfirm}>확인</button>
                            <button onClick={handleCancel}>취소</button>
                        </div>
                    </React.Fragment>
                ) : (
                    <div>
                        <button onClick={handleConfirm}>삭제하기</button>
                        <button onClick={handleCancel}>취소</button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default SelectLecture;
