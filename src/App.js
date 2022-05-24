import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import MainContainer from './container/MainContainer';
import DebugContainer from './container/DebugContainer';
// import 'react-toastify/dist/ReactToastify.css';

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
            <DebugContainer />
        </div>
    );
};

export default App;
