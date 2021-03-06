import { schedule } from './schedule';
import _ from 'lodash';
export const lecture = {
    getLectureId: function (data, idx) {
        return _.find(data, { timeBlockId: idx })?.lectureId;
    },
    getLectureNameByIdx: function (data, idx) {
        return this.getLectureName(this.getLectureId(data, idx));
    },
    getLectureRunningTime: function (data, idx) {
        const obj = _.find(data, { startIdx: idx });
        return obj.endTimeIdx - obj.startTimeIdx + 1;
    },
    getGroupByLectureTime: function (data) {
        let seq = 0;
        const rowData = _.sortBy(data, 'timeBlockId').reduce((result, e) => {
            const isCheckSeq =
                _.isEqual(result.slice(-1)[0]?.timeBlockId, e.timeBlockId - 1) && _.isEqual(result.slice(-1)[0]?.lectureId, e.lectureId);

            result.push({
                week: schedule.getWeekIdx(e.timeBlockId),
                timeBlockId: e.timeBlockId,
                lectureId: e.lectureId,
                seq: isCheckSeq ? seq : (seq += 1),
            });
            return result;
        }, []);
        const possibleObj = _(rowData)
            .groupBy(x => x.seq)
            .map((value, key) => ({
                seq: key,
                week: value[0]?.week,
                lectureId: value[0]?.lectureId,
                startIdx: value.slice(0, 1)[0]?.timeBlockId,
                endIdx: value.slice(-1)[0]?.timeBlockId,
                startTimeIdx: schedule.getTimeIdx(value.slice(0, 1)[0]?.timeBlockId),
                endTimeIdx: schedule.getTimeIdx(value.slice(-1)[0]?.timeBlockId),
                startTime: schedule.getTime(schedule.getTimeIdx(value.slice(0, 1)[0]?.timeBlockId)),
                endTime: schedule.getTime(schedule.getTimeIdx(value.slice(-1)[0]?.timeBlockId) + 1),
                weekText: `${schedule.getWeekText(value[0]?.week)}요일`,
            }))
            .value();
        return possibleObj;
    },

    getLectureName: function (id) {
        const subjectList = [
            '',
            '수학',
            '국어',
            '영어',
            '중학과학',
            '고1 통합과학',
            '물리1',
            '물리2',
            '화학1',
            '화학2',
            '생명과학1',
            '생명과학2',
            '지구과학1',
            '지구과학2',
            '과학',
            '중학사회',
            '고1 통합사회',
            '한국사',
            '동아시아',
            '세계사',
            '생활과 윤리',
            '윤리와 사상',
            '한국지리',
            '세계지리',
            '사회문화',
            '경제',
            '법과 정치',
            '사회',
            '한문',
            '아랍어',
            '일본어',
            '중국어',
            '독일어',
            '프랑스어',
            '스페인어',
            '베트남어',
            '러시아어',
            '입시상담',
        ];
        const subjectIdList = [
            'all',
            8906,
            9168,
            9169,
            9812,
            9813,
            9798,
            9799,
            9800,
            9801,
            9802,
            9803,
            9804,
            9805,
            9171,
            9810,
            9811,
            9788,
            9789,
            9790,
            9791,
            9792,
            9793,
            9794,
            9795,
            9796,
            9797,
            9170,
            9826,
            9827,
            9828,
            9829,
            9830,
            9831,
            9832,
            9833,
            9834,
            18492,
        ];
        const index = subjectIdList.indexOf(id);
        return subjectList[index];
    },
};
