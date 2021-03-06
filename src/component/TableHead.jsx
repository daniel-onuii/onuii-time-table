import React from 'react';
import styled from 'styled-components';
const Layout = styled.div`
    table {
        border-bottom: 1px solid #eee;
    }
    th,
    td {
        // border-left: 1px solid #eee;
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
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: #ccc;
        }
    }
    .head th {
        height: 30px;
        font-size: 15px;
        color: #14033e;
    }
`;
function TableHead({ interfaceHook }) {
    return (
        <Layout>
            <div style={{ height: '20px', color: 'red' }}>{interfaceHook.message}</div>
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
                            <th style={{ color: '#E03522' }}>일</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Layout>
    );
}

export default TableHead;
