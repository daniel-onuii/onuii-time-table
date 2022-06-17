import moment from 'moment';
import { setMessage } from '../store/reducer/trigger.reducer';
import _ from 'lodash';
export const schedule = {
    getWeekIdx: function (idx) {
        return Math.floor((idx - 32) / 96);
    },
    getWeekText: function (e) {
        const week = ['월', '화', '수', '목', '금', '토', '일'];
        return week[e];
    },
    getTimeList: function () {
        const defaultTime = moment('2022-01-01 08:45');
        const timeList = [];
        for (var i = 0; i < 66; i++) {
            timeList.push(defaultTime.add(15, 'minutes').format('HH:mm'));
        }
        return timeList;
    },
    getTime: function (idx) {
        return moment('2022-01-01 08:00')
            .add(15 * idx, 'minutes')
            .format('HH:mm');
    },
    getTimeIdx: function (idx) {
        return idx - (this.getWeekIdx(idx) * 96 + 32);
    },

    checkValidSchedule: function (endTime, startTime, fixedItemRowData, itemLectureId, dispatch) {
        if (
            (endTime > 101 && endTime < 128) ||
            (endTime > 197 && endTime < 224) ||
            (endTime > 293 && endTime < 320) ||
            (endTime > 389 && endTime < 416) ||
            (endTime > 485 && endTime < 512) ||
            (endTime > 581 && endTime < 607) ||
            endTime > 677
        ) {
            dispatch(setMessage('유효하지않은 범위입니다.'));

            return false;
        } else {
            const isInvalidEndtime = fixedItemRowData.some(
                item => item.lecture_subject_Id !== itemLectureId && (item.block_group_No === endTime || item.block_group_No === endTime + 2),
            );
            const isInvalidStart = fixedItemRowData.some(item => item.lecture_subject_Id !== itemLectureId && item.block_group_No === startTime - 2);
            if (isInvalidEndtime || isInvalidStart) {
                dispatch(setMessage('강의 사이에 최소 30분의 시간이 필요합니다.'));
                return false;
            } else {
                return true;
            }
        }
    },

    checkCrashItemTime: (targetGroupData, startTime, endTime, id) => {
        // 과목 이동과 따로 써야할듯
        //충돌시간 체크, id체크 없이도 가매칭 추가는
        if (
            (endTime > 101 && endTime < 128) ||
            (endTime > 197 && endTime < 224) ||
            (endTime > 293 && endTime < 320) ||
            (endTime > 389 && endTime < 416) ||
            (endTime > 485 && endTime < 512) ||
            (endTime > 581 && endTime < 607) ||
            endTime > 677
        ) {
            return '유효하지 않은 범위입니다.';
        } else {
            // //과외 시작시간 앞으로 30분 비워둠
            // if (targetGroupData.some(e => _.inRange(endTime, e.startIdx - 2, e.endIdx + 1))) {
            //     return '강의 사이 최소 30분은 비워둬야합니다.';
            // }
            // //과외 종료시간 뒤로 30분 비워둠
            // else if (targetGroupData.some(e => _.inRange(startTime, e.startIdx, e.endIdx + 1 + 2))) {
            //     return '강의 사이 최소 30분은 비워둬야합니다.';
            // }
            // //과외 시간 충돌 체크
            // else
            if (targetGroupData.some(e => _.inRange(e.startIdx, startTime, endTime + 1) || _.inRange(e.endIdx, startTime, endTime + 1))) {
                return '해당 범위에 다른 강의가 존재합니다.';
            } else if (targetGroupData.some(e => e.startIdx - 1 == endTime && e.lecture_subject_Id == id)) {
                return '같은 과목이 연속됨.';
            } else if (targetGroupData.some(e => e.endIdx + 1 == startTime && e.lecture_subject_Id == id)) {
                return '같은 과목이 연속됨.';
            }
        }
    },
};
