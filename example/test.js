"use strict";
exports.__esModule = true;
var dist_1 = require("../dist");
var container = document.createElement('div');
container.style.width = '100vw';
container.style.height = '100vh';
container.style.border = '1px solid #000';
document.body.appendChild(container);
var lines = [];
var lineClickHandler = function (lineId) {
    var line = lines.find(function (l) { return l.Id === lineId; });
    line.extend(95, 95);
};
var svg = new dist_1.SVGTS(container, lineClickHandler);
console.log('created svg');
var polyline = svg.createPolyline();
var isMouseDown = false;
var currentPolyline = null;
container.addEventListener('mousedown', function (e) {
    isMouseDown = true;
    currentPolyline = svg.createPolyline();
    currentPolyline.stroke(8, 'yellow');
    currentPolyline.draw([[e.x, e.y]]);
});
container.addEventListener('mousemove', function (e) {
    if (isMouseDown) {
        currentPolyline.extend(e.x, e.y);
    }
});
container.addEventListener('mouseup', function (e) {
    isMouseDown = false;
    lines.push(currentPolyline);
    currentPolyline = null;
});
