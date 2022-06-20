import React from 'react';
import { OnuiiTimeTable } from 'onuii-time-table';
import { mock } from '../../mock/data';

function Student({ auth, target }) {
    return (
        <OnuiiTimeTable
            auth={auth}
            target={target}
            areaData={mock.areaData}
            fixedItemData={mock.fixedItemData}
            matchingItemData={mock.matchingItemData}
        />
    );
}

export default Student;
