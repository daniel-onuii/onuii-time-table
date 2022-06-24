import { useState, useCallback, useEffect } from 'react';
function useInterface(props) {
    const [userData, setUserData] = useState(props.userData); //user 정보
    const auth = props.auth; //고정됨
    const target = props.target; //고정됨
    const [filterData, setFilterData] = useState(); //postmessage
    const [subject, setSubject] = useState(null); //postmessage

    useEffect(() => {
        setUserData(props.userData);
    }, [props.userData]);

    return {
        userData: userData,
        auth: auth,
        target: target,
        subject: subject,
        filterData: filterData,
        setUserData: setUserData,
        setFilterData: setFilterData,
        setSubject: setSubject,
    };
}
export default useInterface;
