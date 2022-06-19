import { useState, useCallback } from 'react';
function useInterface() {
    const [teacherData, setTeacherData] = useState();
    const [lvt, setLvt] = useState(null);
    const [lessonOption, setLessonOption] = useState(null);
    const [selectMode, setSelectMode] = useState({});

    // auth: '',

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
        setTeacherData: updateTeacherData,
        setLvt: updateLvt,
        setLessonOption: updateLessonOption,
        setSelectMode: updateSelectMode,
    };
}
export default useInterface;