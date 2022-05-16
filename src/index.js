import React, { useEffect } from 'react';
import styles from './styles.module.css';
import TimeTable from './component/TimeTable';
// import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const OnuiiTimeTable = ({ areaData, itemData }) => {
    return (
        <div>
            <ToastContainer />
            <TimeTable areaData={areaData} itemData={itemData} />
        </div>
    );
};
