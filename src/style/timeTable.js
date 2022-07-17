export const timeTable = `
th:first-child {
    width: 5%;
}
@media (min-width: 376px) {
    // max-width: 768px;
}
@media (max-width: 375px) {
    min-width: 425px;
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
.color0 {
    background: #F66D44 !important;
}
.color1 {
    background: #BE61CA !important;
}
.color2 {
    background: #FEAE65 !important;
}
.color3 {
    background: #64C2A6 !important;
}
.color4 {
    background: #1F75FE !important;
}
.color5 {
    background: #74BBFB !important;
}
.color6 {
    background: #EECA5D !important;
}
.color7 {
    background: #7AC142 !important;
}
.color8 {
    background: #2D87BB !important;
}
.color9 {
    background: #74BBFB !important;
}
.color_all{
    background: #AADEA7 !important;
    // color:#000 !important
}
.color-1{
    background: #cdcdcd !important;
}
.area._all {
    background: #AADEA7;
}
.item.equal ._all{
    background: pink;
}
.area.disabled {
    opacity: 0.2;
}
`;
