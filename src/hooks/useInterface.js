import { useState, useCallback, useEffect } from 'react';
function useInterface(props) {
    const [userData, setUserData] = useState(props.userData); //user 정보
    const auth = props.auth; //고정됨
    const target = props.target; //고정됨
    const [teacherData, setTeacherData] = useState(); //postmessage
    const [subject, setSubject] = useState(null); //postmessage

    useEffect(() => {
        setUserData(props.userData);
    }, [props.userData]);

    const updateTeacherData = useCallback(value => {
        setTeacherData(value);
    }, []);

    return {
        userData: userData,
        teacherData: teacherData,
        auth: auth,
        target: target,
        subject: subject,
        setUserData: setUserData,
        setTeacherData: updateTeacherData,
        setSubject: setSubject,
    };
}
export default useInterface;
