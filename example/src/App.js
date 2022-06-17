import React, { useState } from 'react';
import _ from 'lodash';
import Control from './component/Control';
import Admin from './component/Admin';
import Landing from './component/Landing';

const App = () => {
    const [auth, setAuth] = useState('student'); //권한
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <div style={{ height: '20px' }}></div>
            <Control auth={auth} setAuth={setAuth} />
            {auth === 'admin' ? <Admin auth={auth} /> : <Landing auth={auth} />}
        </>
    );
};

export default App;
