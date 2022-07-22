import React from 'react';
import useMapData from '../../hooks/useMapData';
import styled from 'styled-components';
import KakaoMap from '../../component/RealEstate/KakaoMap';
import SearchBar from '../../component/RealEstate/SearchBar';
const Layout = styled.div`
    width: 375px;
`;

function RealMain() {
    const mapHook = useMapData();
    return (
        <Layout>
            <SearchBar mapHook={mapHook} />
            <KakaoMap mapHook={mapHook} />
        </Layout>
    );
}

export default RealMain;
