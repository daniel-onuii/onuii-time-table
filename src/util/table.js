export const table = {
    getBlockId: function (dayOfweekIdx, i) {
        return dayOfweekIdx * 96 + 36 + i;
    },
    isFillArea: function (data, idx) {
        return data.some(item => item.block_group_No === idx);
    },
};
