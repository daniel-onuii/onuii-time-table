import { setSelectMode } from '../store/reducer/user.reducer';
import { setAreaMatchingObj } from '../store/reducer/trigger.reducer';
const common = { id: 'onuii-time-table' };
export const post = {
    readyToListen: function (dispatch) {
        window.addEventListener('message', function (e) {
            if (e.data.id === 'onuii-time-table') {
                if (e.data.name === 'init' && e.data.target === 'matching') {
                    dispatch(setSelectMode({}));
                    dispatch(setAreaMatchingObj([]));
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
