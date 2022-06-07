import React from 'react';
import { lecture } from '../../util/lecture';
import styled from 'styled-components';
const Layout = styled.div`
    // border-left: 6px solid red;
`;
function LectureItem({ id }) {
    return (
        // <Layout>
        <React.Fragment>
            <span className={`lecture_${id} ignoreEnter`}>{id === 'all' ? '상관없음' : lecture.getLectureName(id).slice(0, 1)}</span>
        </React.Fragment>
        // </Layout>
    );
}
export default LectureItem;
