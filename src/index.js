import React from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';

export const OnuiiTimeTable = props => {
    return (
        <Provider store={store}>
            <App auth={props.auth} areaData={props.areaData} fixedItemData={props.fixedItemData} matchingItemData={props.matchingItemData} />
        </Provider>
    );
};
