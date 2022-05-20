import React from 'react';
import styled from 'styled-components';
import FollowCursor from './FollowCursor';
import SelectLectureType from './SelectLectureType';
import TableBody from './TableBody';
import TableHead from './TableHead';

const Layout = styled.div`
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
    th,
    td {
        border-left: 1px solid #cdcdcd;
        text-align: center;
        height: 21px;
        vertical-align: middle;
        width: 10%;
        position: relative;
        padding: 0;
        border-spacing: 0;
        font-size: 12px;
    }
    td:hover {
        background: #cfcfcf;
        cursor: cell;
    }
    th:first-child {
        width: 12%;
    }
    .head {
        overflow-y: scroll;
    }
    .head th {
        height: 30px;
        font-size: 15px;
        color: #757575;
    }
    .contents {
        height: 504px;
        overflow-y: scroll;
    }
    .tr_parent {
        border-top: 1px solid #cdcdcd;
    }
    .tr_parent th {
        font-size: 15px;
        color: #757575;
    }
    .item {
        height: 100%;
        color: #b3b3b3;
    }
    .active {
        cursor: cell;
        width: 100%;
        height: 100%;
        background: #4eb6ac;
        color: white;
    }
    .weekend {
        background: #fef0f7;
    }
    .droptarget {
        float: left;
        width: 100px;
        height: 35px;
        margin: 15px;
        padding: 10px;
        border: 1px solid #aaaaaa;
    }
    .over {
        background: red !important;
        opacity: 0.5;
        position: absolute;
        width: 100%;
        top: 0;
    }
    input {
        width: 64px !important;
        margin: 0px !important;
        height: 16px !important;
        padding: 5px !important;
        font-size: 12px !important;
    }
    .dragging {
        background: #01a8fe !important;
        color: white;
    }
    .lecture_all {
        background: #4eb6ac;
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
    .lecture_9812 {
        background: plum;
    }
    button {
        color: white;
        border: 0px;
        padding: 5px;
        border-radius: 3px;
        margin: 6px 3px;
        width: 60px;
    }
`;

function TimeTable() {
    return (
        <React.Fragment>
            <Layout>
                <FollowCursor />
                <SelectLectureType />
                <TableHead />
                <TableBody />
            </Layout>
        </React.Fragment>
    );
}

export default TimeTable;
