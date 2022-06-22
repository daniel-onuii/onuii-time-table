import React, { useEffect, useState } from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';
import _ from 'lodash';
import { schedule } from './util/schedule';

export const OnuiiTimeTable = props => {
    const [userData, setUserData] = useState();
    const [areaData, setAreaData] = useState();
    const [fixedItemData, setFixedItemData] = useState();
    const [matchingItemData, setMatchingItemData] = useState();
    useEffect(() => {
        setUserData(props?.userData);
        setAreaData(schedule.getParseAreaData(props?.blockData?.timeBlocks) || []);
        setFixedItemData(schedule.getParseFixedData(props?.blockData?.timeBlocks, props.userData?.lectureData) || []);
        setMatchingItemData(schedule.getParseMatchingData(props?.blockData?.timeBlocks, props.userData?.lectureData) || []);
    }, [props]);
    return (
        <Provider store={store}>
            <App {...props} userData={userData} areaData={areaData} fixedItemData={fixedItemData} matchingItemData={matchingItemData} />
        </Provider>
    );
};
