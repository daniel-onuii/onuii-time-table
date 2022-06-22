import _ from 'lodash';
import { schedule } from './schedule';
import { table } from './table';
export function AreaEvent({ areaHook, areaSelectHook, interfaceHook, itemHook }) {
    this.areaHook = areaHook;
    this.areaSelectHook = areaSelectHook;
    this.interfaceHook = interfaceHook;
    this.itemHook = itemHook;
}

AreaEvent.prototype.overlap = function (bindLecture) {
    const newAreaData = this.areaHook.areaData.reduce((result, e) => {
        !bindLecture.some(item => item.timeBlockId === e.timeBlockId) && result.push(e);
        return result;
    }, []);
    this.areaHook.setAreaData([...newAreaData, ...bindLecture]);
};

AreaEvent.prototype.add = function (bindLecture, items) {
    const newAreaData = this.areaHook.areaData.reduce((result, e) => {
        const target = _.find(bindLecture, { timeBlockId: e.timeBlockId });
        const beforLecture = e.lectureSubjectIds ? e.lectureSubjectIds : [];
        const addData = _.uniq([...beforLecture, ...items]);
        target ? result.push({ ...target, lectureSubjectIds: addData }) : result.push(e);
        return result;
    }, []);
    this.areaHook.setAreaData([...newAreaData, ..._.differenceBy(bindLecture, this.areaHook.areaData, 'timeBlockId')]);
};

AreaEvent.prototype.pop = function (bindLecture, items) {
    const newAreaData = this.areaHook.areaData.reduce((result, e) => {
        const target = _.find(bindLecture, { timeBlockId: e.timeBlockId });
        const beforLecture = e.lectureSubjectIds ? e.lectureSubjectIds : [];
        const popData = _.without(beforLecture, ...items);
        target ? !_.isEmpty(popData) && result.push({ ...target, lectureSubjectIds: popData }) : result.push(e);
        return result;
    }, []);
    this.areaHook.setAreaData(newAreaData);
};

AreaEvent.prototype.removeAll = function () {
    const removeResult = _.reject(this.areaHook.areaData, o => {
        return this.areaSelectHook.lecture.some(item => item.timeBlockId === o.timeBlockId);
    });
    this.areaHook.setAreaData(removeResult);
};

AreaEvent.prototype.clickDown = function (e, idx) {
    this.areaHook.setAreaObj({
        idx: idx,
        startOverIdx: schedule.getTimeIdx(idx),
        endOverIdx: schedule.getTimeIdx(idx + 1),
        startOverDayIdx: schedule.getWeekIdx(idx),
        endOverDayIdx: schedule.getWeekIdx(idx),
    });
    if (e.buttons !== 1) return false; //좌클릭 이외는 전부 false
    if (this.interfaceHook.auth === 'admin' && this.interfaceHook.target === 'teacher') return false; //드래그 금지
    this.areaHook.setIsAreaClickDown(true); //클릭 상태
    const isFill = table.isFillArea(this.areaSelectHook.filter, idx); //가매칭모드때 사용
    this.areaHook.setIsAreaAppend(isFill); //대상이 빈칸인지
};

