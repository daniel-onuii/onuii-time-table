import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';
import { setAuth, setInitAuth } from './store/reducer/user.reducer';
import { post } from './util/interface';

const App = props => {
    const [areaData, setAreaData] = useState();
    const [fixedItemData, setFixedItemData] = useState();
    const [matchingItemData, setMatchingItemData] = useState();
    const [auth, setAuth] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = props.areaData ? props.areaData : [];
        const fixedItemRowData = props.fixedItemData ? props.fixedItemData : [];
        const matchingItemRowData = props.matchingItemData ? props.matchingItemData : [];
        // dispatch(
        //     initData({
        //         areaData: areaRowData,
        //         fixedItemData: fixedItemRowData,
        //         matchingItemData: matchingItemRowData,
        //     }),
        // );
        setAreaData(areaRowData);
        setFixedItemData(fixedItemRowData);
        setMatchingItemData(matchingItemRowData);
        post.readyToListen(dispatch);
    }, []);
    useEffect(() => {
        setAuth(props.auth);
    }, [props.auth]);
    return <MainContainer />;
};

export default App;
