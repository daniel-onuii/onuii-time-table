import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import ScrollContainer from 'react-indiana-drag-scroll';
const Layout = styled.div`
    div {
        width: ${props => props.width}px;
    }
    button {
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 3px 10px;
        font-weight: bold;
        width: 100px;
    }
    width: 100%;
`;
function TableLecture(props) {
    const lectureData = props.interfaceHook?.userData?.lectureData;
    const handleChangeLecture = e => {
        const val = e.target.value;
        props.interfaceHook.setSubject(val === 'all' ? 'all' : Number(val));
    };
    return (
        <div>
            {lectureData && (
                <ScrollContainer className="scroll-container" vertical={false}>
                    <Layout width={lectureData.length * 100}>
                        <div>
                            <button onClick={handleChangeLecture} value="all">
                                상관없음
                            </button>
                            {lectureData.map((e, i) => {
                                return (
                                    <button className={`color${i}`} onClick={handleChangeLecture} value={e.lectureId}>
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
