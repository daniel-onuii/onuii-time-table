import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';
import { setAuth, setInitAuth } from './store/reducer/user.reducer';
import { post } from './util/interface';

const App = ({ auth, areaData, fixedItemData, matchingItemData }) => {
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
        post.readyToListen(dispatch);
    }, []);
    useEffect(() => {
        dispatch(setAuth(auth));
    }, [auth]);
    return <MainContainer />;
};

export default App;
