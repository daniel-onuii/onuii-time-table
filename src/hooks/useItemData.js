import { useState, useCallback, useEffect } from 'react';
import { lecture } from '../util/lecture';

function useItemData({ fixed, matching }) {
    const [fixedItemData, setFixedItemData] = useState(fixed);
    const [matchingItemData, setMatchingItemData] = useState(matching);
    const [fixedItemGroupData, setFixedItemGroupData] = useState([]);
    const [matchingItemGroupData, setMatchingItemGroupData] = useState([]);

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
        setFixedItemData: updateFixedItemData,
        setMatchingItemData: updateMatchingItemData,
    };
}

export default useItemData;
