import React, { useEffect, useState } from 'react';
import { mock } from '../mock/data';
import styled from 'styled-components';
import { getTimetableS, getTimetableT } from '../mock/apiData';
const Button = styled.div`
    display: inline-block;
    .active {
        background: yellow;
    }
`;
function Control({ setDataStudent, setDataTeacher, setUserInfo, setTeacherInfo }) {
    const [isAddMatching, setIsAddMatching] = useState(false); //가매칭 추가삭제
    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'responseBlockData':
                        console.log(e.data);
                        break;
                    case 'selectMatchingArea': //학생차트에서 선택된 filter값을 선생님 차트에 전달
                        window.postMessage({ id: 'onuii-time-table', name: 'setFilter', data: e.data.data.blocks }, '*'); //선생님 핑크 표시
                        break;
                    case 'responseMatchingItem':
                        console.log(e.data.data);
                        e.data.data.length > 0 ? setIsAddMatching(true) : setIsAddMatching(false);
                        break;
                }
            }
        });
    }, []);

    const handleChooseTeacher = v => {
        //선생님 변경
        setDataTeacher(getTimetableT[v]);
        setTeacherInfo(mock.userData);
        //필요없음newnew
        // window.postMessage(
        //     {
        //         id: 'onuii-time-table',
        //         name: 'setTeacher',
        //         data: getTimetableT[v],
        //         userInfo: mock.userData,
        //     },
        //     '*',
        // );
    };

    const handleRequestData = () => {
        window.postMessage({ id: 'onuii-time-table', name: 'getBlockData' }, '*'); //블록 데이터
    };

    const handleChooseStudent = v => {
        //학생 변경
        window.postMessage({ id: 'onuii-time-table', name: 'setSubject', data: 8906 }, '*'); //선택한 subject 전달
        window.postMessage({ id: 'onuii-time-table', name: 'resetFilter' }, '*'); //newnew 학생 변경시 filter reset
        setDataStudent(getTimetableS[v]);
        setUserInfo(mock.userData);
    };
    const handleClickSubject = e => {
        window.postMessage({ id: 'onuii-time-table', name: 'setSubject', data: e }, '*'); //선택한 subject 전달
    };

    const handleSave = () => {
        const flag = window.confirm('가매칭 정보 모달 생성 후 저장여부');
        flag && window.postMessage({ id: 'onuii-time-table', name: 'save' }, '*'); //차트 저장
    };
    return (
        <div style={{ padding: '10px 20px', height: '30px' }}>
            <>
                <select size="2">
                    <option onClick={() => handleChooseStudent(0)}>학생 A</option>
                    <option onClick={() => handleChooseStudent(1)}>학생 B</option>
                </select>
                <Button>
                    <button onClick={() => handleClickSubject(8906)}>수학</button>
                </Button>
                <Button>
                    <button onClick={() => handleClickSubject(9168)}>국어</button>
                </Button>
                <Button>
                    <button onClick={() => handleClickSubject(9169)} style={{ marginRight: '5px' }}>
                        영어
                    </button>
                </Button>
                {isAddMatching && <button onClick={handleSave}>가매칭</button>}

                <button onClick={handleRequestData}>데이터 요청</button>
                <select size="2" style={{ position: 'absolute' }}>
                    <option onClick={() => handleChooseTeacher(0)}>후보 선생님 A</option>
                    <option onClick={() => handleChooseTeacher(1)}>후보 선생님 B</option>
                </select>
            </>
        </div>
    );
}

export default Control;
