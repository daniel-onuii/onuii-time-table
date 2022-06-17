import React from 'react';
import { OnuiiTimeTable } from 'onuii-time-table';
import { mock } from '../mock/data';
import styled from 'styled-components';
const Layout = styled.div`
    display: inline-block;
    > div {
        display: inline-block;
    }
`;
function Admin({ auth }) {
    return (
        <React.Fragment>
            <Layout>
                <OnuiiTimeTable
                    auth={auth}
                    areaData={mock.areaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                    test={1}
                />
            </Layout>
            <Layout>
                <OnuiiTimeTable auth={auth} test={2} />
            </Layout>
        </React.Fragment>
    );
}

export default Admin;
