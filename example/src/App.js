import React, { useEffect, useState } from 'react';
import { OnuiiTimeTable } from 'onuii-time-table';
// import 'onuii-time-table/dist/index.css';

const App = () => {
    const areaData = [
        { block_group_No: 36, areaActiveType: ['8906', '9168'] },
        { block_group_No: 37, areaActiveType: ['8906', '9168'] },
        { block_group_No: 38, areaActiveType: ['8906', '9168'] },
        { block_group_No: 39, areaActiveType: ['8906', '9168'] },
        { block_group_No: 40, areaActiveType: ['8906', '9168'] },
        { block_group_No: 135, areaActiveType: ['8906'] },
        { block_group_No: 136, areaActiveType: ['8906'] },
        { block_group_No: 137, areaActiveType: ['8906'] },
        { block_group_No: 138, areaActiveType: ['8906'] },
        { block_group_No: 139, areaActiveType: ['8906'] },
        { block_group_No: 140, areaActiveType: ['8906'] },
        { block_group_No: 141, areaActiveType: ['8906'] },
        { block_group_No: 142, areaActiveType: ['8906'] },
        { block_group_No: 143, areaActiveType: ['8906'] },
        { block_group_No: 232, areaActiveType: ['8906'] },
        { block_group_No: 233, areaActiveType: ['8906'] },
        { block_group_No: 234, areaActiveType: ['8906'] },
        { block_group_No: 235, areaActiveType: ['8906'] },
        { block_group_No: 236, areaActiveType: ['8906'] },
        { block_group_No: 237, areaActiveType: ['9171'] },
        { block_group_No: 238, areaActiveType: ['9171'] },
        { block_group_No: 239, areaActiveType: ['9171'] },
        { block_group_No: 240, areaActiveType: ['9171'] },
        { block_group_No: 241, areaActiveType: ['8906', '9171', '9168'] },
        { block_group_No: 242, areaActiveType: ['8906', '9171', '9168'] },
        { block_group_No: 243, areaActiveType: ['8906', '9171', '9168'] },
        { block_group_No: 244, areaActiveType: ['8906', '9168'] },
        { block_group_No: 245, areaActiveType: ['8906', '9168'] },
        { block_group_No: 246, areaActiveType: ['8906', '9168'] },
    ];
    const fixedItemData = [
        { block_group_No: 36, lecture_subject_Id: 9171 },
        { block_group_No: 37, lecture_subject_Id: 9171 },
        { block_group_No: 38, lecture_subject_Id: 9171 },
        { block_group_No: 39, lecture_subject_Id: 9171 },
        { block_group_No: 40, lecture_subject_Id: 9171 },
        { block_group_No: 41, lecture_subject_Id: 9171 },
        { block_group_No: 98, lecture_subject_Id: 9171 },
        { block_group_No: 99, lecture_subject_Id: 9171 },
        { block_group_No: 100, lecture_subject_Id: 9171 },
        { block_group_No: 101, lecture_subject_Id: 9171 },
        { block_group_No: 135, lecture_subject_Id: 8906 },
        { block_group_No: 136, lecture_subject_Id: 8906 },
        { block_group_No: 137, lecture_subject_Id: 8906 },
        { block_group_No: 138, lecture_subject_Id: 8906 },
        { block_group_No: 160, lecture_subject_Id: 8906 },
        { block_group_No: 161, lecture_subject_Id: 8906 },
        { block_group_No: 162, lecture_subject_Id: 8906 },
        { block_group_No: 163, lecture_subject_Id: 8906 },
    ];

    const matchingItemData = [
        // { block_group_No: 236, lecture_subject_Id: 9171 }
    ];
    const teacherData = [
        [
            { block_group_No: 36 },
            { block_group_No: 37 },
            { block_group_No: 56 },
            { block_group_No: 57 },
            { block_group_No: 58 },
            { block_group_No: 59 },
            { block_group_No: 60 },
            { block_group_No: 61 },
            { block_group_No: 62 },
            { block_group_No: 63 },
            { block_group_No: 64 },
            { block_group_No: 65 },
            { block_group_No: 140 },
            { block_group_No: 141 },
            { block_group_No: 142 },
            { block_group_No: 143 },
            { block_group_No: 144 },
            { block_group_No: 145 },
            { block_group_No: 146 },
            { block_group_No: 147 },
            { block_group_No: 148 },
            { block_group_No: 232 },
            { block_group_No: 233 },
            { block_group_No: 234 },
            { block_group_No: 235 },
            { block_group_No: 236 },
            { block_group_No: 237 },
            { block_group_No: 238 },
        ],
        [
            { block_group_No: 140 },
            { block_group_No: 141 },
            { block_group_No: 142 },
            { block_group_No: 143 },
            { block_group_No: 162 },
            { block_group_No: 163 },
            { block_group_No: 164 },
            { block_group_No: 165 },
            { block_group_No: 166 },
            { block_group_No: 167 },
            { block_group_No: 168 },
            { block_group_No: 169 },
            { block_group_No: 170 },
            { block_group_No: 252 },
            { block_group_No: 253 },
            { block_group_No: 254 },
            { block_group_No: 255 },
            { block_group_No: 256 },
            { block_group_No: 257 },
            { block_group_No: 258 },
            { block_group_No: 328 },
            { block_group_No: 329 },
            { block_group_No: 330 },
            { block_group_No: 331 },
            { block_group_No: 332 },
            { block_group_No: 333 },
            { block_group_No: 334 },
            { block_group_No: 335 },
            { block_group_No: 336 },
        ],
    ];

    const [auth, setAuth] = useState('student'); //권한
    const [isSelect, setIsSelect] = useState(false); //선택모드
    const [isMatching, setIsMatching] = useState(false); //

    const handleMode = mode => {
        if (mode === 1) {
            //초기화
            setIsMatching(false);
            window.postMessage({ id: 'onuii-time-table', name: 'setSelectMode', data: {} }, '*');
            window.postMessage({ id: 'onuii-time-table', name: 'setTeacher', data: {} }, '*');
        } else {
            //가매칭 - 수학
            setIsMatching(true);
            //가매칭 모드, LVT
            window.postMessage({ id: 'onuii-time-table', name: 'setSelectMode', data: { type: 'matching', lecture_subject_Id: 8906 } }, '*');
        }
    };
    const handleChoose = v => {
        window.postMessage({ id: 'onuii-time-table', name: 'setTeacher', data: teacherData[v] }, '*');
    };
    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'matchingObj':
                        // console.log(e.data.data.blocks, teacherData);
                        // const test = teacherData.map(ee => {
                        //     return _.intersectionBy(e.data.data.blocks, ee, 'block_group_No');
                        // });
                        // console.log(test);
                        e.data.data.blocks.length > 0 ? setIsSelect(true) : setIsSelect(false);
                        break;
                }
            }
        });
    }, []);
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <div style={{ height: '20px' }}></div>
            <input id="radio_1" type="radio" name="auth" value="student" onChange={e => setAuth(e.target.value)} defaultChecked={true} />
            <label htmlFor="radio_1">학생</label>
            <input id="radio_2" type="radio" name="auth" value="teacher" onChange={e => setAuth(e.target.value)} />
            <label htmlFor="radio_2">선생님</label>
            <input id="radio_3" type="radio" name="auth" value="admin" onChange={e => setAuth(e.target.value)} />
            <label htmlFor="radio_3">관리자</label>

            {auth === 'admin' && (
                <>
                    {isMatching && <button onClick={() => handleMode(1)}>가매칭모드 초기화</button>}
                    {!isMatching && <button onClick={() => handleMode(2)}>가매칭모드 - 수학</button>}
                </>
            )}
            {isSelect && (
                <select size="2">
                    <option onClick={() => handleChoose(0)}>후보 선생님 A</option>
                    <option onClick={() => handleChoose(1)}>후보 선생님 B</option>
                </select>
            )}
            <OnuiiTimeTable auth={auth} areaData={areaData} fixedItemData={fixedItemData} matchingItemData={matchingItemData} />
        </>
    );
};

export default App;
