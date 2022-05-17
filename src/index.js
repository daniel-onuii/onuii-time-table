import React, { useEffect } from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';

export const OnuiiTimeTable = ({ areaData, itemData }) => {
    return (
        <Provider store={store}>
            <App areaData={areaData} itemData={itemData} />;
        </Provider>
    );
};
