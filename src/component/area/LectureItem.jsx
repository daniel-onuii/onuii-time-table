import React from 'react';
import { lecture } from '../../util/lecture';

function LectureItem({ id }) {
    return <span className={`lecture_${id} ignoreEnter`}>{id === 'all' ? '상관없음' : lecture.getLectureName(id).slice(0, 1)}</span>;
}
export default LectureItem;
