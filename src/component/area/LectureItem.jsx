import React, { useEffect, useState } from 'react';
import { lecture } from '../../util/lecture';
import styled from 'styled-components';
import _ from 'lodash';
import { styled as sstyled } from '../../style/stitches.config';

const Header = sstyled('div', {
    height: '8px',
});
const MainTitle = sstyled('div', {
    variants: {
        justify: {
            bp1: { paddingLeft: '4px', paddingTop: '6px', fontSize: '13px', fontWeight: '700', lineHeight: '15.51px' },
            bp5: {
                paddingLeft: '10px',
                paddingTop: '10px',
                fontSize: '18px',
                fontWeight: '700',
                lineHeight: '21.48px',
            },
        },
        auth: {
            admin: {
                fontSize: '14px !important',
            },
        },
    },
});
const SubTitle = sstyled('div', {
    variants: {
        justify: {
            bp1: { paddingLeft: '4px', paddingTop: '2px', fontSize: '12px', fontWeight: '500', lineHeight: '16px' },
            bp5: {
                paddingLeft: '10px',
                paddingTop: '3px',
                fontSize: '16px',
                fontWeight: '500',
                lineHeight: '19px',
                lineHeight: '17.9px',
            },
        },
        auth: {
            admin: {
                fontSize: '11px !important',
            },
        },
    },
});
const FoldPageFront = sstyled('div', {
    transform: 'rotate(-90deg)',
    width: '18px',
    height: '18px',
    right: '-8px',
    position: 'absolute',
    bottom: '-9px',
});
const FoldPageBack = sstyled('div', {
    background: '#FFFFFF !important',
    transform: 'matrix(0.5, -0.5, -0.5, -0.5, 0, 0)',
    width: '18px',
    height: '18px',
    right: '-8px',
    position: 'absolute',
    bottom: '-9px',
});

const Layout = styled.div.attrs(props => ({
    className: `area _${props.lecture_id} color${props.colorIndex} ${
        // props.target === 'student' && props.auth === 'admin' && props.subject && props.subject != props.lecture_id && 'disabled'
        props.target === 'student' && props.subject && props.subject != props.lecture_id && 'disabled'
    }`,
}))`
    display: inline-block;
    // height: 100%;
    height: 29px;
    // width: ${props => (100 - 15) / props.length}%;
    width: 100%;
    position: absolute;
    // left: ${props => props.seq * ((100 - 15) / props.length)}%;
    left: 1px;
    &.head {
        opacity: 1;
        text-align: left;
        // border-radius: 5px 5px 0px 0px;
    }
    &.last {
        // border-radius: 0 0 5px 5px;
        overflow: hidden;
        bottom: 0px;
    }
    &.head.last {
        opacity: 1;
        // border-radius: 5px 5px 5px 5px;
        font-size: 12px;
    }
    span {
        position: relative;
        // top: 2px;
        z-index: 31;
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
        if (!_.isEmpty(areaHook.areaGroupData)) {
            const getGroupIdx = _.find(areaHook.areaGroupData, e => {
                return _.inRange(idx, e.startIdx, e.endIdx + 1);
            });
            setLength(getGroupIdx?.newLength);
            setSeq(_.indexOf(getGroupIdx?.lectureSubjectId, id));
        }
    }, [areaHook.areaGroupData]);
    const $before = _.find(areaHook.areaData, { timeBlockId: idx - 1 });
    const $next = _.find(areaHook.areaData, { timeBlockId: idx + 1 });
    const isEmptyBefore = _.isEmpty($before);
    const isEmptyNext = _.isEmpty($next);
    const isEqualBefore = _.indexOf($before?.lectureSubjectId, id) > -1;
    const isEqualNext = _.indexOf($next?.lectureSubjectId, id) > -1;
    const isFirst = isEmptyBefore || !isEqualBefore;
    const isLast = isEmptyNext || !isEqualNext;
    const colorIndex = interfaceHook.target === 'student' ? _.findIndex(interfaceHook?.userData?.lectureData, { lectureId: id }) : '_all';
    // const getMainSubject = subject => {
    //     if (_.inRange(subject, 9788, 9797 + 1) || _.inRange(subject, 9810, 9811 + 1)) {
    //         return '사회';
    //     } else if (_.inRange(subject, 9798, 9805 + 1) || _.inRange(subject, 9812, 9813 + 1)) {
    //         return '과학';
    //     } else if (_.inRange(subject, 9826, 9834 + 1)) {
    //         return '제2외국어';
    //     } else {
    //         return null;
    //     }
    // };
    const bp = {
        '@bp1': 'bp1',
        '@bp5': 'bp5',
    };
    return (
        <Layout
            lecture_id={id}
            colorIndex={colorIndex}
            className={`${isFirst ? 'head' : ''} ${isLast ? 'last' : ''} `}
            length={length}
            seq={seq}
            subject={interfaceHook.subject}
            target={interfaceHook.target}
            auth={interfaceHook.auth}
        >
            {isFirst && <Header className={`hcolor${colorIndex}`}>{}</Header>}
            {isFirst && (
                <span className={`ignoreEnter`}>
                    {_.isNull(lecture.getMainSubject(id)) ? (
                        <MainTitle justify={{ ...bp }} auth={interfaceHook.auth}>
                            {lecture.getLectureName(id)}
                        </MainTitle>
                    ) : (
                        <React.Fragment>
                            <MainTitle justify={{ ...bp }} auth={interfaceHook.auth}>
                                {lecture.getMainSubject(id)}
                            </MainTitle>
                            <SubTitle justify={{ ...bp }} auth={interfaceHook.auth}>
                                {lecture.getLectureName(id)}
                            </SubTitle>
                        </React.Fragment>
                    )}
                </span>
            )}
            {isLast && interfaceHook.target === 'student' && (
                <React.Fragment>
                    <FoldPageFront className={`hcolor${colorIndex}`} />
                    <FoldPageBack />
                </React.Fragment>
            )}
        </Layout>
    );
}
export default LectureItem;
