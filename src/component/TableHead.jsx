import React from 'react';
import styled from 'styled-components';
const Layout = styled.div`
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
    .head {
        overflow-y: scroll;
    }
    .head th {
        height: 30px;
        font-size: 15px;
        color: #757575;
    }
`;
function TableHead() {
    return (
        <Layout>
            <div className="head">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>월</th>
                            <th>화</th>
                            <th>수</th>
                            <th>목</th>
                            <th>금</th>
                            <th>토</th>
                            <th style={{ color: 'red' }}>일</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Layout>
    );
}

export default TableHead;
