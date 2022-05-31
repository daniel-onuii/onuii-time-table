import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';

const App = ({ areaData, fixedItemData, matchingItemData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = areaData ? areaData : [];
        const fixedItemRowData = fixedItemData ? fixedItemData : [];
        const matchingItemRowData = matchingItemData ? matchingItemData : [];
        dispatch(
            initData({
                areaData: areaRowData,
                fixedItemData: fixedItemRowData,
                matchingItemData: matchingItemRowData,
            }),
        );
    }, []);
    return (
        <div>
            <MainContainer />
        </div>
    );
};

export default App;
