import React, { useEffect, useState } from 'react';
import { lecture } from '../../util/lecture';
import styled from 'styled-components';
import _ from 'lodash';
import { useSelector } from 'react-redux';
const Layout = styled.div.attrs(props => ({
    className: `lecture_${props.lecture_id}`,
}))`
    display: inline-block;
    height: 100%;
    width: ${props => 85 / props.length}%;
    // opacity: 0.7;
    position: absolute;
    left: ${props => props.seq * ((100 - 15) / props.length)}%;
    &.head {
        opacity: 1;
        // border-radius: 50% !important;
        border-radius: 5px 5px 0px 0px;
        // height: 18px;
        font-size: 11px;
    }
    &.last {
        border-radius: 0 0 5px 5px;
    }
    span {
        position: relative;
        top: 2px;
        z-index: 1;
    }
    .corner {
        height: 100%;
        opacity: 0.7;
        position: relative;
        top: -5px;
    }
`;
function LectureItem({ id, idx }) {
    const { areaData, areaGroupData } = useSelector(state => state.schedule);
    const [length, setLength] = useState(0);
    const [seq, setSeq] = useState(0);
    // const [rowIdx, setRowIdx] = useState();
    useEffect(() => {
        const getGroupIdx = _.find(areaGroupData, e => {
            return _.inRange(idx, e.startIdx, e.endIdx + 1);
        });
        // console.log(getGroupIdx);
        // setRowIdx(idx - getGroupIdx?.startIdx);
        setLength(getGroupIdx?.areaActiveType?.length);
        setSeq(_.indexOf(getGroupIdx?.areaActiveType, id));
    }, [areaGroupData]);

    const $before = _.find(areaData, { block_group_No: idx - 1 });
    // const $this = _.find(areaData, { block_group_No: idx });
    const $next = _.find(areaData, { block_group_No: idx + 1 });
    const isEmptyBefore = _.isEmpty($before);
    const isEmptyNext = _.isEmpty($next);
    // const isEqualBefore = _.indexOf($this?.areaActiveType, id) === _.indexOf($before?.areaActiveType, id);
    const isEqualBefore = _.indexOf($before?.areaActiveType, id) > -1;
    // const isEqualNext = _.indexOf($this?.areaActiveType, id) === _.indexOf($next?.areaActiveType, id);
    const isEqualNext = _.indexOf($next?.areaActiveType, id) > -1;
    const isFirst = isEmptyBefore || !isEqualBefore;
    const isLast = isEmptyNext || !isEqualNext;
    return (
        <Layout lecture_id={id} className={`${isFirst && 'head'} ${isLast && 'last'} `} length={length} seq={seq}>
            <span className={`lecture_${id} ignoreEnter`}>
                {/* {isFirst ? lecture.getLectureName(id).slice(0, 1) : ''} */}
                {isFirst ? `${lecture.getLectureName(id)}` : ''}
                {/* {rowIdx} */}
                {/* {seq} */}
            </span>
            {/* {isFirst && !isLast && <div className={`corner lecture_${id}`}></div>} */}
        </Layout>
    );
}
export default LectureItem;
