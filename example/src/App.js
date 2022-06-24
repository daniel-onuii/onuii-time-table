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
    const [teacherInfo, setTeacherInfo] = useState();
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <Layout>
                <a>유저 - 학생</a>
                <OnuiiTimeTable auth={'user'} target={'student'} userData={mock.userData} blockData={getTimetableS[0]} />
                <a>유저 - 선생님</a>
                <OnuiiTimeTable auth={'user'} target={'teacher'} userData={mock.userData} blockData={getTimetableT[0]} />
            </Layout>
            <Control setDataStudent={setDataStudent} setDataTeacher={setDataTeacher} setUserInfo={setUserInfo} setTeacherInfo={setTeacherInfo} />
            <Layout>
                <a>관리자 - 학생</a>
                <OnuiiTimeTable auth={'admin'} target={'student'} userData={userInfo} blockData={dataStudent} />
                <a>관리자 - 선생님</a>
                <OnuiiTimeTable auth={'admin'} target={'teacher'} userData={teacherInfo} blockData={dataTeacher} />
            </Layout>
        </>
    );
};

export default App;
