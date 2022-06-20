import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import TableHead from './TableHead';
import TableBody from './TableBody';
import { timeTable } from '../style/timeTable';
const Layout = styled.div`
    ${timeTable}
`;
function TimeTable(props) {
    return (
        <React.Fragment>
            <Layout>
                <TableHead />
                <TableBody {...props} />
            </Layout>
        </React.Fragment>
    );
}

export default TimeTable;
