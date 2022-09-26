export const tableBody = `
table {
    // border-left: 1px solid #cdcdcd;
    // border-right: 1px solid #cdcdcd;
}td {
    height: 28px;
}
// @media (min-width: 376px) {
//     td {
//         height: 21px;
//     }
// }
// @media (max-width: 375px) {
//     td {
//         height: 21px;
//     }
// }
.contents {
    width: calc(100% - 10px);
    margin: auto;
    height: 504px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #ccc;
    }
    // border-bottom: 1px solid #efefef;
}
.onTime {
    // border-top: 1px solid #DDD;
    box-shadow: 0px 1px 0px #DDD inset;
}
.onTime td {
    border-top: 1px solid #DDD !important;
    // box-shadow: 0px 1px 0px #DDD inset;
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
    // box-shadow: 0px 1px 0px #DDD inset;
}
// th,
td {
    // border-left: 1px solid #DDD;
    box-shadow: 1px 0px 0px #DDD inset;
    text-align: center;
    vertical-align: middle;
    width: 10%;
    position: relative;
    padding: 0;
    border-spacing: 0;
    font-size: 12px;
}
tr td:last-child{
    border-right:1px solid #DDD;
}
th.day, th.night{
    color:#555555;
    background:#fff;
    line-height: 21px;
    font-weight:400;
}
.grey td{
    background:#FBFBFB;
    border-bottom:1px dashed #ECECEC;
    border-top:1px dashed #ECECEC;
}
.grey:first-child td{
    background:#FBFBFB;
    border-bottom:1px dashed #ECECEC;
    border-top:1px solid #ddd;
}
tr:last-child td{
    border-bottom:1px solid #ddd;
}

.item {
    height: 100%;
    width: 100%;
    top: 0px;
    z-index: 0;
    color: #333333;
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

.contents table {
    // pointer-events: none;
}

// .item.equal {
//     background: pink;
// }

.timeText {
    position: absolute;
    right: 5px;
    z-index: 2;
}
.freeze{
    touch-action: none;
    overflow: hidden;
}
`;
