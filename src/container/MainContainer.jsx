import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TimeTable from '../component/TimeTable';

function MainContainer() {
    const { areaData, itemData } = useSelector(state => state.schedule);
    return <React.Fragment>{areaData && itemData && <TimeTable />}</React.Fragment>;
}

export default MainContainer;
