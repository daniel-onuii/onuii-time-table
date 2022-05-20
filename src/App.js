import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import MainContainer from './container/MainContainer';
import { useDispatch } from 'react-redux';
import { initData } from './store/reducer/schedule.reducer';
import { schedule } from './util/schedule';
import { table } from './util/table';
const App = ({ areaData, itemData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const areaRowData = areaData ? areaData : [];
        const itemRowData = itemData ? itemData : [];
        const timeListData = schedule.getTimeList();

        const tableData = timeListData.map((e, i) => {
            return _.range(0, 7).map((e, ii) => {
                const idx = table.getBlockId(e, i);
                return { rowNum: i, seq: ii, block_group_No: idx };
            });
        });
        dispatch(
            initData({
                areaData: areaRowData,
                itemData: itemRowData,
                timeListData: timeListData,
                tableData: tableData,
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
