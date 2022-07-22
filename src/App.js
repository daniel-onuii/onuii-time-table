import React from 'react';
import MainContainer from './container/MainContainer';
import RealContainer from './container/RealContainer';
const App = props => {
    return <MainContainer {...props} />;
    // return <RealContainer {...props} />;
};

export default App;
