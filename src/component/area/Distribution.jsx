import React from 'react';
import styled from 'styled-components';
const Layout = styled.div.attrs({
    className: 'ignoreEnter',
})`
    display: flex;
    position: absolute;
    top: 0px;
    right: 0px;
`;
const Circle = styled.div`
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${props => (props.level == 1 ? '#2ecc71' : props.level == 2 ? 'gold' : 'red')};
    margin: 3px;
`;
function Distribution({ level }) {
    return (
        <Layout>
            <Circle level={level} />
        </Layout>
    );
}

export default Distribution;
