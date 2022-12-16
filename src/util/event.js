import _ from 'lodash';
import { schedule } from './schedule';
import { table } from './table';
export function AreaEvent({ areaHook, areaSelectHook, interfaceHook, itemHook }) {
    this.areaHook = areaHook;
    this.areaSelectHook = areaSelectHook;
    this.interfaceHook = interfaceHook;
    this.itemHook = itemHook;
}

AreaEvent.prototype.clearCell = function (bindLecture) {
    const cellList = document.querySelectorAll(`.contents.${this.interfaceHook.target} td .item`); //셀 색깔 초기화
    for (var i = 0; i < cellList.length; i++) {
        cellList[i].classList.remove('dragging');
    }
};

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
        const beforLecture = e.lectureSubjectId ? e.lectureSubjectId : [];
        const addData = _.uniq([...beforLecture, ...items]);
        //과목은 n개까지
        const maxLecture = 1;
        target ? result.push({ ...target, lectureSubjectId: addData.slice(0, maxLecture) }) : result.push(e);
        return result;
    }, []);
    this.areaHook.setAreaData([...newAreaData, ..._.differenceBy(bindLecture, this.areaHook.areaData, 'timeBlockId')]);
};

AreaEvent.prototype.pop = function (bindLecture, items) {
    const newAreaData = this.areaHook.areaData.reduce((result, e) => {
        const target = _.find(bindLecture, { timeBlockId: e.timeBlockId });
        const beforLecture = e.lectureSubjectId ? e.lectureSubjectId : [];
        const popData = _.without(beforLecture, ...items);
        target ? !_.isEmpty(popData) && result.push({ ...target, lectureSubjectId: popData }) : result.push(e);
        return result;
    }, []);
    this.areaHook.setAreaData(newAreaData);
};

AreaEvent.prototype.removeAll = function (bindLecture) {
    const removeResult = _.reject(this.areaHook.areaData, o => {
        // return this.areaSelectHook.lecture.some(item => item.timeBlockId === o.timeBlockId);
        return bindLecture.some(item => item.timeBlockId === o.timeBlockId);
    });
    this.areaHook.setAreaData(removeResult);
};

AreaEvent.prototype.clickDown = function (e, idx) {
    this.areaHook.setAreaObj({
        //clickOver에서 사용
        idx: idx,
        startOverIdx: schedule.getTimeIdx(idx),
        endOverIdx: schedule.getTimeIdx(idx + 1),
        startOverDayIdx: schedule.getWeekIdx(idx),
        endOverDayIdx: schedule.getWeekIdx(idx),
    });
    if (!(e.button == 0 || e.touches)) return false; //좌클릭, 터치 이외는 전부 false
    this.areaHook.setIsAreaClickDown(true); //클릭 상태
    switch (this.interfaceHook.auth) {
        case 'user':
            this.areaHook.setIsAreaAppend(table.isFillArea(this.areaHook.areaData, idx)); //대상이 빈칸인지
            break;
        case 'admin':
            this.areaHook.setIsAreaAppend(table.isFillArea(this.areaSelectHook.filter, idx)); //대상이 빈칸인지
            break;
    }
};

AreaEvent.prototype.clickOver = function (idx) {
    if (this.interfaceHook.auth === 'admin' && this.interfaceHook.target === 'teacher') return false; //드래그 금지
    if (this.areaHook.isAreaClickDown) {
        this.areaHook.setIsLongTouch(true);
        const startOverIdx = this.areaHook.areaObj.idx;
        const endOverIdx = Number(idx);
        const startOverDayIdx = schedule.getWeekIdx(startOverIdx);
        const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
        const startRange = schedule.getTimeIdx(startOverIdx);
        const endRange = schedule.getTimeIdx(endOverIdx);
        const intervalDay = _.range(
            startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
            startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1,
        );
        const selectedInfo = _.flatten(
            intervalDay.reduce((result, e) => {
                //선택한 셀 값
                result.push(
                    _.range(e * 96 + 32 + startRange, e * 96 + 32 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                        return { timeBlockId: ee };
                    }),
                );
                return result;
            }, []),
        );
        this.clearCell();
        selectedInfo.map(o => {
            document.querySelector(`.contents.${this.interfaceHook.target} .seq_${o.timeBlockId}`)?.classList.add('dragging');
        });
    }
};

