import React, { useEffect, useState } from 'react';
import { mock } from '../mock/data';
function Control({ auth, setAuth }) {
    const [isSelect, setIsSelect] = useState(false); //선택모드
    const [isMatching, setIsMatching] = useState(false); //가매칭 영역 설정
    const [isAddMatching, setIsAddMatching] = useState(false); //가매칭 추가삭제
    const [lvt, setLvt] = useState();

    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'selectMatchingArea':
                        e.data.data.blocks.length > 0 ? setIsSelect(true) : setIsSelect(false);
                        break;
                    case 'updateMatching':
                        e.data.data.length > 0 ? setIsAddMatching(true) : setIsAddMatching(false);
                        break;
                }
            }
        });
    }, []);

    const handleMode = mode => {
        if (mode === 1) {
            //초기화
            setIsMatching(false);
            window.postMessage({ id: 'onuii-time-table', name: 'setSelectMode', data: {} }, '*');
            window.postMessage({ id: 'onuii-time-table', name: 'setTeacher', data: {} }, '*');
        } else {
            setIsMatching(true);
            window.postMessage({ id: 'onuii-time-table', name: 'setSelectMode', data: { type: 'matching' } }, '*');
        }
    };
    const handleChoose = v => {
        window.postMessage({ id: 'onuii-time-table', name: 'setTeacher', data: mock.teacherData[v] }, '*');
    };

    const handleEnterLvt = e => {
        setLvt(e);
        window.postMessage({ id: 'onuii-time-table', name: 'setLvt', data: e }, '*'); //선택한 LVT 전달
        window.postMessage({ id: 'onuii-time-table', name: 'setLessonOption', data: { time: 6, weekcount: 3 } }, '*'); //선택한 과목 옵션
    };

    const handleSave = () => {
        const flag = window.confirm('가매칭 정보 모달 생성 후 저장여부');
        flag && window.postMessage({ id: 'onuii-time-table', name: 'save' }, '*'); //차트 저장
    };

    const handleAuth = e => {
        const value = e.target.value;
        setAuth(value);
        window.postMessage({ id: 'onuii-time-table', name: 'setAuth', data: value }, '*'); //선택한 auth 전달
    };
    return (
        <div style={{ padding: '10px 20px', height: '30px' }}>
            <input id="radio_1" type="radio" name="auth" value="student" onChange={handleAuth} defaultChecked={true} />
            <label htmlFor="radio_1">학생</label>
            <input id="radio_2" type="radio" name="auth" value="teacher" onChange={handleAuth} />
            <label htmlFor="radio_2">선생님</label>
            <input id="radio_3" type="radio" name="auth" value="admin" onChange={handleAuth} />
            <label htmlFor="radio_3">관리자</label>
            {auth === 'admin' && (
                <>
                    <button onClick={() => handleEnterLvt(8906)}>수학</button>
                    <button onClick={() => handleEnterLvt(9168)}>국어</button>
                    <button onClick={() => handleEnterLvt(9169)} style={{ marginRight: '5px' }}>
                        영어
                    </button>
                    {isMatching && <button onClick={() => handleMode(1)}>가매칭모드 초기화</button>}
                    {!isMatching && lvt != null && <button onClick={() => handleMode(2)}>가매칭 영역 선택</button>}
                </>
            )}
            <select size="2" style={{ position: 'absolute' }}>
                <option onClick={() => handleChoose(0)}>후보 선생님 A</option>
                <option onClick={() => handleChoose(1)}>후보 선생님 B</option>
            </select>
            {isAddMatching && <button onClick={handleSave}>가매칭</button>}
        </div>
    );
}

export default Control;
