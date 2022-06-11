import React, { useEffect } from 'react';
import { lecture } from '../../util/lecture';
import styled from 'styled-components';
import _ from 'lodash';
import { useSelector } from 'react-redux';
const Layout = styled.div.attrs(props => ({
    className: `lecture_${props.lecture_id}`,
}))`
    display: inline-block;
    height: 100%;
    width: 15px;
    opacity: 0.7;
    &.head {
        opacity: 1;
        // border-radius: 50% !important;
        height: 18px;
        font-size: 11px;
        // -webkit-filter: brightness(100%);
    }
    &.last {
        border-radius: 0 0 50% 50%;
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
function LectureItem({ id, idx, length, seq }) {
    const { areaData } = useSelector(state => state.schedule);
    console.log(idx, length, seq);
    const $before = _.find(areaData, { block_group_No: idx - 1 });
    const $this = _.find(areaData, { block_group_No: idx });
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
            <span className={`lecture_${id} ignoreEnter`}>{isFirst ? lecture.getLectureName(id).slice(0, 1) : ''}</span>
            {isFirst && !isLast && <div className={`corner lecture_${id}`}></div>}
        </Layout>
    );
}
export default LectureItem;