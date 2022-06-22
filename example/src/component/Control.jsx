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
    const [isSelect, setIsSelect] = useState(false); //매칭 필터 선택 여부
    const [isAddMatching, setIsAddMatching] = useState(false); //가매칭 추가삭제

    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'selectMatchingArea':
                        //matching filter select!!
                        // console.log(e.data.data);
                        e.data.data.blocks.length > 0 ? setIsSelect(true) : setIsSelect(false);
                        break;
                    case 'updateMatching':
                        e.data.data.length > 0 ? setIsAddMatching(true) : setIsAddMatching(false);
                        break;
                }
            }
        });
    }, []);

    const handleChooseStudent = v => {
        //학생 변경
        setDataStudent(getTimetableS);
        setUserInfo(mock.userData);
        window.postMessage({ id: 'onuii-time-table', name: 'setSubject', data: 8906 }, '*'); //선택한 subject 전달
    };

    const handleChooseTeacher = v => {
        //선생님 변경
        setDataTeacher(getTimetableT);
        setTeacherInfo(mock.userData);
        window.postMessage(
            {
                id: 'onuii-time-table',
                name: 'setTeacher',
                data: getTimetableT,
                userInfo: mock.userData,
            },
            '*',
        );
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
                <select size="2" style={{ position: 'absolute' }}>
                    <option onClick={() => handleChooseTeacher(0)}>후보 선생님 A</option>
                    <option onClick={() => handleChooseTeacher(1)}>후보 선생님 B</option>
                </select>
            </>
        </div>
    );
}

export default Control;