AreaEvent.prototype.clickUp = function (e, idx, openMatchingModal) {
    if (!this.areaHook.isAreaClickDown) {
        return false;
    }
    const startOverIdx = this.areaHook.areaObj.idx;
    const endOverIdx = Number(idx);
    const startOverDayIdx = schedule.getWeekIdx(startOverIdx);
    const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
    const startRange = schedule.getTimeIdx(startOverIdx);
    const endRange = schedule.getTimeIdx(endOverIdx);
    const intervalDay = _.range(
        startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
        startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1,
    );
    const selectedInfo = _.flatten(
        intervalDay.reduce((result, e) => {
            //선택한 셀 값
            result.push(
                _.range(e * 96 + 32 + startRange, e * 96 + 32 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
                    return { timeBlockId: ee };
                }),
            );
            return result;
        }, []),
    );
    this.areaSelectHook.setLecture(selectedInfo);
    this.areaHook.setAreaObj({
        ...this.areaHook.areaObj,
        startOverIdx: startRange < endRange ? startRange : endRange,
        endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
        startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
        endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
    });

    if (!(e.button == 0 || e.touches)) return false; //좌클릭, 터치 이외는 전부 false
    this.areaHook.setIsAreaClickDown(false); //클릭 상태
    if (this.interfaceHook.auth === 'user') {
        //일반 과목 선택 모드
        if (!this.areaHook.isLongTouch) {
            //셀 클릭시
            this.areaHook.setAreaObj({
                idx: idx,
                startOverIdx: schedule.getTimeIdx(idx),
                endOverIdx: schedule.getTimeIdx(idx + 4),
                startOverDayIdx: schedule.getWeekIdx(idx),
                endOverDayIdx: schedule.getWeekIdx(idx),
            });
            const limitIdx = idx => {
                if (idx > 101 && idx < 128) return 102;
                else if (idx > 197 && idx < 224) return 198;
                else if (idx > 293 && idx < 320) return 294;
                else if (idx > 389 && idx < 416) return 390;
                else if (idx > 485 && idx < 512) return 486;
                else if (idx > 581 && idx < 607) return 582;
                else if (idx > 677) return 678;
                else return idx;
            };
            const defaultRange = _.range(idx, limitIdx(idx + 4));
            const result = defaultRange.map(e => {
                return { timeBlockId: e, lectureSubjectId: [this.interfaceHook.subject] };
            });
            if (this.areaHook.isAreaAppend) {
                const pickBlockData = _.intersectionBy(this.areaHook.areaData, result, 'timeBlockId');
                const pickByLectureData = _.filter(pickBlockData, { lectureSubjectId: [this.interfaceHook.subject] });
                const fixedItem = this.itemHook.fixedItemData; //item data
                const classTakingData = pickByLectureData.reduce((result, e) => {
                    // 수강중인 과목 삭제안되게
                    !_.find(fixedItem, function (o) {
                        return o.timeBlockId === e.timeBlockId;
                    }) && result.push(e);
                    return result;
                }, []);
                // const pickByAllLectureData = _.filter(pickBlockData, { lectureSubjectId: ['all'] });
                const isTargetOnLecture = _.find(this.areaHook.areaData, { timeBlockId: idx })?.lectureSubjectId.includes(this.interfaceHook.subject); //선택한 과목과 터치한 영역값의 lecture 일치 여부
                if (isTargetOnLecture) {
                    // this.removeAll(pickByLectureData);
                    this.removeAll(classTakingData);
                }
            } else {
                this.add(result, [this.interfaceHook.subject]);
            }
        } else {
            //셀 드래그 앤 드롭
            if (selectedInfo.length > 0) {
                const result = selectedInfo.map(e => {
                    return { timeBlockId: e.timeBlockId, lectureSubjectId: [this.interfaceHook.subject] };
                });
                if (!this.areaHook.isAreaAppend) {
                    //추가할때
                    this.add(result, [this.interfaceHook.subject]);
                } else {
                    //삭제할때
                    //>매칭중 상태값의 과목은 삭제 안되게하고 알림 띄워줌
                    //>데이터 미적재 이슈와 매칭됨 상태값이 충돌나면 관리자가 아닌 유저화면에서는 등록/제출을 하지못하는 에러가 예상됨. 매칭중 상태값은 validation check를 하지않게 처리
                    const pickBlockData = _.intersectionBy(this.areaHook.areaData, selectedInfo, 'timeBlockId'); //선택한 블록의 전체값
                    const fixedItem = this.itemHook.fixedItemData;
                    const classTakingData = pickBlockData.reduce((result, e) => {
                        // 수강중인 과목 삭제안되게
                        !_.find(fixedItem, function (o) {
                            return o.timeBlockId === e.timeBlockId;
                        }) && result.push(e);
                        return result;
                    }, []);
                    // console.log(fixedItem);
                    // console.log(pickBlockData);
                    const processingDetailList = [];
                    const processingList = schedule.processingData?.reduce((result, e) => {
                        result.push(e.subject.subjectId);
                        processingDetailList.push({ subjectId: e.subject.subjectId, subjectName: e.subject.subjectName });
                        return result;
                    }, []); //매칭 프로세스 상태의 과목값
                    const processingAlertList = [];
                    const withoutProcessingData = classTakingData.reduce((result, e) => {
                        _.isEmpty(_.intersection(e.lectureSubjectId, processingList))
                            ? result.push(e)
                            : processingAlertList.push(_.intersection(e.lectureSubjectId, processingList));
                        return result;
                    }, []); //매칭 프로세스의 과목을 제외한 선택한 배열값
                    this.removeAll(withoutProcessingData);

                    const flatList = _.uniqBy(_.flatten(processingAlertList));
                    const crashList = _.filter(processingDetailList, function (o) {
                        return flatList.includes(o.subjectId);
                    });
                    !_.isEmpty(crashList) && //매칭중인 과목이 삭제영역에 포함됨을 알림
                        window.postMessage(
                            {
                                id: 'onuii-time-table',
                                name: 'responseAlertMessage',
                                data:
                                    '매칭중인 과목은 희망 시간대 변경이 불가능합니다. 대상:' +
                                    _.join(
                                        crashList.map(o => {
                                            return o.subjectName;
                                        }),
                                    ),
                            },
                            '*',
                        );
                }
                this.clearCell();
            }
        }
    } else {
        //admin
        if (this.interfaceHook.target === 'teacher') {
            //셀 클릭시
            if (this.interfaceHook.target === 'teacher' && !_.isNull(this.interfaceHook.subject) && this.areaHook.areaObj.idx === idx) {
                const tempMatching = _.range(idx, idx + this.interfaceHook.lessonTime.time).map(e => {
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
                this.clearCell();
                if (!this.areaHook.isAreaAppend) {
                    this.areaSelectHook.setFilter([...this.areaSelectHook.filter, ...selectedInfo]);
                } else {
                    const removeResult = _.reject(this.areaSelectHook.filter, o => {
                        return selectedInfo.some(item => item.timeBlockId === o.timeBlockId);
                    });
                    this.areaSelectHook.setFilter(removeResult);
                }
            }
        }
    }
    this.areaHook.setIsLongTouch(false);
};

AreaEvent.prototype.clickCancel = function () {
    this.areaHook.setIsAreaClickDown(false);
    this.areaHook.setIsLongTouch(false);
    this.areaSelectHook.setLecture([]);
    this.areaHook.setAreaObj({});
    this.clearCell();
};
// AreaEvent.prototype.clickUp = function (e, idx, openLectureModal, openMatchingModal) {
//     const startOverIdx = this.areaHook.areaObj.idx;
//     const endOverIdx = Number(idx);
//     const startOverDayIdx = schedule.getWeekIdx(startOverIdx);
//     const endOverDayIdx = schedule.getWeekIdx(endOverIdx);
//     const startRange = schedule.getTimeIdx(startOverIdx);
//     const endRange = schedule.getTimeIdx(endOverIdx);
//     const intervalDay = _.range(
//         startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
//         startOverDayIdx > endOverDayIdx ? startOverDayIdx + 1 : endOverDayIdx + 1,
//     );
//     const selectedInfo = _.flatten(
//         intervalDay.reduce((result, e) => {
//             //선택한 셀 값
//             result.push(
//                 _.range(e * 96 + 32 + startRange, e * 96 + 32 + endRange + (startRange < endRange ? 1 : -1)).map(ee => {
//                     return { timeBlockId: ee };
//                 }),
//             );
//             return result;
//         }, []),
//     );
//     this.areaSelectHook.setLecture(selectedInfo);
//     this.areaHook.setAreaObj({
//         ...this.areaHook.areaObj,
//         startOverIdx: startRange < endRange ? startRange : endRange,
//         endOverIdx: startRange > endRange ? startRange + 1 : endRange + 1,
//         startOverDayIdx: startOverDayIdx < endOverDayIdx ? startOverDayIdx : endOverDayIdx,
//         endOverDayIdx: startOverDayIdx > endOverDayIdx ? startOverDayIdx : endOverDayIdx,
//     });

//     if (!(e.button == 0 || e.touches)) return false; //좌클릭, 터치 이외는 전부 false
//     this.areaHook.setIsAreaClickDown(false); //클릭 상태
//     if (this.interfaceHook.auth === 'user') {
//         //과목 추가는 유저 모드에서만 가능(어드민도 과목 추가 화면은 유저기능으로)
//         //일반 과목 선택 모드
//         // if (_.isEmpty(selectedInfo)) {
//         if (!this.areaHook.isLongTouch) {
//             //셀 클릭시
//             openLectureModal();
//             this.areaHook.setAreaObj({
//                 idx: idx,
//                 startOverIdx: schedule.getTimeIdx(idx),
//                 endOverIdx: schedule.getTimeIdx(idx + 4),
//                 startOverDayIdx: schedule.getWeekIdx(idx),
//                 endOverDayIdx: schedule.getWeekIdx(idx),
//             });
//             const limitIdx = idx => {
//                 if (idx > 101 && idx < 128) return 102;
//                 else if (idx > 197 && idx < 224) return 198;
//                 else if (idx > 293 && idx < 320) return 294;
//                 else if (idx > 389 && idx < 416) return 390;
//                 else if (idx > 485 && idx < 512) return 486;
//                 else if (idx > 581 && idx < 607) return 582;
//                 else if (idx > 677) return 678;
//                 else return idx;
//             };

//             _.range(idx, idx + 4).map(o => {
//                 document.querySelector(`.contents.${this.interfaceHook.target} .seq_${o}`).classList.add('dragging');
//             });
//             this.areaSelectHook.setLecture(
//                 _.range(idx, limitIdx(idx + 4)).map(e => {
//                     return { timeBlockId: e };
//                 }),
//             );
//         } else {
//             //셀 드래그 앤 드롭
//             if (selectedInfo.length > 0) {
//                 openLectureModal();
//             }
//         }
//     } else {
//         //admin
//         // if (_.isEmpty(selectedInfo)) {
//         if (this.interfaceHook.target === 'teacher') {
//             //셀 클릭시
//             if (this.interfaceHook.target === 'teacher' && !_.isNull(this.interfaceHook.subject) && this.areaHook.areaObj.idx === idx) {
//                 const tempMatching = _.range(idx, idx + this.interfaceHook.lessonTime.time).map(e => {
//                     return { timeBlockId: e };
//                 });
//                 this.areaSelectHook.setMatchingTarget(tempMatching);
//                 openMatchingModal();
//             }
//             // 정규 , 다른가매칭 시간 예외처리 후 post message to admin.
//         } else {
//             //셀 드래그 앤 드롭
//             if (this.interfaceHook.target === 'student') {
//                 this.areaSelectHook.setLecture([]);
//                 this.clearCell();
//                 if (!this.areaHook.isAreaAppend) {
//                     this.areaSelectHook.setFilter([...this.areaSelectHook.filter, ...selectedInfo]);
//                 } else {
//                     const removeResult = _.reject(this.areaSelectHook.filter, o => {
//                         return selectedInfo.some(item => item.timeBlockId === o.timeBlockId);
//                     });
//                     this.areaSelectHook.setFilter(removeResult);
//                 }
//             }
//         }
//     }
//     this.areaHook.setIsLongTouch(false);
// };

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
        // console.log(this.itemHook.itemObj, groupData, idx);
        // if (idx > 34) {
        // } else {
        const checkCrash = schedule.checkCrashItemTime(groupData, idx, endTime, this.itemHook.itemObj.lectureId);
        if (!_.isEmpty(checkCrash)) {
            this.interfaceHook.setMessage(checkCrash);
            return false;
        }
        // }
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
