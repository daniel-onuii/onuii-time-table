import { setSelectMode } from '../store/reducer/user.reducer';
import { setAreaMatchingObj } from '../store/reducer/trigger.reducer';
import _ from 'lodash';
import { setAreaData as setCompareAreaData } from '../store/reducer/compare.reducer';
const common = { id: 'onuii-time-table' };
export const post = {
    readyToListen: function (dispatch) {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                switch (e.data.name) {
                    case 'setSelectMode':
                        dispatch(setSelectMode(e.data.data));
                        _.isEmpty(e.data.data) && dispatch(setAreaMatchingObj([]));
                        break;
                    case 'setTeacher':
                        dispatch(setCompareAreaData(e.data.data));
                        break;
                }
            }
        });
    },

    sendMessage: function (param) {
        //send to parent
        //이부분 요청이 복잡해지면 메서드별로 분기
        window.postMessage({ ...common, ...param }, '*');
    },
};
