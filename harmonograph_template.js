importScripts('plotter.js')
var MAX_COST = 5000;
var dT = .01;

var PEN_DEPTH = 6;
var PEN_UP_DEPTH = 0;

var cost = 0;
var lastPoint;

plotter.setupDrawWorker(undefined, PEN_DEPTH, pointAt)

function pointAt(index) {
  let time = index * dT
  let point = {x: xFunction(time, values), y: yFunction(time, values), penDown: PEN_DEPTH}
  if (lastPoint)
    cost += .1 + distance(point, lastPoint)
  if (cost > MAX_COST) return null;
  lastPoint = point
  return point
}

function distance(p1, p2) { let x=p1.x-p2.x, y=p1.y-p2.y; return Math.sqrt(x*x+y*y) }
function xFunction(time, v) {
    return v.a1x * Math.sin(v.f1x * time + v.p1x) * Math.exp(-v.d1x*time)
  + v.a2x * Math.sin(v.f2x * time + v.p2x) * Math.exp(-v.d2x*time)
}
function yFunction(time, v) {
  return v.a1y * Math.sin(v.f1y * time + v.p1y) * Math.exp(-v.d1y*time)
  + v.a2y * Math.sin(v.f2y * time + v.p2y) * Math.exp(-v.d2y*time)
}
