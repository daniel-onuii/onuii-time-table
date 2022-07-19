import { useState, useCallback, useEffect } from 'react';
import { area } from '../util/area';

function useAreaData(data) {
    //과외 희망 시간대 관련
    const [areaData, setAreaData] = useState(data); //희망 시간 데이터
    const [areaGroupData, setAreaGroupData] = useState([]); //희망 시간 그룹 데이터
    const [areaObj, setAreaObj] = useState({});
    const [isAreaClickDown, setIsAreaClickDown] = useState(false);
    const [isAreaAppend, setIsAreaAppend] = useState(false);
    const [idxOnOver, setIdxOnOver] = useState(null);

    const [isLongTouch, setIsLongTouch] = useState(false); //길게누름 여부
    const [touchIdx, setTouchIdx] = useState(null); //mobile이벤트의 발생여부를 관여
    const [holdInterval, setHoldInterval] = useState();
    const [holdCount, setHoldCount] = useState();
    const [isHoldOver, setIsHoldOver] = useState(false);

    useEffect(() => {
        const changeSundayDawnData = data.map(e => {
            return e.timeBlockId <= 5 ? { ...e, timeBlockId: e.timeBlockId + 672 } : { ...e, timeBlockId: e.timeBlockId };
        });
        setAreaData(changeSundayDawnData);
    }, [data]);

    const updateAreaData = useCallback(value => {
        setAreaData(value);
    }, []);
    useEffect(() => {
        setAreaGroupData(area.getAreaGroupData(areaData));
    }, [areaData]);
    return {
        areaData: areaData,
        areaGroupData: areaGroupData,
        areaObj: areaObj,
        isAreaClickDown: isAreaClickDown,
        isAreaAppend: isAreaAppend,
        isLongTouch: isLongTouch,
        holdInterval: holdInterval,
        holdCount: holdCount,
        isHoldOver: isHoldOver,
        touchIdx: touchIdx,
        idxOnOver: idxOnOver,
        setIdxOnOver: setIdxOnOver,
        setAreaData: updateAreaData,
        setAreaObj: setAreaObj,
        setIsAreaClickDown: setIsAreaClickDown,
        setIsAreaAppend: setIsAreaAppend,
        setIsLongTouch: setIsLongTouch,
        setHoldInterval: setHoldInterval,
        setHoldCount: setHoldCount,
        setIsHoldOver: setIsHoldOver,
        setTouchIdx: setTouchIdx,
    };
}

export default useAreaData;
