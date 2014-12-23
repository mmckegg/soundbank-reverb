soundbank-reverb
===

Simple Web Audio API based reverb effect.

Based on https://github.com/web-audio-components/simple-reverb by Nick Thompson.

Intended for use as a processor in [soundbank](https://github.com/mmckegg/soundbank), but it is compatible with any [Web Audio API](https://developer.mozilla.org/en-US/docs/Web_Audio_API) AudioNode set up.

## Install via [npm](https://npmjs.org/package/soundbank-reverb)

```bash
$ npm install soundbank-reverb
```

## API

```js
var Reverb = require('soundbank-reverb')
```

### `var reverb = Reverb(audioContext)`

Pass an instance of [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) to the constructor to create an AudioNode.

### `reverb.wet` [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam)

### `reverb.dry` AudioParam

### `reverb.cutoff` AudioParam

Defaults to `20000`.

### `reverb.filterType` (get/set)

Defaults to `"lowpass"`.

Can be any of the filters types specified by [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode.type)

### `reverb.time` (get/set)

Impulse time in seconds. Defaults to `3`.

### `reverb.decay` (get/set)

### `reverb.reverse` (get/set)

`true` or `false`. Defaults to `false`.

## Example

```js
var Reverb = require('soundbank-reverb')

var audioContext = new AudioContext()

var reverb = Reverb(audioContext)
reverb.connect(audioContext.destination)

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
```
