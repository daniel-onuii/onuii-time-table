import React from 'react';

function TableHead() {
    return (
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
    );
}

export default TableHead;
