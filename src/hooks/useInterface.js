import { useState, useEffect } from 'react';
function useInterface(props) {
    const auth = props.auth; //고정됨
    const target = props.target; //고정됨
    const [userData, setUserData] = useState(props.userData); //user 정보
    const [filterData, setFilterData] = useState(); //postmessage
    const [subject, setSubject] = useState(null); //postmessage
    const [lvt, setLvt] = useState(null); //postmessage
    const [lessonTime, setLessonTime] = useState({});
    const [message, setMessage] = useState();

    useEffect(() => {
        setUserData(props.userData);
    }, [props.userData]);

    useEffect(() => {
        const lectureData = _.find(userData?.lectureData, { lectureVtId: Number(lvt) });
        setLessonTime({
            weekCount: Number(lectureData?.lesson_time?.split('_')[0]?.replace('W', '')),
            time: Number(lectureData?.lesson_time?.split('_')[1]?.replace('H', '')) / 15,
        });
    }, [lvt]);

    return {
        auth: auth,
        target: target,
        userData: userData,
        filterData: filterData,
        subject: subject,
        lvt: lvt,
        lessonTime: lessonTime,
        message: message,
        setUserData: setUserData,
        setFilterData: setFilterData,
        setSubject: setSubject,
        setLvt: setLvt,
        setMessage: setMessage,
    };
}
export default useInterface;
