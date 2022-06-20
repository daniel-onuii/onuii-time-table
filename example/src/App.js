import React, { useState } from 'react';
import Control from './component/Control';
import Admin from './component/Admin';
import Student from './component/landing/Student';
import Teacher from './component/landing/Teacher';

const App = () => {
    const [auth, setAuth] = useState('user'); //유저, 관리자
    const [target, setTarget] = useState('student'); //학생, 선생님
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <Control auth={auth} setAuth={setAuth} target={target} setTarget={setTarget} />
            {auth === 'admin' ? (
                <Admin auth={auth} />
            ) : target === 'student' ? (
                <Student auth={auth} target={target} />
            ) : (
                <Teacher auth={auth} target={target} />
            )}
        </>
    );
};

export default App;
