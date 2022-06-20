import React, { useEffect } from 'react';
import App from './App';
import { store } from './store/config';
import { Provider } from 'react-redux';

export const OnuiiTimeTable = props => {
    useEffect(() => {
        console.log(props.target);
    }, [props]);
    return (
        <Provider store={store}>
            <App {...props} />
        </Provider>
    );
};
