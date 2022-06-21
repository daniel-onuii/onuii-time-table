import { useState, useCallback } from 'react';
function useInterface(props) {
    const [userData, setUserData] = useState(props.userData);
    const [auth, setAuth] = useState(props.auth);
    const [target, setTarget] = useState(props.target);
    const [teacherData, setTeacherData] = useState();
    const [studentData, setStudentData] = useState();
    const [lvt, setLvt] = useState(null);
    const [lessonOption, setLessonOption] = useState(null);
    const [selectMode, setSelectMode] = useState({});

    const updateUserData = useCallback(value => {
        setUserData(value);
    }, []);
    const updateAuth = useCallback(value => {
        setAuth(value);
    }, []);
    const updateTarget = useCallback(value => {
        setTarget(value);
    }, []);
    const updateTeacherData = useCallback(value => {
        setTeacherData(value);
    }, []);
    const updateStudentData = useCallback(value => {
        setStudentData(value);
    }, []);
    const updateLvt = useCallback(value => {
        setLvt(value);
    }, []);
    const updateLessonOption = useCallback(value => {
        setLessonOption(value);
    }, []);
    const updateSelectMode = useCallback(value => {
        setSelectMode(value);
    }, []);

    return {
        userData: userData,
        teacherData: teacherData,
        studentData: studentData,
        lvt: lvt,
        lessonOption: lessonOption,
        selectMode: selectMode,
        auth: auth,
        target: target,
        setUserData: updateUserData,
        setTeacherData: updateTeacherData,
        setStudentData: updateStudentData,
        setTarget: updateTarget,
        setAuth: updateAuth,
        setLvt: updateLvt,
        setLessonOption: updateLessonOption,
        setSelectMode: updateSelectMode,
    };
}
export default useInterface;
