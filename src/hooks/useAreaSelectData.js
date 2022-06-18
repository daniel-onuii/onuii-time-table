import { useState, useCallback } from 'react';

function useAreaSelectData() {
    const [lecture, setLecture] = useState([]); //과목 드래그 영역
    const [filter, setFilter] = useState([]); //가매칭 필터 영역
    const [matchingTarget, setMatchingTarget] = useState([]); // 가매칭 추가 대상 영역

    const updateLecture = useCallback(value => {
        setLecture(value);
    }, []);
    const updateFilter = useCallback(value => {
        setFilter(value);
    }, []);
    const updateMatchingTaregt = useCallback(value => {
        setMatchingTarget(value);
    }, []);

    return {
        lecture: lecture,
        filter: filter,
        matchingTarget: matchingTarget,
        setLecture: updateLecture,
        setFilter: updateFilter,
        setMatchingTarget: updateMatchingTaregt,
    };
}

export default useAreaSelectData;
