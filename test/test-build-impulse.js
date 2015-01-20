var test = require('tape')
var buildImpulse = require('../build-impulse.js')

test(function(t){

  var length = 44100 * 10

  buildImpulse(length, 3, false, function(res){
    t.equal(res.length, 2)
    t.ok(res[0] instanceof Float32Array)
    t.ok(res[1] instanceof Float32Array)
    t.equal(res[0].length, length)
    t.equal(res[1].length, length)

    // how do you test a non-deterministic pcm wave? who knows, who cares?
    t.ok(closeTo(sampleRange(res[0], 0, 0.1), 0.42, 0.02))
    t.ok(closeTo(sampleRange(res[0], 0.5, 0.6), 0.046, 0.002))
    t.ok(closeTo(sampleRange(res[0], 0.9, 1), 0.000124, 0.000004))

    t.ok(closeTo(sampleRange(res[1], 0, 0.1), 0.42, 0.02))
    t.ok(closeTo(sampleRange(res[1], 0.5, 0.6), 0.046, 0.002))
    t.ok(closeTo(sampleRange(res[1], 0.9, 1), 0.000124, 0.000004))

    t.end()
  })
})

function f(val){
  return Math.floor(val)
}

function sampleRange(array, from, to){
  var sample = []
  
  from = f(from*array.length)
  to = Math.min(f(to*array.length), array.length)

  for (var i=from;i<to;i++){
    sample.push(Math.abs(array[i]))
  }

  return mean(sample)
}

function mean(array){
  return array.reduce(add)/array.length
}

function add(x,y){
  return x+y
}

function closeTo(val, target, tol){
  return (val > target - tol) && (val < target + tol)
}