import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import MainContainer from './container/MainContainer';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import { schedule } from './util/schedule';
const App = ({ areaData, itemData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = areaData ? areaData : [];
        const itemRowData = itemData ? itemData : [];
        dispatch(
            initData({
                areaData: areaRowData,
                itemData: itemRowData,
                timeListData: schedule.getTimeList(),
            }),
        );
    }, []);
    return (
        <div>
            <ToastContainer />
            <MainContainer />
        </div>
    );
};

export default App;
