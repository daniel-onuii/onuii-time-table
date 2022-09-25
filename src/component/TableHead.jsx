import React from 'react';
import styled from 'styled-components';
import { styled as sstyled } from '../style/stitches.config';
const Layout = styled.div`
    table {
        // border-bottom: 1px solid #DDD;
    }
    th,
    td {
        // border-left: 1px solid #DDD;
        text-align: center;
        height: 28px;
        vertical-align: middle;
        width: 10%;
        position: relative;
        padding: 0;
        border-spacing: 0;
        // font-size: 12px;
    }
    .head {
        width: calc(100% - 40px);
        margin: auto;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: #ccc;
        }
    }
`;
const Th = sstyled('th', {
    height: '30px',
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '21px',
    color: '#14033e',
    variants: {
        justify: {
            bp1: { fontSize: '13px' },
            bp2: { fontSize: '13px' },
            bp3: { fontSize: '13px' },
            bp4: { fontSize: '13px' },
            bp5: { fontSize: '13px' },
            bp6: { fontSize: '18px' },
        },
    },
});
function TableHead() {
    const bp = {
        '@bp1': 'bp1',
        '@bp2': 'bp2',
        '@bp3': 'bp3',
        '@bp4': 'bp4',
        '@bp5': 'bp5',
        '@bp6': 'bp6',
    };
    return (
        <Layout>
            <div className="head">
                <table>
                    <thead>
                        <tr>
                            <Th justify={{ ...bp }}></Th>
                            <Th justify={{ ...bp }}>월</Th>
                            <Th justify={{ ...bp }}>화</Th>
                            <Th justify={{ ...bp }}>수</Th>
                            <Th justify={{ ...bp }}>목</Th>
                            <Th justify={{ ...bp }}>금</Th>
                            <Th justify={{ ...bp }}>토</Th>
                            <Th justify={{ ...bp }} style={{ color: '#E03522' }}>
                                일
                            </Th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Layout>
    );
}

export default TableHead;
