import React, { useState } from 'react';
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
    const [dataStudent, setDataStudent] = useState();
    const [dataTeacher, setDataTeacher] = useState();
    const [userInfo, setUserInfo] = useState();

    const [test, setTest] = useState();
    const handleChangeTest = () => {
        setTest(1);
    };
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <select onChange={handleChangeTest}>
                <option>test1</option>
                <option>test2</option>
            </select>
            <Layout>
                <OnuiiTimeTable auth={'user'} target={'student'} userData={mock.userData} blockData={getTimetableS[0]} />
                <OnuiiTimeTable auth={'user'} target={'teacher'} userData={mock.userData} blockData={getTimetableT[0]} />
            </Layout>
            <Control setDataStudent={setDataStudent} setDataTeacher={setDataTeacher} setUserInfo={setUserInfo} />
            <Layout>
                <OnuiiTimeTable auth={'admin'} target={'student'} userData={userInfo} blockData={dataStudent} />
                <OnuiiTimeTable auth={'admin'} target={'teacher'} userData={userInfo} blockData={dataTeacher} />
            </Layout>
        </>
    );
};

export default App;
