import React, { useState } from 'react';
import Control from './component/Control';
import { mock } from './mock/data';
import { getTimetableS, getTimetableT } from './mock/apiData';
import { OnuiiTimeTable } from 'onuii-time-table';
import styled from 'styled-components';
import _ from 'lodash';
const Layout = styled.div`
    width: 100%;
    display: inline-block;
    > div {
        display: inline-block;
    }
    a {
        position: absolute;
        color: red;
    }
`;
const Main = styled.div``;
const App = () => {
    const [dataStudent, setDataStudent] = useState();
    const [dataTeacher, setDataTeacher] = useState();
    const [userInfo, setUserInfo] = useState();
    const [textArea, setTextArea] = useState();
    const [test, setTest] = useState();
    const handleChangeTest = () => {
        setTest(1);
    };

    const handleChange = e => {
        const getJson = JSON.parse(e.target.value);
        const test = getJson?.reduce((result, e) => {
            result.push({
                timeBlockId: e.block_group_No,
                lectureVtId: null,
                lectureSubjectIds: [...e.subject],
                tempLectureVtId: null,
            });
            return result;
        }, []);
        setDataStudent({ timeBlocks: test });
    };
    const processingData = [
        // {
        //     id: 6,
        //     subject: {
        //         subjectId: 9168,
        //         subjectName: '국어',
        //     },
        //     status: 'PROCESSING',
        // },
    ];

    return (
        <Main>
            {/* <h1 style={{ marginLeft: '20px' }}>take 1</h1> */}
            {/* <select onChange={handleChangeTest}>
                <option>test1</option>
                <option>test2</option>
            </select> */}
            <Control setDataStudent={setDataStudent} setDataTeacher={setDataTeacher} setUserInfo={setUserInfo} />
            {/* <textarea onChange={handleChange} value={textArea} /> */}
            <Layout>
                <OnuiiTimeTable auth={'user'} target={'student'} userData={mock.userData} blockData={dataStudent} processingData={processingData} />
                {/* <OnuiiTimeTable auth={'user'} target={'teacher'} userData={mock.userData} blockData={getTimetableT[0]} /> */}
            </Layout>
            {/* <Control setDataStudent={setDataStudent} setDataTeacher={setDataTeacher} setUserInfo={setUserInfo} />
            <Layout>
                <OnuiiTimeTable auth={'admin'} target={'student'} userData={mock.userData} blockData={dataStudent} />
                <OnuiiTimeTable auth={'admin'} target={'teacher'} userData={mock.userData} blockData={dataTeacher} />
            </Layout> */}
        </Main>
    );
};

export default App;
