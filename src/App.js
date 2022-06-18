import React from 'react';
import MainContainer from './container/MainContainer';
const App = props => {
    return (
        <MainContainer auth={props.auth} areaData={props.areaData} fixedItemData={props.fixedItemData} matchingItemData={props.matchingItemData} />
    );
};

export default App;
