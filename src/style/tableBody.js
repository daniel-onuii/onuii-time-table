export const tableBody = `
table {
    // border-left: 1px solid #cdcdcd;
    // border-right: 1px solid #cdcdcd;
}
@media (min-width: 376px) {
    td {
        height: 21px;
    }
}
@media (max-width: 375px) {
    td {
        height: 21px;
    }
}
.contents {
    height: 504px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #ccc;
    }
    border-bottom: 1px solid #efefef;
}
.onTime {
    // border-top: 1px solid #eee;
    box-shadow: 0px 1px 0px #eee inset;
}
tr:first-child,
tr:last-child {
    box-shadow:none;
    border-top: none;
    border-bottom: none;
}
.onTime th {
    font-size: 15px;
    color: #757575;
}
th:first-child{
    border:none;
    box-shadow: 0px 1px 0px #eee inset;
}
th,
td {
    // border-left: 1px solid #eee;
    box-shadow: 1px 0px 0px #eee inset;
    text-align: center;
    vertical-align: middle;
    width: 10%;
    position: relative;
    padding: 0;
    border-spacing: 0;
    font-size: 12px;
}
th.day{color:#E96108;}
th.night{color:#171868;}
.item {
    height: 100%;
    width: 100%;
    top: 0px;
    z-index: 0;
    color: #fff;
    font-weight:bold;
    display: flex;
}
.item:hover {
    cursor: cell;
    background: #efefef;
    :not(.dragging)::after {
        content: '📌';
        color: #fff;
        font-size: 13px;
        z-index: 4;
    }
}
.active {
    width: 100%;
    height: 100%;
    color: white;
    z-index: 1;
}
// .onTime .weekend .item {
//     box-shadow: 0px -20px 0px #FFF5F0 inset;
// }
// .weekend .item {
//     box-shadow: 100vw 0px 0px #FFF5F0 inset;
// }
.item.over {
    background: #fa8072 !important;
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 0;
}
.item.dragging {
    background: #4F6FD2 !important;
    color: white;
}
.item.filter {
    // background-color: rgba(165, 210, 255, 0.4);
    // background-image: linear-gradient(90deg, rgba(165, 210, 255, 0.3) 50%, transparent 50%),
    //     linear-gradient(rgba(165, 210, 255, 0.3) 50%, transparent 50%);
    // background-size: 20px 20px;
    background: #FEC92F;
}
.item.filter .area,
.item.dragging .area,
.item.over .area,
.item.tempMatching .area {
    opacity: 0.2;
}

.item.tempMatching {
    box-shadow: 100vw 100vh 0px #FEC92F inset;
}

.ignoreEnter {
    pointer-events: none;
}

// .item.equal {
//     background: pink;
// }

.timeText {
    position: absolute;
    right: 5px;
    z-index: 2;
}
`;
