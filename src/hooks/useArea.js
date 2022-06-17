import { useState, useCallback } from 'react';

function useArea(initialForm) {
    const [test, setTest] = useState(initialForm);
    // change
    const onChange = useCallback(e => {
        setTest(true);
    }, []);
    const reset = useCallback(() => setTest(initialForm), [initialForm]);
    return [test, onChange, reset];
}

export default useArea;
