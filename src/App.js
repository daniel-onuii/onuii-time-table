import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import MainContainer from './container/MainContainer';
import { useDispatch } from 'react-redux';
import { setAreaData, setItemData } from './store/reducer/schedule.reducer';
const App = ({ areaData, itemData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = areaData ? areaData : [];
        const itemRowData = itemData ? itemData : [];
        dispatch(setAreaData(areaRowData));
        dispatch(setItemData(itemRowData));
    }, []);
    return (
        <div>
            <ToastContainer />
            <MainContainer />
        </div>
    );
};

export default App;
