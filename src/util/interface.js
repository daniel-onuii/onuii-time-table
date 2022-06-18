import { setLessonOption, setLVT, setSelectMode } from '../store/reducer/user.reducer';
import { setAreaMatchingObj } from '../store/reducer/trigger.reducer';
import { setAreaData as setCompareAreaData } from '../store/reducer/compare.reducer';
import _ from 'lodash';

const common = { id: 'onuii-time-table' };

export const post = {
    readyToListen: function (interfaceHook) {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'setLVT': // admin LVT
                        interfaceHook.setLvt(e.data.data);
                        break;
                    case 'setLessonOption': // admin lesson option
                        interfaceHook.setLessonOption(e.data.data);
                        break;
                    case 'setSelectMode': //가매칭모드
                        interfaceHook.setSelectMode(e.data.data);
                        // _.isEmpty(e.data.data) && dispatch(setAreaMatchingObj([]));//가매칭 초록 영역 제거하는 로직같음
                        break;
                    case 'setTeacher': //후보선생 설정
                        interfaceHook.setTeacherData(e.data.data);
                        break;
                    case 'save': //테이블 저장
                        alert('saved');
                        break;
                }
            }
        });
    },

    sendMessage: function (param) {
        window.postMessage({ ...common, ...param }, '*');
    },
};
