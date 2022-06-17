import React from 'react';
import { OnuiiTimeTable } from 'onuii-time-table';
import { mock } from '../mock/data';

function Landing({ auth }) {
    return <OnuiiTimeTable auth={auth} areaData={mock.areaData} fixedItemData={mock.fixedItemData} matchingItemData={mock.matchingItemData} />;
}

export default Landing;
