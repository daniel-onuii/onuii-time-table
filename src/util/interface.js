import _ from 'lodash';
import { schedule } from './schedule';
export function LinkAdmin(interfaceHook, areaSelectHook) {
    this.common = { id: 'onuii-time-table' };
    this.handler = e => {
        if (e.data.id === 'onuii-time-table') {
            //set interface만 처리하게
            switch (e.data.name) {
                case 'setFilter': //학생 가매칭 필터 선택시
                    if (interfaceHook.auth === 'admin' && interfaceHook.target === 'teacher') {
                        interfaceHook.setFilterData(e.data.data); //선생영역 분홍필터를 위해
                    }
                    break;
                case 'resetFilter': //학생 가매칭 필터 선택시
                    areaSelectHook.setFilter([]);
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
