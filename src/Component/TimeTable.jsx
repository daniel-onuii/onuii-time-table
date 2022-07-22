import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import TableHead from './TableHead';
import TableBody from './TableBody';
import TableLecture from './TableLecture';
import { timeTable } from '../style/timeTable';
import useInterface from '../hooks/useInterface';
const Layout = styled.div`
    ${timeTable}
`;
function TimeTable(props) {
    const interfaceHook = useInterface(props);
    return (
        <Layout>
            <TableLecture interfaceHook={interfaceHook} />
            <TableHead interfaceHook={interfaceHook} />
            <TableBody {...props} interfaceHook={interfaceHook} />
        </Layout>
    );
}

export default TimeTable;
