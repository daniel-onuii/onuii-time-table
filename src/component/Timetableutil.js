import moment from 'moment'
import _ from 'lodash'

export const schedule = {
    getWeekIdx: function (e) {
        return Math.floor((e - 36) / 96)
    },
    getWeekText: function (e) {
        const week = ['월', '화', '수', '목', '금', '토', '일']
        return week[e]
    },
    getTimeList: function () {
        const defaultTime = moment('2022-01-01 08:45')
        const timeList = []
        for (var i = 0; i < 66; i++) {
            timeList.push(defaultTime.add(15, 'minutes').format('HH:mm')) //15분 단위로 추가
        }
        return timeList
    },
    getTime: function (idx) {
        //0 = 9시, 1 = 9시15분
        return moment('2022-01-01 09:00')
            .add(15 * idx, 'minutes')
            .format('HH:mm')
    },
    getTimeIdx: function (e) {
        //getTime에 사용될 시간idx 리턴
        return e - (this.getWeekIdx(e) * 96 + 36)
    }
}
export const mouseEvent = {
    clear: { 1: 1 },
    dragStart: {},
    dragOver: {},
    drop: {},
    clickDown: {},
    clickOver: {},
    clickUp: {}
}
export function Table() {
    this.init = ({ mode, area, item }) => {
        this.mode = mode
        this.data = {
            area: area,
            item: item
        }
    }
    this.getAreaData = () => {
        return this.data?.area
    }
    this.getItemData = () => {
        return this.data?.item
    }
    this.getItemGruopData = () => {
        return timeCalc(this.data?.item)
    }
    this.getLectureId = (idx) => {
        return _.find(this.getItemData(), { block_group_No: idx })
            ?.lecture_subject_Id
    }
    this.getLectureName = (idx) => {
        return getLectureName(this.getLectureId(idx))
    }
    this.isFillArea = (idx) => {
        return this.getAreaData().some((item) => item.block_group_No === idx)
    }
    this.update = ({ area, item }) => {
        this.data.area = area
        this.data.item = item
    }
}
// Table.prototype.init = function ({ mode, area, item }) {
//     this.mode = mode;
//     this.data = {
//         area: area,
//         item: item,
//     };
// };

// Table.prototype.getAreaData = function () {
//     return this.data.area;
// };

// Table.prototype.getItemData = function () {
//     return this.data.item;
// };
Table.prototype.test = function () {
    console.log(this.data.area)
}

Table.prototype.areaOnClick = function () {
    console.log(this.data.area)
}

function getLectureName(id) {
    const subjectList = [
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
        '입시상담'
    ]
    const subjectIdList = [
        8906, 9168, 9169, 9812, 9813, 9798, 9799, 9800, 9801, 9802, 9803, 9804,
        9805, 9171, 9810, 9811, 9788, 9789, 9790, 9791, 9792, 9793, 9794, 9795,
        9796, 9797, 9170, 9826, 9827, 9828, 9829, 9830, 9831, 9832, 9833, 9834,
        18492
    ]
    let index = subjectIdList.indexOf(id)
    return subjectList[index]
}

function timeCalc(data) {
    let seq = 0
    const rowData = _.sortBy(data, 'block_group_No').reduce((result, e) => {
        const isCheckSeq =
            result.slice(-1)[0]?.block_group_No === e.block_group_No - 1 //연속성 체크
        result.push({
            week: schedule.getWeekIdx(e.block_group_No),
            block_group_No: e.block_group_No,
            lecture_subject_Id: e.lecture_subject_Id,
            seq: isCheckSeq ? seq : (seq += 1)
        })
        return result
    }, [])
    const possibleObj = _(rowData)
        .groupBy((x) => x.seq)
        .map((value, key) => ({
            seq: key,
            week: value[0]?.week,
            lecture_subject_Id: value[0]?.lecture_subject_Id,
            startIdx: value.slice(0, 1)[0]?.block_group_No,
            endIdx: value.slice(-1)[0]?.block_group_No,
            startTimeIdx: schedule.getTimeIdx(
                value.slice(0, 1)[0]?.block_group_No
            ),
            endTimeIdx: schedule.getTimeIdx(value.slice(-1)[0]?.block_group_No)
        }))
        .value()
    return possibleObj
}
