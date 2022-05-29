import React from 'react';

import styled from 'styled-components';
const Layout = styled.div`
    display: flex;
    align-items: center;
    label {
        font-size: 0.875rem;
    }
`;
function Input({ text, id, value, checked, handleChange }) {
    return (
        <Layout>
            <input type="checkbox" id={id} value={value} onChange={handleChange} checked={checked} />
            <label htmlFor={id}>{text}</label>
        </Layout>
    );
}
export default Input;
