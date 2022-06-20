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
                    target={'student'}
                    areaData={mock.areaData}
                    fixedItemData={mock.fixedItemData}
                    matchingItemData={mock.matchingItemData}
                />
            </Layout>
            <Layout>
                <OnuiiTimeTable auth={auth} target={'teacher'} areaData={[]} fixedItemData={[]} matchingItemData={[]} />
            </Layout>
        </React.Fragment>
    );
}

export default Admin;
