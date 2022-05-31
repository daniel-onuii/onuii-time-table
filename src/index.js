import React from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';

export const OnuiiTimeTable = ({ areaData, fixedItemData, matchingItemData }) => {
    return (
        <Provider store={store}>
            <App areaData={areaData} fixedItemData={fixedItemData} matchingItemData={matchingItemData} />
        </Provider>
    );
};
