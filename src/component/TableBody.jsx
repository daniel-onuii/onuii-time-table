import React, { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setItemGroupData, setTableData } from '../store/reducer/schedule.reducer';
import { lecture } from '../util/lecture';
import _ from 'lodash';
import { table } from '../util/table';
import Area from './Area';
import FixedItem from './FixedItem';
import { schedule } from '../util/schedule';
function TableBody() {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const tableData = useSelector(state => state.schedule.tableData);
    const itemData = useSelector(state => state.schedule.itemData);
    const itemGroupData = useSelector(state => state.schedule.itemGroupData);
    const timeListData = useSelector(state => state.schedule.timeListData);
    const areaData = useSelector(state => state.schedule.areaData);
    const itemObj = useSelector(state => state.trigger.itemObj);
    const areaObj = useSelector(state => state.trigger.areaObj, shallowEqual);
    const areaGrabbedObj = useSelector(state => state.trigger.areaGrabbedObj);

    useEffect(() => {
        ///이쪽 코드 리팩토링
        const flatData = _.flatten(tableData);
        const testA = flatData.reduce((result, e) => {
            _.find(areaData, { block_group_No: e.block_group_No }) ? result.push({ ...e, isActiveArea: true }) : result.push(e);
            return result;
        }, []);
        const testB = testA.reduce((result, e) => {
            _.find(itemData, { block_group_No: e.block_group_No }) ? result.push({ ...e, isActiveLecture: true }) : result.push(e);
            return result;
        }, []);
        const testC = _(testB)
            .groupBy(x => x.rowNum)
            .value();
        dispatch(setTableData(_.values(testC)));
    }, [areaData]);

    // useEffect(() => {
    //     console.log(tableData);
    // }, [tableData]);

    useEffect(() => {
        dispatch(setItemGroupData(lecture.getGroupByLectureTime(itemData)));
    }, [itemData]);
    return (
        <div className="contents" ref={tableRef}>
            <table>
                <tbody>
                    {/* {timeListData.map((e, i) => {
                        const isOntime = i % 4 === 0; //정시조건
                        return (
                            <tr key={i} className={isOntime ? 'tr_parent' : ''}>
                                {isOntime ? <th rowSpan="4">{e}</th> : null}
                                {_.range(0, 7).map((e, ii) => {
                                    const idx = table.getBlockId(e, i);
                                    return (
                                        <td key={idx} className={`${e >= 6 ? 'weekend' : ''}`}>
                                            <Area idx={idx} areaData={areaData} itemData={itemData} areaObj={areaObj} itemObj={itemObj} areaGrabbedObj={areaGrabbedObj} />
                                            {itemGroupData.some(y => y.startIdx === idx) && <FixedItem idx={idx} itemData={itemData} itemGroupData={itemGroupData} itemObj={itemObj} />}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })} */}

                    {tableData.map((row, i) => {
                        const isOntime = i % 4 === 0; //정시조건
                        return (
                            <tr key={i} className={isOntime ? 'tr_parent' : ''}>
                                {isOntime ? <th rowSpan="4">{row[0].rowNum}</th> : null}
                                {_.range(0, 7).map(seq => {
                                    const idx = row[seq].block_group_No;
                                    // console.log(idx, i, seq, row, row[seq]);
                                    return (
                                        <td key={idx} className={`${seq == 6 ? 'weekend' : ''}`}>
                                            <Area
                                                tableData={tableData}
                                                idx={idx}
                                                isGrabbed={row[seq].isGrabbed}
                                                isActiveArea={row[seq].isActiveArea}
                                                areaType={row[seq].areaType}
                                                lectureType={''}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TableBody;
