import { useState, useCallback, useEffect } from 'react';
import { area } from '../util/area';

function useAreaData(data) {
    //과외 희망 시간대 관련
    const [areaData, setAreaData] = useState(data); //희망 시간 데이터
    const [areaGroupData, setAreaGroupData] = useState([]); //희망 시간 그룹 데이터
    const [areaObj, setAreaObj] = useState({});
    const [isAreaClickDown, setIsAreaClickDown] = useState(false);
    const [isAreaAppend, setIsAreaAppend] = useState(false);

    useEffect(() => {
        setAreaData(data);
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
        setAreaData: updateAreaData,
        setAreaObj: setAreaObj,
        setIsAreaClickDown: setIsAreaClickDown,
        setIsAreaAppend: setIsAreaAppend,
    };
}

export default useAreaData;
