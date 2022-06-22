import React, { useEffect, useState } from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';
import _ from 'lodash';

export const OnuiiTimeTable = props => {
    const [areaData, setAreaData] = useState();
    const [fixedItemData, setFixedItemData] = useState();
    const [matchingItemData, setMatchingItemData] = useState();
    // const areaData = props.blockData?.timeBlocks.reduce((result, e) => {
    //     // !_.isEmpty(e.lectureSubjectIds) &&
    //     result.push({
    //         timeBlockId: e.timeBlockId,
    //         lectureSubjectIds: _.isEmpty(e.lectureSubjectIds) ? ['all'] : e.lectureSubjectIds,
    //     });
    //     return result;
    // }, []);

    // const fixedItemData = props.blockData?.timeBlocks.reduce((result, e) => {
    //     !_.isEmpty(e.lectureVtId) ||
    //         (!_.isNull(e.lectureVtId) &&
    //             result.push({
    //                 timeBlockId: e.timeBlockId,
    //                 lectureId: _.find(props.userData?.lectureData, { lectureVtId: e.lectureVtId }).lectureId,
    //                 lectureVtId: e.lectureVtId,
    //             }));
    //     return result;
    // }, []);

    // const matchingItemData = props.blockData?.timeBlocks.reduce((result, e) => {
    //     !_.isEmpty(e.tempLectureVtId) ||
    //         (!_.isNull(e.tempLectureVtId) &&
    //             result.push({
    //                 timeBlockId: e.timeBlockId,
    //                 lectureId: _.find(props.userData?.lectureData, { lectureVtId: e.tempLectureVtId }).lectureId,
    //                 lectureVtId: e.tempLectureVtId,
    //             }));
    //     return result;
    // }, []);
    useEffect(() => {
        const areaDatat = props.blockData?.timeBlocks.reduce((result, e) => {
            // !_.isEmpty(e.lectureSubjectIds) &&
            result.push({
                timeBlockId: e.timeBlockId,
                lectureSubjectIds: _.isEmpty(e.lectureSubjectIds) ? ['all'] : e.lectureSubjectIds,
            });
            return result;
        }, []);

        const fixedItemDatat = props.blockData?.timeBlocks.reduce((result, e) => {
            !_.isEmpty(e.lectureVtId) ||
                (!_.isNull(e.lectureVtId) &&
                    result.push({
                        timeBlockId: e.timeBlockId,
                        lectureId: _.find(props.userData?.lectureData, { lectureVtId: e.lectureVtId }).lectureId,
                        lectureVtId: e.lectureVtId,
                    }));
            return result;
        }, []);

        const matchingItemDatat = props.blockData?.timeBlocks.reduce((result, e) => {
            !_.isEmpty(e.tempLectureVtId) ||
                (!_.isNull(e.tempLectureVtId) &&
                    result.push({
                        timeBlockId: e.timeBlockId,
                        lectureId: _.find(props.userData?.lectureData, { lectureVtId: e.tempLectureVtId }).lectureId,
                        lectureVtId: e.tempLectureVtId,
                    }));
            return result;
        }, []);
        setAreaData(areaDatat);
        setFixedItemData(fixedItemDatat);
        setMatchingItemData(matchingItemDatat);
        console.log(props);
    }, [props]);
    return (
        <Provider store={store}>
            <App {...props} areaData={areaData} fixedItemData={fixedItemData} matchingItemData={matchingItemData} />
        </Provider>
    );
};
