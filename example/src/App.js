import React, { useEffect, useState } from 'react';

import { OnuiiTimeTable } from 'onuii-time-table';
// import 'onuii-time-table/dist/index.css';

const App = () => {
    const areaData = [
        { block_group_No: 36, areaActiveType: ['8906', '9168'] },
        { block_group_No: 37 },
        { block_group_No: 135, areaActiveType: ['8906'] },
        { block_group_No: 136, areaActiveType: ['8906'] },
        { block_group_No: 137, areaActiveType: ['8906'] },
        { block_group_No: 138, areaActiveType: ['8906'] },
        { block_group_No: 139, areaActiveType: ['8906'] },
        { block_group_No: 140, areaActiveType: ['8906'] },
        { block_group_No: 141, areaActiveType: ['8906'] },
        { block_group_No: 142, areaActiveType: ['8906'] },
        { block_group_No: 143, areaActiveType: ['8906'] },
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
        { block_group_No: 236, lecture_subject_Id: 9171 },
        { block_group_No: 237, lecture_subject_Id: 9171 },
        { block_group_No: 238, lecture_subject_Id: 9171 },
        { block_group_No: 239, lecture_subject_Id: 9171 },
    ];

    const [auth, setAuth] = useState('student');
    const [selectMode, setSelectMode] = useState({});

    const handleMode = mode => {
        if (mode == 1) {
            window.postMessage({ id: 'onuii-time-table', name: 'init', target: 'matching' }, '*');
        } else {
            setSelectMode({ type: 'matching', lecture_subject_Id: 8906 });
        }
    };
    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                console.log(e.data);
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

            {auth == 'admin' && (
                <>
                    <button onClick={() => handleMode(1)}>가매칭 초기화</button>
                    <button onClick={() => handleMode(2)}>가매칭 - 예)수학</button>
                </>
            )}
            <OnuiiTimeTable
                auth={auth}
                selectMode={selectMode}
                areaData={areaData}
                fixedItemData={fixedItemData}
                matchingItemData={matchingItemData}
            />
        </>
    );
};

export default App;
