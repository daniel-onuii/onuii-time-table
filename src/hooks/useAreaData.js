import { useState, useCallback, useEffect } from 'react';
import { area } from '../util/area';

function useAreaData(data) {
    const [areaData, setAreaData] = useState(data);
    const [areaGroupData, setAreaGroupData] = useState([]);

    const updateAreaData = useCallback(value => {
        setAreaData(value);
    }, []);

    useEffect(() => {
        setAreaGroupData(area.getAreaGroupData(areaData));
    }, [areaData]);
    return {
        areaData: areaData,
        areaGroupData: areaGroupData,
        setAreaData: updateAreaData,
    };
}

export default useAreaData;
