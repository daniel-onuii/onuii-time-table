import { useState, useCallback, useEffect } from 'react';
import { lecture } from '../util/lecture';

function useItemData({ fixed, matching }) {
    // 정규, 가매칭 관련
    const [fixedItemData, setFixedItemData] = useState(fixed);
    const [matchingItemData, setMatchingItemData] = useState(matching);
    const [fixedItemGroupData, setFixedItemGroupData] = useState([]);
    const [matchingItemGroupData, setMatchingItemGroupData] = useState([]);
    const [itemObj, setItemObj] = useState({});

    useEffect(() => {
        setFixedItemData(fixed);
        setMatchingItemData(matching);
    }, [fixed, matching]);

    useEffect(() => {
        const changeSundayDawnData = data => {
            return data.map(e => {
                return e.timeBlockId <= 5 ? { ...e, timeBlockId: e.timeBlockId + 672 } : { ...e, timeBlockId: e.timeBlockId };
            });
        };
        // setFixedItemGroupData(lecture.getGroupByLectureTime(fixedItemData));
        setFixedItemGroupData(lecture.getGroupByLectureTime(changeSundayDawnData(fixedItemData)));
        setMatchingItemGroupData(lecture.getGroupByLectureTime(changeSundayDawnData(matchingItemData)));
    }, [fixedItemData, matchingItemData]);

    const updateFixedItemData = useCallback(value => {
        setFixedItemData(value);
    }, []);
    const updateMatchingItemData = useCallback(value => {
        setMatchingItemData(value);
    }, []);

    return {
        fixedItemData: fixedItemData,
        matchingItemData: matchingItemData,
        fixedItemGroupData: fixedItemGroupData,
        matchingItemGroupData: matchingItemGroupData,
        itemObj: itemObj,
        setFixedItemData: updateFixedItemData,
        setMatchingItemData: updateMatchingItemData,
        setItemObj: setItemObj,
    };
}

export default useItemData;
