import React from 'react';
import styled from 'styled-components';
const Layout = styled.div.attrs({
    className: 'ignoreEnter',
})`
    display: flex;
    position: absolute;
    top: 0px;
`;
const Circle = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => (props.level == 1 ? '#2ecc71' : props.level == 2 ? 'gold' : 'red')};
    margin: 3px;
`;
const Text = styled.span`
    color: ${props => (props.level == 1 ? 'green' : props.level == 2 ? 'gold' : 'red')};
`;
function Distribution({ level }) {
    return (
        <Layout>
            <Circle level={level} />
            <Text level={level}>{level == 1 ? '원활' : level == 2 ? '보통' : '혼잡'}</Text>
        </Layout>
    );
}

export default Distribution;
