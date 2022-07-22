import { useState } from 'react';

function useMapData() {
    const [keyword, setKeyword] = useState();

    return {
        keyword: keyword,
        setKeyword: setKeyword,
    };
}

export default useMapData;
