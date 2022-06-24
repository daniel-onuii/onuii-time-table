export const tableBody = `
table {
    border-right: 1px solid #cdcdcd;
}
@media (min-width: 376px) {
    td {
        height: 21px;
    }
}
@media (max-width: 375px) {
    td {
        height: 16px;
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
}
.onTime {
    border-top: 1px solid #cdcdcd;
}
tr:first-child,
tr:last-child {
    border-top: none;
    border-bottom: none;
}
.onTime th {
    font-size: 15px;
    color: #757575;
}
th,
td {
    border-left: 1px solid #cdcdcd;
    text-align: center;
    vertical-align: middle;
    width: 10%;
    position: relative;
    padding: 0;
    border-spacing: 0;
    font-size: 12px;
}
.item {
    height: 100%;
    width: 100%;
    top: 0px;
    z-index: 0;
    color: #b3b3b3;
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
.weekend {
    background: #fef0f7;
}
.item.over {
    background: #fa8072 !important;
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 0;
}
.item.dragging {
    background: #01a8fe !important;
    color: white;
}
.item.matching {
    // background-color: rgba(165, 210, 255, 0.4);
    // background-image: linear-gradient(90deg, rgba(165, 210, 255, 0.3) 50%, transparent 50%),
    //     linear-gradient(rgba(165, 210, 255, 0.3) 50%, transparent 50%);
    // background-size: 20px 20px;
    background: green;
}
.item.matching .area,
.item.dragging .area,
.item.over .area,
.item.tempMatching .area {
    opacity: 0.2;
}

.item.tempMatching {
    box-shadow: 100vw 100vh 0px yellow inset;
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
