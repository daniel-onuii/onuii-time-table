import React from 'react';
import styled from 'styled-components';
import RealMain from '../component/RealEstate/RealMain';
const Layout = styled.div`
    width: 375px;
`;
function RealContainer() {
    return (
        <React.Fragment>
            <RealMain />
        </React.Fragment>
    );
}

export default RealContainer;
