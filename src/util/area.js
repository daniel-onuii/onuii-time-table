import _ from 'lodash';
export const area = {
    getAreaGroupData: function (data) {
        let seq = 0;
        const rowData = _.sortBy(data, 'block_group_No').reduce((result, e) => {
            const isCheckSeq = result.slice(-1)[0]?.block_group_No === e.block_group_No - 1;
            result.push({
                seq: isCheckSeq ? seq : (seq += 1),
                block_group_No: e.block_group_No,
                areaActiveType: e.areaActiveType,
            });
            return result;
        }, []);
        const areaGroupObj = _(rowData)
            .groupBy(x => x.seq)
            .map((value, key) => ({
                seq: key,
                // areaActiveType: _.sortBy(_.uniq(_.flatMap(value.map(e => e.areaActiveType)))),
                areaActiveType: _.uniq(_.flatMap(value.map(e => e.areaActiveType))),
                startIdx: value.slice(0, 1)[0]?.block_group_No,
                endIdx: value.slice(-1)[0]?.block_group_No,
            }))
            .value();
        return areaGroupObj;
    },
};
