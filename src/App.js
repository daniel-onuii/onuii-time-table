import React from 'react';
import TimeTable from './component/TimeTable';
import { ToastContainer } from 'react-toastify';
const App = ({ areaData, itemData }) => {
    return (
        <div>
            <ToastContainer />
            <TimeTable areaData={areaData} itemData={itemData} />
        </div>
    );
};

export default App;
