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
        setFixedItemGroupData(lecture.getGroupByLectureTime(fixedItemData));
        setMatchingItemGroupData(lecture.getGroupByLectureTime(matchingItemData));
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
