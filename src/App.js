import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import MainContainer from './container/MainContainer';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
const App = ({ areaData, itemData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = areaData ? areaData : [];
        const itemRowData = itemData ? itemData : [];
        dispatch(
            initData({
                areaData: areaRowData,
                itemData: itemRowData,
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
