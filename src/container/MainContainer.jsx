import React from 'react';
import TimeTable from '../component/TimeTable';

function MainContainer(props) {
    return (
        <React.Fragment>
            <TimeTable {...props} />
        </React.Fragment>
    );
}

export default MainContainer;
