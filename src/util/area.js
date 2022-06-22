import _ from 'lodash';
export const area = {
    getAreaGroupData: function (data) {
        let seq = 0;
        const rowData = _.sortBy(data, 'timeBlockId').reduce((result, e) => {
            const isCheckSeq = result.slice(-1)[0]?.timeBlockId === e.timeBlockId - 1;
            result.push({
                seq: isCheckSeq ? seq : (seq += 1),
                timeBlockId: e.timeBlockId,
                lectureIds: e.lectureIds,
            });
            return result;
        }, []);
        const areaGroupObj = _(rowData)
            .groupBy(x => x.seq)
            .map((value, key) => ({
                seq: key,
                // lectureIds: _.sortBy(_.uniq(_.flatMap(value.map(e => e.lectureIds)))),
                lectureIds: _.uniq(_.flatMap(value.map(e => e.lectureIds))),
                startIdx: value.slice(0, 1)[0]?.timeBlockId,
                endIdx: value.slice(-1)[0]?.timeBlockId,
            }))
            .value();
        return areaGroupObj;
    },
};
