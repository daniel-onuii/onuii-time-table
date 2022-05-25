import React from 'react';
import ShowData from '../component/debug/ShowData';
import { useSelector } from 'react-redux';

function DebugContainer() {
    const { areaData, itemData, itemGroupData, timeListData } = useSelector(state => state.schedule);

    return (
        <React.Fragment>
            <ShowData title={'areaData'} data={areaData} />
            <ShowData title={'itemData'} data={itemData} />
            <ShowData title={'itemGroupData'} data={itemGroupData} />
            <ShowData title={'timeListData'} data={timeListData} />
        </React.Fragment>
    );
}

export default DebugContainer;
