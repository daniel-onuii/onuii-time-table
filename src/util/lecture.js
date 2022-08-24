import { schedule } from './schedule';
import _ from 'lodash';
export const lecture = {
    lectureList: [],
    setLectureList: function (data) {
        this.lectureList = [{ subjectId: 'all', subjectName: '' }, ...data];
    },
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
        const dummyLectureList = [
            { subjectId: 'all', subjectName: '' },
            {
                subjectId: 8906,
                subjectName: '수학',
            },
            {
                subjectId: 8907,
                subjectName: 'Special',
            },
            {
                subjectId: 8948,
                subjectName: '수학(상)',
            },
            {
                subjectId: 9163,
                subjectName: '수학(하)',
            },
            {
                subjectId: 9165,
                subjectName: '수2',
            },
            {
                subjectId: 9166,
                subjectName: '미적분',
            },
            {
                subjectId: 9167,
                subjectName: '확통',
            },
            {
                subjectId: 9168,
                subjectName: '국어',
            },
            {
                subjectId: 9169,
                subjectName: '영어',
            },
            {
                subjectId: 9170,
                subjectName: '사회',
            },
            {
                subjectId: 9171,
                subjectName: '과학',
            },
            {
                subjectId: 9788,
                subjectName: '한국사',
            },
            {
                subjectId: 9789,
                subjectName: '동아시아사',
            },
            {
                subjectId: 9790,
                subjectName: '세계사',
            },
            {
                subjectId: 9791,
                subjectName: '생활과 윤리',
            },
            {
                subjectId: 9792,
                subjectName: '윤리와 사상',
            },
            {
                subjectId: 9793,
                subjectName: '한국지리',
            },
            {
                subjectId: 9794,
                subjectName: '세계지리',
            },
            {
                subjectId: 9795,
                subjectName: '사회문화',
            },
            {
                subjectId: 9796,
                subjectName: '경제',
            },
            {
                subjectId: 9797,
                subjectName: '법과 정치',
            },
            {
                subjectId: 9798,
                subjectName: '물리1',
            },
            {
                subjectId: 9799,
                subjectName: '물리2',
            },
            {
                subjectId: 9800,
                subjectName: '화학1',
            },
            {
                subjectId: 9801,
                subjectName: '화학2',
            },
            {
                subjectId: 9802,
                subjectName: '생명과학1',
            },
            {
                subjectId: 9803,
                subjectName: '생명과학2',
            },
            {
                subjectId: 9804,
                subjectName: '지구과학1',
            },
            {
                subjectId: 9805,
                subjectName: '지구과학2',
            },
            {
                subjectId: 9810,
                subjectName: '중학사회',
            },
            {
                subjectId: 9811,
                subjectName: '고1통합사회',
            },
            {
                subjectId: 9812,
                subjectName: '중학과학',
            },
            {
                subjectId: 9813,
                subjectName: '고1통합과학',
            },
            {
                subjectId: 9825,
                subjectName: '외국어',
            },
            {
                subjectId: 9826,
                subjectName: '한문',
            },
            {
                subjectId: 9827,
                subjectName: '아랍어',
            },
            {
                subjectId: 9828,
                subjectName: '일본어',
            },
            {
                subjectId: 9829,
                subjectName: '중국어',
            },
            {
                subjectId: 9830,
                subjectName: '독일어',
            },
            {
                subjectId: 9831,
                subjectName: '프랑스어',
            },
            {
                subjectId: 9832,
                subjectName: '스페인어',
            },
            {
                subjectId: 9833,
                subjectName: '베트남어',
            },
            {
                subjectId: 9834,
                subjectName: '러시아어',
            },
            {
                subjectId: 10117,
                subjectName: '수1',
            },
            {
                subjectId: 14449,
                subjectName: '중3-2',
            },
            {
                subjectId: 14450,
                subjectName: '중3-1',
            },
            {
                subjectId: 14451,
                subjectName: '중2-2',
            },
            {
                subjectId: 18391,
                subjectName: '중2-1',
            },
            {
                subjectId: 18492,
                subjectName: '입시코칭',
            },
            {
                subjectId: 22393,
                subjectName: '입시코칭',
            },
        ];
        return _.isEmpty(this.lectureList)
            ? _.find(dummyLectureList, { subjectId: id })?.subjectName
            : _.find(this.lectureList, { subjectId: id })?.subjectName;
    },
};
