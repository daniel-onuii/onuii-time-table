import React from 'react';
import TimeTable from '../component/TimeTable';

function MainContainer(props) {
    return (
        <React.Fragment>
            <TimeTable auth={props.auth} areaData={props.areaData} fixedItemData={props.fixedItemData} matchingItemData={props.matchingItemData} />
        </React.Fragment>
    );
}

export default MainContainer;
