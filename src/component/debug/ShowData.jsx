import React from 'react';
import ReactJson from 'react-json-view';

function ShowData({ title, data }) {
    return (
        <React.Fragment>
            <div style={{ border: '1px solid #cdcdcd', width: '24.5%', display: 'inline-block' }}>
                <h3 style={{ marginLeft: '20px' }}>{title}</h3>
                <div style={{ minHeight: '500px', maxHeight: '500px', overflow: 'auto' }}>
                    <ReactJson src={data} theme="monokai" />
                </div>
            </div>
        </React.Fragment>
    );
}

export default ShowData;