AreaEvent.prototype.clickOver = function (idx) {
    if (this.areaHook.isAreaClickDown) {
        const startOverIdx = this.areaHook.areaObj.idx;
        const endOverIdx = idx;
        const startOverDayIdx = schedule.getWeekIdx(startOverIdx);
        const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
        const startRange = schedule.getTimeIdx(startOverIdx);
        const endRange = schedule.getTimeIdx(endOverIdx);
        const intervalDay = _.range(
            startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
            startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1,
        );
        const selectedInfo = intervalDay.reduce((result, e) => {
            result.push(
                _.range(e * 96 + 32 + startRange, e * 96 + 32 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                    return { timeBlockId: ee };
                }),
            );
            return result;
        }, []);
        this.areaSelectHook.setLecture(_.flatten(selectedInfo));
        this.areaHook.setAreaObj({
            ...this.areaHook.areaObj,
            startOverIdx: startRange < endRange ? startRange : endRange,
            endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
            startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
            endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
        });
    }
};
AreaEvent.prototype.clickUp = function (e, idx, openLectureModal, openMatchingModal) {
    if (e.button !== 0) return false; //좌클릭일때만
    this.areaHook.setIsAreaClickDown(false); //클릭 상태
    // if (_.isEmpty(interfaceHook?.selectMode) && interfaceHook.auth === 'user') {
    if (this.interfaceHook.auth === 'user') {
        //과목 추가는 유저 모드에서만 가능(어드민도 과목 추가 화면은 유저기능으로)
        //일반 과목 선택 모드
        if (_.isEmpty(this.areaSelectHook.lecture)) {
            //셀 클릭시
            openLectureModal();
            this.areaHook.setAreaObj({
                idx: idx,
                startOverIdx: schedule.getTimeIdx(idx),
                endOverIdx: schedule.getTimeIdx(idx + 4),
                startOverDayIdx: schedule.getWeekIdx(idx),
                endOverDayIdx: schedule.getWeekIdx(idx),
            });
            this.areaSelectHook.setLecture(
                _.range(idx, idx + 4).map(e => {
                    return { timeBlockId: e };
                }),
            );
        } else {
            //셀 드래그 앤 드롭
            if (this.areaSelectHook.lecture.length > 0) {
                openLectureModal();
            }
        }
    } else {
        //admin
        if (_.isEmpty(this.areaSelectHook.lecture)) {
            //셀 클릭시c
            if (this.interfaceHook.target === 'teacher' && !_.isNull(this.interfaceHook.lvt)) {
                const tempMatching = _.range(idx, idx + 6).map(e => {
                    return { timeBlockId: e };
                });
                this.areaSelectHook.setMatchingTarget(tempMatching);
                openMatchingModal();
            }
            // 정규 , 다른가매칭 시간 예외처리 후 post message to admin.
        } else {
            //셀 드래그 앤 드롭
            if (this.interfaceHook.target === 'student') {
                this.areaSelectHook.setLecture([]);
                if (!this.areaHook.isAreaAppend) {
                    this.areaSelectHook.setFilter([...this.areaSelectHook.filter, ...this.areaSelectHook.lecture]);
                } else {
                    const removeResult = _.reject(this.areaSelectHook.filter, o => {
                        return this.areaSelectHook.lecture.some(item => item.timeBlockId === o.timeBlockId);
                    });
                    this.areaSelectHook.setFilter(removeResult);
                }
            }
        }
    }
};

AreaEvent.prototype.itemDragStart = function (e, idx) {
    table.removeOver();
    const $this = e.currentTarget;
    const weekIdx = schedule.getWeekIdx(idx);
    const $tr = e.currentTarget.parentNode.parentNode;
    $this.classList.add(`over`);
    const arrTr = [];
    for (var i = 0; i < this.itemHook.itemObj.time - 1; i++) {
        _.isEmpty(arrTr) ? arrTr.push($tr.nextSibling) : arrTr.push(arrTr[i - 1]?.nextSibling);
    }
    arrTr.map(ee => {
        ee && ee.childNodes[ee.childNodes.length === 8 ? weekIdx + 1 : weekIdx].childNodes[0].classList.add(`over`);
    });
};

AreaEvent.prototype.itemDragEnd = function (e, idx) {
    e.preventDefault();
    const dropEvent = (data, setData, groupData) => {
        const endTime = idx + this.itemHook.itemObj.time - 1;
        const checkCrash = schedule.checkCrashItemTime(groupData, idx, endTime, this.itemHook.itemObj.lectureId);
        if (!_.isEmpty(checkCrash)) {
            // dispatch(setMessage(checkCrash)); 에러 메시지 전달해야함
            return false;
        }
        if (idx != 0) {
            const removedLecture = _.reject(
                [...data],
                o =>
                    (o.timeBlockId >= this.itemHook.itemObj.idx && o.timeBlockId < this.itemHook.itemObj.idx + this.itemHook.itemObj.time) ||
                    (o.timeBlockId >= idx && o.timeBlockId < idx + this.itemHook.itemObj.time),
            );
            const addLecture = _.range(idx, idx + this.itemHook.itemObj.time).reduce((result, e) => {
                result.push({ timeBlockId: e, lectureId: this.itemHook.itemObj.lectureId });
                return result;
            }, []);
            setData([...removedLecture, ...addLecture]);
        }
    };
    table.removeOver();
    switch (
        this.itemHook.itemObj.type //코드 쉣더
    ) {
        case 'fixed':
            dropEvent(this.itemHook.fixedItemData, this.itemHook.setFixedItemData, this.itemHook.fixedItemGroupData);
            break;
        case 'matching':
            dropEvent(this.itemHook.matchingItemData, this.itemHook.setMatchingItemData, this.itemHook.matchingItemGroupData);
            break;
    }
    this.itemHook.setItemObj({});
};
