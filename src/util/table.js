import _ from 'lodash';
export const table = {
    getBlockId: function (dayOfweekIdx, i) {
        return dayOfweekIdx * 96 + 32 + i;
    },
    isFillArea: function (data, idx) {
        return data.some(item => item.block_group_No === idx);
    },
    removeOver: function () {
        const overItems = document.querySelectorAll('.item.over');
        _.flatMap(overItems).map(e => {
            e.classList.remove('over');
        });
    },
};
