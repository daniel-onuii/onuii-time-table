import React from 'react';

import { OnuiiTimeTable } from 'onuii-time-table';
import 'onuii-time-table/dist/index.css';

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
    const itemData = [
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

    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <div style={{ height: '20px' }}></div>
            <OnuiiTimeTable areaData={areaData} itemData={itemData} />
        </>
    );
};

export default App;
