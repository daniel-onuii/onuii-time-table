import React from 'react';

import { OnuiiTimeTable } from 'onuii-time-table';
import 'onuii-time-table/dist/index.css';

const App = () => {
    const areaData = [{ block_group_No: 36 }, { block_group_No: 37 }];
    const itemData = [
        { block_group_No: 36, lecture_subject_Id: 9812 },
        { block_group_No: 37, lecture_subject_Id: 9812 },
        { block_group_No: 38, lecture_subject_Id: 9812 },
        { block_group_No: 39, lecture_subject_Id: 9812 },
        { block_group_No: 40, lecture_subject_Id: 9812 },
        { block_group_No: 41, lecture_subject_Id: 9812 },
        { block_group_No: 98, lecture_subject_Id: 9812 },
        { block_group_No: 99, lecture_subject_Id: 9812 },
        { block_group_No: 100, lecture_subject_Id: 9812 },
        { block_group_No: 101, lecture_subject_Id: 9812 },
    ];

    return (
        <>
            <span>테스트환경</span>
            <OnuiiTimeTable areaData={areaData} itemData={itemData} />
        </>
    );
};

export default App;
