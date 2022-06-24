import _ from 'lodash';
export const area = {
    getAreaGroupData: function (data) {
        let seq = 0;
        const rowData = _.sortBy(data, 'timeBlockId').reduce((result, e) => {
            const isCheckSeq =
                result.slice(-1)[0]?.timeBlockId === e.timeBlockId - 1 &&
                _.isEqual(_.sortBy(result.slice(-1)[0]?.lectureSubjectIds), _.sortBy(e.lectureSubjectIds));
            result.push({
                seq: isCheckSeq ? seq : (seq += 1),
                timeBlockId: e.timeBlockId,
                lectureSubjectIds: e.lectureSubjectIds,
            });
            return result;
        }, []);
        const areaGroupObj = _(rowData)
            .groupBy(x => x.seq)
            .map((value, key) => ({
                seq: key,
                lectureSubjectIds: _.uniq(_.flatMap(value.map(e => e.lectureSubjectIds))),
                startIdx: value.slice(0, 1)[0]?.timeBlockId,
                endIdx: value.slice(-1)[0]?.timeBlockId,
            }))
            .value();

        const alignObj = areaGroupObj.reduce((result, e, i) => {
            const before = result.slice(-1)[0];
            const after = areaGroupObj[i + 1];
            const isStuckBefore =
                e.startIdx - 1 === before?.endIdx && _.intersection(e.lectureSubjectIds, before?.lectureSubjectIds).length > 0 ? true : false;
            const isStuckAfter =
                e.endIdx + 1 === after?.startIdx && _.intersection(e.lectureSubjectIds, after?.lectureSubjectIds).length > 0 ? true : false;

            //버그있다
            const newLength = _.max([
                isStuckBefore ? before?.lectureSubjectIds.length : e.lectureSubjectIds.length,
                isStuckAfter ? after?.lectureSubjectIds.length : e.lectureSubjectIds.length,
                e.lectureSubjectIds.length,
            ]);
            const getAlignByBeforeData = () => {
                const $this = e.lectureSubjectIds;
                const like = _.intersection($this, before?.lectureSubjectIds);
                const xor = _.xor(like, $this);
                // console.log('before', before?.lectureSubjectIds);
                // console.log('this', $this);
                // console.log('like', like);
                // console.log('xor', xor);
                // console.log('newLength', newLength);

                const alignLectures = before?.lectureSubjectIds.reduce((r, ee, ii) => {
                    const targetIdx = $this.indexOf(ee);
                    targetIdx > -1 ? r.push($this[targetIdx]) : r.push(Number(_.join(xor.splice(0, 1))));
                    return r;
                }, []);

                if (before?.lectureSubjectIds.length < $this.length) {
                    return [...alignLectures, ..._.difference(xor, alignLectures)];
                } else {
                    return alignLectures;
                }
            };
            console.log(getAlignByBeforeData());
            const row = {
                ...e,
                newLength: newLength,
                lectureSubjectIds: isStuckBefore ? getAlignByBeforeData() : e.lectureSubjectIds,
            };
            result.push(row);
            return result;
        }, []);

        return alignObj;
    },
};
