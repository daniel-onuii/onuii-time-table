import React, { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setItemGroupData } from '../store/reducer/schedule.reducer';
import { lecture } from '../util/lecture';
import _ from 'lodash';
import { table } from '../util/table';
import Area from './Area';
import FixedItem from './FixedItem';
function TableBody() {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const itemData = useSelector(state => state.schedule.itemData);
    const itemGroupData = useSelector(state => state.schedule.itemGroupData);
    const timeListData = useSelector(state => state.schedule.timeListData);
    const areaData = useSelector(state => state.schedule.areaData);
    const itemObj = useSelector(state => state.trigger.itemObj);
    const areaObj = useSelector(state => state.trigger.areaObj, shallowEqual);
    const areaGrabbedObj = useSelector(state => state.trigger.areaGrabbedObj);

    useEffect(() => {
        console.log(areaData, itemData, timeListData);
    }, [areaData]);

    useEffect(() => {
        dispatch(setItemGroupData(lecture.getGroupByLectureTime(itemData)));
    }, [itemData]);
    return (
        <div className="contents" ref={tableRef}>
            <table>
                <tbody>
                    {timeListData.map((e, i) => {
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
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TableBody;
