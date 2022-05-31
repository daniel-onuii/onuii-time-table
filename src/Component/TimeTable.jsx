import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import TableHead from './TableHead';
import TableBody from './TableBody';
// import imgTest from '../asset/icon/ic-card.png';
const Layout = styled.div`
    width: 800px;
    margin: auto;
    body::-webkit-scrollbar {
        display: none;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #cdcdcd;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    th:first-child {
        width: 12%;
    }
    .lecture_all {
        background: #d0ece7;
    }
    .lecture_8906 {
        background: coral;
    }
    .lecture_9168 {
        background: cornflowerblue;
    }
    .lecture_9169 {
        background: yellowgreen;
    }
    .lecture_9171 {
        background: plum;
    }
`;

function TimeTable() {
    return (
        <React.Fragment>
            <Layout>
                {/* <img src={imgTest} /> */}
                {/* <img src="../../asset/icon/ic-card.png" /> */}
                {/* <FollowCursor /> */}
                <TableHead />
                <TableBody />
            </Layout>
        </React.Fragment>
    );
}

export default TimeTable;
