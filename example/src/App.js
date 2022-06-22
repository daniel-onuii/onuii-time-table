import React, { useEffect, useState } from 'react';
import Control from './component/Control';
import { mock } from './mock/data';
import { getTimetable } from './mock/apiData';
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
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            <Layout>
                {/* <a>테슷</a>
                <OnuiiTimeTable
                    auth={'user'}
                    target={'student'}
                    blockData={getTimetable}
                    userData={mock.userData}
                    areaData={mock.areaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                /> */}
                <a>유저 - 학생</a>
                <OnuiiTimeTable
                    auth={'user'}
                    target={'student'}
                    userData={mock.userData}
                    areaData={mock.areaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                />
                <a>유저 - 선생님</a>
                <OnuiiTimeTable
                    auth={'user'}
                    target={'teacher'}
                    userData={mock.userData}
                    areaData={mock.teacherAreaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                />
            </Layout>
            <Control />
            <Layout>
                <a>관리자 - 학생</a>
                <OnuiiTimeTable auth={'admin'} target={'student'} areaData={[]} fixedItemData={[]} matchingItemData={[]} />
                <a>관리자 - 선생님</a>
                <OnuiiTimeTable auth={'admin'} target={'teacher'} areaData={[]} fixedItemData={[]} matchingItemData={[]} />
            </Layout>
        </>
    );
};

export default App;
