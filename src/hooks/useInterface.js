import { useState, useCallback } from 'react';
function useInterface(props) {
    const [auth, setAuth] = useState(props.auth);
    const [target, setTarget] = useState(props.target);
    const [teacherData, setTeacherData] = useState();
    const [lvt, setLvt] = useState(null);
    const [lessonOption, setLessonOption] = useState(null);
    const [selectMode, setSelectMode] = useState({});

    const updateAuth = useCallback(value => {
        setAuth(value);
    }, []);
    const updateTarget = useCallback(value => {
        setTarget(value);
    }, []);
    const updateTeacherData = useCallback(value => {
        setTeacherData(value);
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
        teacherData: teacherData,
        lvt: lvt,
        lessonOption: lessonOption,
        selectMode: selectMode,
        auth: auth,
        target: target,
        setTarget: updateTarget,
        setAuth: updateAuth,
        setTeacherData: updateTeacherData,
        setLvt: updateLvt,
        setLessonOption: updateLessonOption,
        setSelectMode: updateSelectMode,
    };
}
export default useInterface;
