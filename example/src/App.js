import React, { useEffect, useState } from 'react';
import Control from './component/Control';
import { mock } from './mock/data';
import { getTimetableS, getTimetableT } from './mock/apiData';
import { OnuiiTimeTable } from 'onuii-time-table';
import styled from 'styled-components';
import _ from 'lodash';
const Layout = styled.div`
    display: inline-block;
    > div {
        display: inline-block;
    }
    a {
        position: absolute;
        color: red;
    }
`;

const App = () => {
    const [test, setTest] = useState(getTimetableS);
    const handleclick = () => {
        setTest(getTimetableT);
    };
    return (
        <>
            <button onClick={handleclick}>test</button>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <Layout>
                <a>유저 - 학생</a>
                <OnuiiTimeTable auth={'user'} target={'student'} userData={mock.userData} blockData={getTimetableS} />
                <a>유저 - 선생님</a>
                <OnuiiTimeTable auth={'user'} target={'teacher'} userData={mock.userData} blockData={getTimetableT} />
            </Layout>
            <Control />
            <Layout>
                <a>관리자 - 학생</a>
                <OnuiiTimeTable auth={'admin'} target={'student'} userData={mock.userData} blockData={getTimetableS} />
                <a>관리자 - 선생님</a>
                <OnuiiTimeTable auth={'admin'} target={'teacher'} userData={mock.userData} blockData={getTimetableT} />
            </Layout>
        </>
    );
};

export default App;
