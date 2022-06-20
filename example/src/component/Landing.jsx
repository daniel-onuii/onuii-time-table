import React from 'react';
import { OnuiiTimeTable } from 'onuii-time-table';
import { mock } from '../mock/data';

function Landing({ auth, target }) {
    return (
        <OnuiiTimeTable
            auth={auth}
            target={target}
            areaData={target === 'student' ? mock.areaData : mock.teacherAreaData}
            fixedItemData={target === 'student' ? mock.fixedItemData : []}
            matchingItemData={target === 'student' ? mock.matchingItemData : []}
        />
    );
}

export default Landing;
