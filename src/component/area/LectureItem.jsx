import React, { useEffect, useState } from 'react';
import { lecture } from '../../util/lecture';
import styled from 'styled-components';
import _ from 'lodash';
const Layout = styled.div.attrs(props => ({
    className: `area _${props.lecture_id} ${
        props.target === 'student' && props.auth === 'admin' && props.lvt && props.lvt != props.lecture_id && 'disabled'
    }`,
}))`
    display: inline-block;
    height: 100%;
    width: ${props => (100 - 15) / props.length}%;
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
function LectureItem({ id, idx, areaHook, interfaceHook }) {
    const [length, setLength] = useState(0);
    const [seq, setSeq] = useState(0);
    useEffect(() => {
        const getGroupIdx = _.find(areaHook.areaGroupData, e => {
            return _.inRange(idx, e.startIdx, e.endIdx + 1);
        });
        setLength(getGroupIdx?.lectureIds?.length);
        setSeq(_.indexOf(getGroupIdx?.lectureIds, id));
    }, [areaHook.areaGroupData]);
    const $before = _.find(areaHook.areaData, { timeBlockId: idx - 1 });
    const $next = _.find(areaHook.areaData, { timeBlockId: idx + 1 });
    const isEmptyBefore = _.isEmpty($before);
    const isEmptyNext = _.isEmpty($next);
    const isEqualBefore = _.indexOf($before?.lectureIds, id) > -1;
    const isEqualNext = _.indexOf($next?.lectureIds, id) > -1;
    const isFirst = isEmptyBefore || !isEqualBefore;
    const isLast = isEmptyNext || !isEqualNext;
    return (
        <Layout
            lecture_id={id}
            className={`${isFirst ? 'head' : ''} ${isLast ? 'last' : ''} `}
            length={length}
            seq={seq}
            lvt={interfaceHook.lvt}
            target={interfaceHook.target}
            auth={interfaceHook.auth}
        >
            <span className={`ignoreEnter`}>{isFirst ? `${lecture.getLectureName(id)}` : ''}</span>
        </Layout>
    );
}
export default LectureItem;
