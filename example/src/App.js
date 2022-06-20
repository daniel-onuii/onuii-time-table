import React, { useState } from 'react';
import Control from './component/Control';
import Admin from './component/Admin';
import Landing from './component/Landing';
import { mock } from './mock/data';
import { OnuiiTimeTable } from 'onuii-time-table';
import styled from 'styled-components';
const Layout = styled.div`
    display: inline-block;
    > div {
        display: inline-block;
    }
`;

const App = () => {
    const [auth, setAuth] = useState('user'); //유저, 관리자
    const [target, setTarget] = useState('student'); //학생, 선생님
    return (
        <>
            <h1 style={{ marginLeft: '20px' }}>타임테이블</h1>
            {/* {auth === 'admin' ? <Admin auth={auth} /> : <Landing auth={auth} target={target} />} */}
            <Layout>
                <OnuiiTimeTable
                    auth={'user'}
                    target={'student'}
                    areaData={mock.areaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                />
                <OnuiiTimeTable
                    auth={'user'}
                    target={'teacher'}
                    areaData={mock.teacherAreaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                />
            </Layout>
            <Control auth={auth} setAuth={setAuth} target={target} setTarget={setTarget} />
            <Layout>
                <OnuiiTimeTable
                    auth={'admin'}
                    target={'student'}
                    areaData={mock.areaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                />
                <OnuiiTimeTable auth={'admin'} target={'teacher'} areaData={[]} fixedItemData={[]} matchingItemData={[]} />
            </Layout>
        </>
    );
};

export default App;
