import _ from 'lodash';
import { schedule } from './schedule';
export function LinkAdmin(interfaceHook) {
    this.common = { id: 'onuii-time-table' };
    this.handler = e => {
        if (e.data.id === 'onuii-time-table') {
            switch (e.data.name) {
                case 'setTeacher': //후보선생 설정, 희망시간, 정규시간, 가매칭시간 데이터 모두 set
                    interfaceHook.setTeacherData({
                        areaData: schedule.getParseAreaData(e.data.data.timeBlocks),
                        fixedItemData: schedule.getParseFixedData(e.data.data.timeBlocks, e.data.userInfo?.lectureData),
                        matchingItemData: schedule.getParseMatchingData(e.data.data.timeBlocks, e.data.userInfo?.lectureData),
                    });
                    break;
                case 'setSubject': //학생 선택시 과목
                    interfaceHook.setSubject(e.data.data);
                    break;
                case 'save': //테이블 저장
                    alert('saved');
                    break;
            }
        }
    };
}
LinkAdmin.prototype.readyToListen = function () {
    window.addEventListener('message', this.handler);
};
LinkAdmin.prototype.clearListen = function () {
    window.removeEventListener('message', this.handler);
};
LinkAdmin.prototype.sendMessage = function (param) {
    window.postMessage({ ...this.common, ...param }, '*');
};
