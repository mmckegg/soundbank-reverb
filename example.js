var Reverb = require('./')

var audioContext = new AudioContext()

var output = audioContext.createGain()
output.gain.value = 0.3 // stop ears from bleeding
output.connect(audioContext.destination)

var reverb = Reverb(audioContext)
reverb.connect(output)

reverb.time = 1 //seconds
reverb.wet.value = 0.8
reverb.dry.value = 1

reverb.filterType = 'lowpass'
reverb.cutoff.value = 4000 //Hz

setInterval(function(){
  var source = audioContext.createOscillator()
  source.type = 'sawtooth'
  source.connect(reverb)
  source.start()
  source.stop(audioContext.currentTime + 0.5)
}, 2000)