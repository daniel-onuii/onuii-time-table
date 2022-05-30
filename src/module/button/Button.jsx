import React from 'react';
import styled from 'styled-components';
const Layout = styled.div`
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    outline: 0px;
    border: 0px;
    margin: 0px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500;
    font-size: 0.775rem;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    min-width: 64px;
    padding: 6px 16px;
    border-radius: 4px;
    color: white;
    &.blue {
        border: 1px solid #3f51b5;
        background: #3f51b5;
    }
    &.red {
        border: 1px solid #ec7063;
        background: #ec7063;
    }
    &.grey {
        border: 1px solid #aeb6bf;
        background: #aeb6bf;
    }
`;
function Button({ color, text, handleClick }) {
    return (
        <Layout className={color} onClick={handleClick}>
            {text}
        </Layout>
    );
}

export default Button;
