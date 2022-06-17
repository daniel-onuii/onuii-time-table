import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import TableHead from './TableHead';
import TableBody from './TableBody';
const Layout = styled.div`
    th:first-child {
        width: 7%;
    }
    @media (min-width: 376px) {
        width: 700px;
    }
    @media (max-width: 375px) {
        width: 375px;
        th:first-child {
            font-size: 10px;
            width: 9%;
        }
    }
    margin: auto;
    body::-webkit-scrollbar {
        display: none;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .area._18492 {
        background: red;
    }
    .area._9170 {
        background: green;
    }
    .area._8906 {
        background: coral;
    }
    .area._9168 {
        background: cornflowerblue;
    }
    .area._9169 {
        background: yellowgreen;
    }
    .area._9171 {
        background: plum;
    }
    .area._9813 {
        background: steelblue;
    }
    .area.disabled {
        opacity: 0.2;
    }
`;

function TimeTable(props) {
    return (
        <React.Fragment>
            <Layout>
                <TableHead />
                <TableBody
                    auth={props.auth}
                    areaData={props.areaData}
                    fixedItemData={props.fixedItemData}
                    matchingItemData={props.matchingItemData}
                />
            </Layout>
        </React.Fragment>
    );
}

export default TimeTable;
