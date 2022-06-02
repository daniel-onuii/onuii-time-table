import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';
import { setInitAuth } from './store/reducer/user.reducer';

const App = ({ auth, selectMode, areaData, fixedItemData, matchingItemData }) => {
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
    useEffect(() => {
        dispatch(
            setInitAuth({
                auth: auth,
                selectMode: selectMode,
            }),
        );
    }, [auth, selectMode]);
    return <MainContainer />;
};

export default App;
