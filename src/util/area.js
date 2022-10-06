import _ from 'lodash';
import { schedule } from './schedule';
export const area = {
    getAreaGroupDataByLecture: function (data, lectureId) {
        let seq = 0;
        const rowData = _.sortBy(data, 'timeBlockId').reduce((result, e) => {
            //과목값의 배열. 과목의 종류가 달라지면 seq도 바뀜
            const isCheckEqual = result.slice(-1)[0]?.timeBlockId === e.timeBlockId - 1;
            result.push({
                seq: isCheckEqual ? seq : (seq += 1),
                timeBlockId: e.timeBlockId,
                lectureSubjectId: lectureId,
            });
            return result;
        }, []);
        const areaGroupObj = _(rowData)
            .groupBy(x => x.seq)
            .map((value, key) => ({
                seq: key,
                weekIdx: schedule.getWeekIdx(value.slice(0, 1)[0]?.timeBlockId),
                lectureSubjectId: lectureId,
                startIdx: value.slice(0, 1)[0]?.timeBlockId,
                endIdx: value.slice(-1)[0]?.timeBlockId,
            }))
            .value();
        return areaGroupObj;
    },
    getAreaGroupData: function (data) {
        let seq = 0;
        const rowData = _.sortBy(data, 'timeBlockId').reduce((result, e) => {
            //과목값의 배열. 과목의 종류가 달라지면 seq도 바뀜
            const isCheckEqual =
                result.slice(-1)[0]?.timeBlockId === e.timeBlockId - 1 &&
                _.isEqual(_.sortBy(result.slice(-1)[0]?.lectureSubjectId), _.sortBy(e.lectureSubjectId));
            result.push({
                seq: isCheckEqual ? seq : (seq += 1),
                timeBlockId: e.timeBlockId,
                lectureSubjectId: e.lectureSubjectId,
            });
            return result;
        }, []);
        const areaGroupObj = _(rowData)
            .groupBy(x => x.seq)
            .map((value, key) => ({
                seq: key,
                lectureSubjectId: _.uniq(_.flatMap(value.map(e => e.lectureSubjectId))),
                startIdx: value.slice(0, 1)[0]?.timeBlockId,
                endIdx: value.slice(-1)[0]?.timeBlockId,
            }))
            .value();

        const lengthForRowData = _.sortBy(data, 'timeBlockId').reduce((result, e) => {
            //과목의 길이값을 구하기 위한 배열. 연속되고 이전배열의 과목값이 다음행과 같으면 seq가 같음
            const isCheckEqual =
                result.slice(-1)[0]?.timeBlockId === e.timeBlockId - 1 &&
                _.intersection(e.lectureSubjectId, result.slice(-1)[0]?.lectureSubjectId).length > 0;
            result.push({
                seq: isCheckEqual ? seq : (seq += 1),
                timeBlockId: e.timeBlockId,
                lectureSubjectId: e.lectureSubjectId,
                length: e.lectureSubjectId.length,
            });
            return result;
        }, []);
        const lengthForGroup = _(lengthForRowData)
            .groupBy(x => x.seq)
            .map(value => ({
                startIdx: value.slice(0, 1)[0]?.timeBlockId,
                endIdx: value.slice(-1)[0]?.timeBlockId,
                length: _.maxBy(value, 'length').length, //과목길이 최대값으로 length 표시
            }))
            .value();

        const alignObj = areaGroupObj.reduce((result, e, i) => {
            const before = result.slice(-1)[0];
            const isStuckBefore =
                e.startIdx - 1 === before?.endIdx && _.intersection(e.lectureSubjectId, before?.lectureSubjectId).length > 0 ? true : false;
            const getAlignByBeforeData = () => {
                const $this = e.lectureSubjectId;
                const like = _.intersection($this, before?.lectureSubjectId);
                const xor = _.xor(like, $this);
                const alignLectures = before?.lectureSubjectId.reduce((r, ee) => {
                    const targetIdx = $this.indexOf(ee);
                    targetIdx > -1 ? r.push($this[targetIdx]) : r.push(Number(_.join(xor.splice(0, 1))));
                    return r;
                }, []);
                if (before?.lectureSubjectId.length < $this.length) {
                    return [...alignLectures, ..._.difference(xor, alignLectures)];
                } else {
                    return alignLectures;
                }
            };
            const barLength = _.find(lengthForGroup, function (o) {
                return _.inRange(e.startIdx, o.startIdx, o.endIdx + 1);
            });

            const row = {
                ...e,
                newLength: barLength.length,
                lectureSubjectId: isStuckBefore ? getAlignByBeforeData() : e.lectureSubjectId,
            };
            result.push(row);
            return result;
        }, []);
        return alignObj;
    },
};
