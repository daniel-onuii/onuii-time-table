import { setLessonOption, setLVT, setSelectMode } from '../store/reducer/user.reducer';
import { setAreaMatchingObj } from '../store/reducer/trigger.reducer';
import _ from 'lodash';
import { setAreaData as setCompareAreaData } from '../store/reducer/compare.reducer';
const common = { id: 'onuii-time-table' };

export const post = {
    readyToListen: function (dispatch) {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'setLVT': // admin LVT
                        dispatch(setLVT(e.data.data));
                        break;
                    case 'setLessonOption': // admin lesson option
                        dispatch(setLessonOption(e.data.data));
                        break;
                    case 'setSelectMode': //가매칭모드
                        dispatch(setSelectMode(e.data.data));
                        _.isEmpty(e.data.data) && dispatch(setAreaMatchingObj([]));
                        break;
                    case 'setTeacher': //후보선생 설정
                        dispatch(setCompareAreaData(e.data.data));
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
