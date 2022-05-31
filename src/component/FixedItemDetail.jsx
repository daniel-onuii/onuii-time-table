import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { lecture } from '../util/lecture';
import { schedule } from '../util/schedule';

import styled from 'styled-components';
const Layout = styled.div`
    .detailItem {
        border: 1px solid #cdcdcd;
        left: -240px;
        top: -30px;
        position: absolute;
        display: block;
        background: white;
        color: black;
        border-radius: 5px;
        width: 239px;
        padding: 10px;
        z-index: 5;
    }
`;
function FixedItemDetail({ idx }) {
    const { itemData, itemGroupData } = useSelector(state => state.schedule);
    const itemLectureName = lecture.getLectureNameByIdx(itemData, idx);
    return (
        <Layout>
            <div className={'detailItem'}>
                <select style={{ fontSize: '13px', width: '165px', marginBottom: '10px' }}>
                    <option>{itemLectureName}</option>
                </select>

                {itemGroupData.map((y, k) => {
                    return (
                        idx == y.startIdx && (
                            <React.Fragment key={k}>
                                {
                                    //모달 창 더미
                                }
                                <br />
                                <label style={{ fontSize: '14px', marginRight: '3px' }}>과외시간</label>
                                <input type="text" value={(y.endTimeIdx + 1 - y.startTimeIdx) * 15} />
                                <label style={{ fontSize: '14px', marginLeft: '3px' }}>분</label>
                                <div style={{ margin: '5px' }}></div>
                                <br />
                                <label style={{ fontSize: '14px', marginRight: '3px' }}>수업타입</label>
                                <input type="text" value="베이직" />
                                <div style={{ margin: '5px' }}></div>
                                <br />
                                <label style={{ fontSize: '14px', marginRight: '3px' }}>과외기간</label>
                                <input type="text" value={'2022-01-01'} />
                                {` ~ `}
                                <input type="text" value={'2022-03-01'} />
                                <div style={{ margin: '5px' }}></div>
                                <br />
                                <label style={{ fontSize: '14px', marginRight: '3px' }}>환불예상금액</label>
                                <input type="text" value="366,000" />
                                <label style={{ fontSize: '14px', marginLeft: '3px' }}>원</label>
                                <div style={{ margin: '5px' }}></div>
                                <br />

                                <input type="text" value={schedule.getTime(y.startTimeIdx)} />
                                {` ~ `}
                                <input type="text" value={schedule.getTime(y.endTimeIdx + 1)} />
                                <div style={{ borderTop: '1px solid #cdcdcd', marginTop: '10px' }}></div>
                                <button
                                    style={{
                                        margin: '6px',
                                        marginTop: '10px',
                                        width: '75px',
                                        background: '#01a8fe',
                                        border: '1px solid #01a8fe',
                                        color: 'white',
                                        borderRadius: '3px',
                                        height: '30px',
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    style={{
                                        margin: '6px',
                                        marginTop: '10px',
                                        width: '75px',
                                        background: '#ff3f3f',
                                        border: '1px solid #ff3f3f',
                                        color: 'white',
                                        borderRadius: '3px',
                                        height: '30px',
                                    }}
                                >
                                    삭제
                                </button>
                            </React.Fragment>
                        )
                    );
                })}
            </div>
        </Layout>
    );
}

export default React.memo(FixedItemDetail);
