import React, { useEffect } from 'react';
import styled from 'styled-components';
const Layout = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 3;

    .modalLectureBox {
        position: absolute;
        padding: 15px;
        z-index: 9999999;
        background: white;
        border: 1px solid black;
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
function SelectLecture({ position }) {
    useEffect(() => {
        console.log(position);
    }, []);
    const handleClick = e => {
        // e.preventDefault();
        console.log('!!!');
    };
    return (
        <Layout>
            <div className={'modalLectureBox'} onClick={handleClick} style={{ left: position.x, top: position.y }}>
                <div style={{ display: 'flex' }}>
                    <input type="checkbox" /> <span>상관없음</span>
                    <input type="checkbox" /> <span>수학</span>
                </div>
                <div>
                    <button>확인</button>
                    <button>취소</button>
                </div>
            </div>
        </Layout>
    );
}

export default SelectLecture;
