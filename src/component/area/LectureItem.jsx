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
    width: 20px; ///
    opacity: 0.7;
    &.head {
        opacity: 1;
        border-radius: 50% !important;
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
function LectureItem({ id, idx }) {
    const { areaData } = useSelector(state => state.schedule);
    const $this = _.find(areaData, { block_group_No: idx });
    const isFirst = _.find(areaData, { block_group_No: idx - 1 }); //과목값의 첫번째인지
    const isEqual = _.isEqual($this?.areaActiveType, isFirst?.areaActiveType); //과목 배열값이 동일한지
    const isRealFirst = isFirst == null || !isEqual;
    const isLast = _.find(areaData, { block_group_No: idx + 1 }); //과목 다음값이 없거나 다르면 백그라운드 지우기
    const isNextEqual = _.isEqual($this?.areaActiveType, isLast?.areaActiveType); //다음값과 비교
    //isFirst가 null이거나 areaActiveType이 다른값 체크

    // -webkit-filter: brightness(110%);
    return (
        <Layout lecture_id={id} className={`${isRealFirst ? 'head' : ''} ${!isLast && 'last'} ${isLast && !isNextEqual && 'last'}`}>
            <span className={`lecture_${id} ignoreEnter`}>
                {id === 'all' ? '상관없음' : isRealFirst ? lecture.getLectureName(id).slice(0, 1) : ''}
            </span>
            {isRealFirst && isNextEqual && <div className={`corner lecture_${id}`}></div>}
        </Layout>
    );
}
export default LectureItem;
