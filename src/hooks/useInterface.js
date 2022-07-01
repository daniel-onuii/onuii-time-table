import { useState, useEffect } from 'react';
function useInterface(props) {
    const [userData, setUserData] = useState(props.userData); //user 정보
    const auth = props.auth; //고정됨
    const target = props.target; //고정됨
    const [filterData, setFilterData] = useState(); //postmessage
    const [subject, setSubject] = useState(null); //postmessage
    const [lvt, setLvt] = useState(null); //postmessage
    const [lessonTime, setLessonTime] = useState({});

    useEffect(() => {
        setUserData(props.userData);
    }, [props.userData]);

    useEffect(() => {
        const lectureData = _.find(userData?.lectureData, { lectureVtId: lvt });
        setLessonTime({
            weekCount: Number(lectureData?.lesson_time?.split('_')[0]?.replace('W', '')),
            time: Number(lectureData?.lesson_time?.split('_')[1]?.replace('H', '')) / 15,
        });
    }, [lvt]);

    return {
        userData: userData,
        auth: auth,
        target: target,
        filterData: filterData,
        subject: subject,
        lvt: lvt,
        lessonTime: lessonTime,
        setUserData: setUserData,
        setFilterData: setFilterData,
        setSubject: setSubject,
        setLvt: setLvt,
    };
}
export default useInterface;
