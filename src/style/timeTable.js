export const timeTable = `
th:first-child {
    width: 5%;
}
@media (min-width: 376px) {
    width: 700px;
}
@media (max-width: 375px) {
    width: 375px;
    th:first-child {
        font-size: 10px;
        width: 6%;
    }
}
margin: auto;
body::-webkit-scrollbar {
    display: none;
}
table {
    width: 100%;
    border-collapse: collapse;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.area.color0 {
    background: #F66D44;
}
.area.color1 {
    background: #BE61CA;
}
.area.color2 {
    background: #FEAE65;
}
.area.color3 {
    background: #64C2A6;
}
.area.color4 {
    background: #1F75FE;
}
.area.color5 {
    background: #FD6787;
}
.area.color6 {
    background: #EECA5D;
}
.area.color7 {
    background: #7AC142;
}
.area.color8 {
    background: #2D87BB;
}
.area.color9 {
    background: #74BBFB;
}
.area._all {
    background: #3AA8C2;
}
.item.equal ._all{
    background: pink;
}
.area.disabled {
    opacity: 0.2;
}
`;
