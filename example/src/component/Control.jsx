import React, { useEffect } from 'react';
import { mock } from '../mock/data';
import { getTimetableS, getTimetableT } from '../mock/apiData';
function Control({ setDataStudent, setDataTeacher, setUserInfo }) {
    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'responseBlockData':
                        console.log(e.data);
                        break;
                    case 'responseMatchingData':
                        console.log(e.data.data);
                        break;
                    case 'selectMatchingArea': //학생차트에서 선택된 filter값을 선생님 차트에 전달
                        window.postMessage({ id: 'onuii-time-table', name: 'setFilter', data: e.data.data.blocks }, '*'); //선생님 핑크 표시
                        break;
                    case 'responseRealTimeBlockData':
                        console.log('!', e.data);
                        break;
                }
            }
        });
    }, []);

    const handleChooseTeacher = v => {
        setDataTeacher(getTimetableT[v]);
    };

    const handleChooseStudent = v => {
        window.postMessage({ id: 'onuii-time-table', name: 'setSubject', data: v == 0 ? 8906 : 9168 }, '*'); //선택한 subject 전달
        window.postMessage({ id: 'onuii-time-table', name: 'setLvt', data: v + 1 }, '*'); //선택한 subject 전달
        window.postMessage({ id: 'onuii-time-table', name: 'resetFilter' }, '*'); //newnew 학생 변경시 filter reset
        setDataStudent(getTimetableS[v]);
        setUserInfo(mock.userData);
    };

    const handleRequestData = () => {
        window.postMessage({ id: 'onuii-time-table', name: 'getBlockData' }, '*'); //블록 데이터
        window.postMessage({ id: 'onuii-time-table', name: 'getMatchingData' }, '*'); //가매칭 데이터
    };

    return (
        <div style={{ padding: '10px 20px', height: '30px' }}>
            <>
                <select size="2">
                    <option onClick={() => handleChooseStudent(0)}>학생 A</option>
                    <option onClick={() => handleChooseStudent(1)}>학생 B</option>
                </select>
                <select size="2">
                    <option onClick={() => handleChooseTeacher(0)}>후보 선생님 A</option>
                    <option onClick={() => handleChooseTeacher(1)}>후보 선생님 B</option>
                </select>
                <button onClick={handleRequestData}>가매칭 데이터 요청</button>
            </>
        </div>
    );
}

export default Control;
