import _ from 'lodash';
export function LinkAdmin(interfaceHook) {
    this.common = { id: 'onuii-time-table' };
    this.handler = e => {
        if (e.data.id === 'onuii-time-table') {
            switch (e.data.name) {
                case 'setUserData': // userData
                    interfaceHook.setUserData(e.data.data);
                    break;
                case 'setAuth': // auth
                    interfaceHook.setAuth(e.data.data);
                    break;
                case 'setTarget': // target
                    interfaceHook.setTarget(e.data.data);
                    break;
                case 'setLvt': // admin LVT
                    interfaceHook.setLvt(e.data.data);
                    break;
                case 'setLessonOption': // admin lesson option
                    interfaceHook.setLessonOption(e.data.data);
                    break;
                case 'setSelectMode': //가매칭모드
                    interfaceHook.setSelectMode(e.data.data);
                    break;
                case 'setTeacher': //후보선생 설정, 희망시간, 정규시간, 가매칭시간 데이터 모두 set
                    interfaceHook.setTeacherData(e.data.data);
                    break;
                case 'setStudent': //학생 설정
                    interfaceHook.setStudentData(e.data.data);
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
