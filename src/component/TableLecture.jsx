import _ from 'lodash';
import React, { useRef } from 'react';
import styled from 'styled-components';
import ScrollContainer from 'react-indiana-drag-scroll';
const Layout = styled.div`
    cursor: grab;
    max-width: 768px;
    div {
        width: ${props => props.width}px;
    }
    button {
        cursor: grab;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 3px 10px;
        font-weight: bold;
        margin-left: 10px;
    }
`;
function TableLecture(props) {
    const btnRef = useRef();
    const lectureData = props.interfaceHook?.userData?.lectureData;
    const handleChangeLecture = e => {
        console.log();
        const val = e.target.value;
        props.interfaceHook.setSubject(val === 'all' ? 'all' : Number(val));
    };
    return (
        <div>
            {lectureData && (
                <ScrollContainer className="scroll-container" vertical={false}>
                    <Layout width={lectureData.length * 90}>
                        <div>
                            <button ref={btnRef} onClick={handleChangeLecture} className={'color_all'} value="all">
                                상관없음
                            </button>
                            {lectureData.map((e, i) => {
                                return (
                                    <button key={i} className={`color${i}`} onClick={handleChangeLecture} value={e.lectureId}>
                                        {e.lecture_name}
                                    </button>
                                );
                            })}
                        </div>
                    </Layout>
                </ScrollContainer>
            )}
        </div>
    );
}

export default TableLecture;
