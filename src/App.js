import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';
import { setAuth, setInitAuth } from './store/reducer/user.reducer';
import { post } from './util/interface';

const App = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        post.readyToListen(dispatch);
    }, []);
    return (
        <MainContainer auth={props.auth} areaData={props.areaData} fixedItemData={props.fixedItemData} matchingItemData={props.matchingItemData} />
    );
};

export default App;
