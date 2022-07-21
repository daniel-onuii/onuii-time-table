import React, { memo, useEffect, useState } from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';
import { schedule } from './util/schedule';
import { lecture } from './util/lecture';
import _ from 'lodash';

export const OnuiiTimeTable = memo(props => {
    const [userData, setUserData] = useState();
    const [areaData, setAreaData] = useState();
    const [fixedItemData, setFixedItemData] = useState();
    const [matchingItemData, setMatchingItemData] = useState();
    useEffect(() => {
        !_.isEmpty(props.subjectData) && lecture.setLectureList(props.subjectData); //과목의 정보 셋팅
        !_.isEmpty(props.processingData) && schedule.setProcessingData(props.processingData); //과목의 정보 셋팅

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
});
