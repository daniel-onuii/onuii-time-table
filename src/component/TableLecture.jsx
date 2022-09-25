import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ScrollContainer from 'react-indiana-drag-scroll';
import { schedule } from '../util/schedule';
import { styled as sstyled } from '../style/stitches.config';

const Container = sstyled('div', {
    // background: 'red',
    variants: {
        justify: {
            bp1: { maxWidth: '320px' },
            bp2: { maxWidth: '375px' },
            bp3: { maxWidth: '425px' },
            bp4: { maxWidth: '768px' },
            bp5: { maxWidth: '1024px' },
            bp6: { maxWidth: '100%' },
        },
    },
});

const Layout = styled.div`
    cursor: grab;
    max-width: 768px;
    min-width: 375px;
    margin-top: 10px;
    div {
        min-width: 375px;
        width: ${props => props.width}px;
    }
    button.active {
        border: 2px solid rgb(92, 85, 247);
    }
    button {
        cursor: grab;
        color: #333333;
        border: none;
        border-radius: 5px;
        padding: 3px 10px;
        font-weight: bold;
        margin-left: 10px;
    }
    button:hover {
        -webkit-filter: brightness(110%);
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
        const val = e.target.value;
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
    return (
        <Container
            justify={{
                '@bp1': 'bp1',
                '@bp2': 'bp2',
                '@bp3': 'bp3',
                '@bp4': 'bp4',
                '@bp5': 'bp5',
                '@bp6': 'bp6',
            }}
            id={'lectureBtnArea'}
        >
            {lectureData && (
                <ScrollContainer className="scroll-container" vertical={false}>
                    <Layout width={dynamicWidth}>
                        <div>
                            {lectureData.map((e, i) => {
                                const isProcessing = processingList?.includes(e.lectureId);
                                const lessonTime = ` 주${e.lesson_time?.split('_')[0].replace('W', '')}회 ${e.lesson_time
                                    ?.split('_')[1]
                                    ?.replace('H', '')}분`;
                                return (
                                    <button
                                        key={i}
                                        className={`lectureBtn color${i} ${props.interfaceHook.subject === e.lectureId ? 'active' : ''} ${
                                            isProcessing ? 'disabled' : ''
                                        }`}
                                        onClick={isProcessing ? postMessage : handleChangeLecture}
                                        value={e.lectureId}
                                    >
                                        {e.lecture_name}
                                        {lessonTime}
                                    </button>
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
