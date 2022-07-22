import React from 'react';

function SearchBar({ mapHook }) {
    const handleChangeKeyword = e => {
        mapHook.setKeyword(e.target.value);
    };
    return (
        <div>
            <input type="text" onChange={handleChangeKeyword} />
            <button>검색</button>
        </div>
    );
}

export default SearchBar;
