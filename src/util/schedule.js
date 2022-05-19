import moment from 'moment';
import _ from 'lodash';

export const schedule = {
    getWeekIdx: function (idx) {
        //idx로 요일 추출. 0: 월 6: 일
        return Math.floor((idx - 36) / 96);
    },
    getWeekText: function (e) {
        const week = ['월', '화', '수', '목', '금', '토', '일'];
        return week[e];
    },
    getTimeList: function () {
        const defaultTime = moment('2022-01-01 08:45');
        const timeList = [];
        for (var i = 0; i < 66; i++) {
            timeList.push(defaultTime.add(15, 'minutes').format('HH:mm')); //15분 단위로 추가
        }
        return timeList;
    },
    getTime: function (idx) {
        //0 = 9시, 1 = 9시15분
        return moment('2022-01-01 09:00')
            .add(15 * idx, 'minutes')
            .format('HH:mm');
    },
    getTimeIdx: function (idx) {
        //getTime에 사용될 시간idx 리턴
        return idx - (this.getWeekIdx(idx) * 96 + 36);
    },

    checkValidSchedule: function (endTime, startTime, itemRowData, itemLectureId) {
        if (
            (endTime > 101 && endTime < 132) ||
            (endTime > 197 && endTime < 228) ||
            (endTime > 293 && endTime < 324) ||
            (endTime > 389 && endTime < 420) ||
            (endTime > 485 && endTime < 516) ||
            (endTime > 581 && endTime < 612) ||
            endTime > 677
        ) {
            toast.error('유효하지않은 범위입니다.', ToastOption);
            return false;
        } else {
            const isInvalidEndtime = itemRowData.some(item => item.lecture_subject_Id !== itemLectureId && (item.block_group_No === endTime || item.block_group_No === endTime + 2));
            const isInvalidStart = itemRowData.some(item => item.lecture_subject_Id !== itemLectureId && item.block_group_No === startTime - 2);
            if (isInvalidEndtime || isInvalidStart) {
                toast.error('강의 사이에 최소 30분의 시간이 필요합니다.', ToastOption);
                return false;
            } else {
                return true;
            }
        }
    },
};
