import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TimeTable from '../component/TimeTable';

function MainContainer() {
    return (
        <React.Fragment>
            <TimeTable />
        </React.Fragment>
    );
}

export default MainContainer;