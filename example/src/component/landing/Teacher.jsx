import React from 'react';
import { OnuiiTimeTable } from 'onuii-time-table';
import { mock } from '../../mock/data';

function Teacher({ auth, target }) {
    return (
        <OnuiiTimeTable
            auth={auth}
            target={target}
            areaData={mock.teacherAreaData}
            fixedItemData={mock.fixedItemData}
            matchingItemData={mock.matchingItemData}
        />
    );
}

export default Teacher;
