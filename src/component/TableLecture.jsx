import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ScrollContainer from 'react-indiana-drag-scroll';
import { schedule } from '../util/schedule';
import { lecture } from '../util/lecture';
import { styled as sstyled } from '../style/stitches.config';

const Container = sstyled('div', {
    // background: 'red',
    variants: {
        // justify: {
        //     bp1: { maxWidth: '100%' },
        //     bp2: { maxWidth: '100%' },
        //     bp3: { maxWidth: '100%' },
        //     bp4: { maxWidth: '100%' },
        //     bp5: { maxWidth: '100%' },
        //     bp6: { maxWidth: '100%' },
        // },
    },
});

const Card = sstyled('button', {
    '& .titleWrap div': {},
    border: 'none',
    textAlign: 'left',
    padding: '0px',
    marginRight: '10px',
    variants: {
        justify: {
            bp1: {
                fontSize: '17px',
                fontWeight: 700,
                lineHeight: '20.29px',
            },
            bp5: {
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '21.48px',
            },
        },
    },
});
const MainTitle = sstyled('div', {
    display: 'inline-block',
    variants: {
        justify: {
            bp1: {
                fontSize: '17px',
                fontWeight: 700,
                lineHeight: '20.29px',
                paddingLeft: '10px',
                paddingTop: '10px',
            },
            bp5: {
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '21.48px',
                paddingLeft: '14px',
                paddingTop: '12px',
            },
        },
    },
});
const SubTitle = sstyled('div', {
    display: 'inline-block',
    variants: {
        justify: {
            bp1: { paddingLeft: '4px', paddingTop: '11px', paddingRight: '10px', fontSize: '15px', fontWeight: 500, lineHeight: '17.9px' },
            bp5: { paddingLeft: '5px', paddingTop: '14px', paddingRight: '10px', fontSize: '15px', fontWeight: 500, lineHeight: '17.9px' },
        },
    },
});
const Time = sstyled('div', {
    color: '#777777',
    variants: {
        justify: {
            bp1: {
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: '21px',
                padding: '2px 10px 10px 10px',
            },
            bp5: {
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '21px',
                padding: '2px 14px 12px 14px',
            },
        },
    },
});
const ActiveBar = sstyled('div', {
    variants: {
        justify: {
            bp1: { height: '6px', width: '100%' },
            bp5: {},
        },
    },
});

const Layout = styled.div`
    cursor: grab;
    max-width: 768px;
    min-width: 375px;
    margin-top: 10px;
    .rail {
        min-width: 375px;
        width: ${props => props.width}px !important;
    }
    .disabled {
        text-decoration: line-through;
        opacity: 0.3;
    }
`;
function TableLecture(props) {
    const btnRef = useRef();
    const [dynamicWidth, setDynamicWidth] = useState(9999);
    const lectureData = props.interfaceHook?.userData?.lectureData;
    const processingList = schedule.processingData?.reduce((result, e) => {
        result.push(e.subject.subjectId);
        return result;
    }, []); //매칭 프로세스 상태의 과목값
    const handleChangeLecture = e => {
        const val = e.currentTarget.value;
        props.interfaceHook.setSubject(val === 'all' ? 'all' : Number(val));
    };
    const postMessage = () => {
        window.postMessage(
            {
                id: 'onuii-time-table',
                name: 'responseAlertMessage',
                data: '해당 과목은 매칭중이라 선택/수정이 불가능합니다.',
            },
            '*',
        );
    };
    useEffect(() => {
        if (!_.isEmpty(lectureData)) {
            const btns = document.querySelectorAll('.lectureBtn');
            let maxWidth = 0;
            Array.from(btns).map(e => {
                maxWidth += e.clientWidth + 10;
            });
            setDynamicWidth(maxWidth + 10);
        }
    }, [lectureData]);
    const bp = {
        '@bp1': 'bp1',
        '@bp5': 'bp5',
    };
    return (
        <Container id={'lectureBtnArea'}>
            {lectureData && (
                <ScrollContainer className="scroll-container" vertical={false}>
                    <Layout width={dynamicWidth}>
                        <div className="rail">
                            {lectureData.map((e, i) => {
                                const isProcessing = processingList?.includes(e.lectureId);
                                const lessonTime = ` 주 ${e.lesson_time?.split('_')[0].replace('W', '')}회 ${e.lesson_time
                                    ?.split('_')[1]
                                    ?.replace('H', '')}분`;
                                return (
                                    <Card
                                        justify={{ ...bp }}
                                        key={i}
                                        className={`lectureBtn color${i} ${props.interfaceHook.subject === e.lectureId ? 'active' : ''} ${
                                            isProcessing ? 'disabled' : ''
                                        }`}
                                        onClick={isProcessing ? postMessage : handleChangeLecture}
                                        value={e.lectureId}
                                    >
                                        <div className="titleWrap">
                                            {props.interfaceHook.subject === e.lectureId && (
                                                <ActiveBar className={`hcolor${i}`} justify={{ ...bp }} />
                                            )}
                                            {_.isNull(lecture.getMainSubject(e.lectureId)) ? (
                                                <MainTitle justify={{ ...bp }}>{lecture.getLectureName(e.lectureId)}</MainTitle>
                                            ) : (
                                                <React.Fragment>
                                                    <MainTitle justify={{ ...bp }}>{lecture.getMainSubject(e.lectureId)}</MainTitle>
                                                    <SubTitle justify={{ ...bp }}>{lecture.getLectureName(e.lectureId)}</SubTitle>
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <Time justify={{ ...bp }}>{lessonTime}</Time>
                                    </Card>
                                );
                            })}
                        </div>
                    </Layout>
                </ScrollContainer>
            )}
        </Container>
    );
}

export default TableLecture;
