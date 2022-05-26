import React from 'react';

function Button({ title, handleClick }) {
    return <div onClick={handleClick}>{/* <label>!{title}</label> */}</div>;
}

export default Button;
