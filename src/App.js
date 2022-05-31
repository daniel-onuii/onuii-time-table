import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';

const App = ({ areaData, itemData, matchingItemData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = areaData ? areaData : [];
        const itemRowData = itemData ? itemData : [];
        const matchingItemRowData = matchingItemData ? matchingItemData : [];
        dispatch(
            initData({
                areaData: areaRowData,
                itemData: itemRowData,
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
