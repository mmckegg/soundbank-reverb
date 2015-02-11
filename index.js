// based on https://github.com/web-audio-components/simple-reverb by Nick Thompson

var buildImpulse = require('./build-impulse')

module.exports = SimpleReverb

function SimpleReverb(context){
  var node = context.createGain()
  var dry = node._dry = context.createGain()
  var wet = node._wet = context.createGain()

  var output = node.output = context.createGain()

  var convolver = node._convolver = context.createConvolver();
  var filter = node._filter = context.createBiquadFilter()
  
  node.connect(dry)
  node.connect(wet)

  convolver.connect(filter)
  dry.connect(output)
  wet.connect(convolver)
  filter.connect(output)


  Object.defineProperties(node, properties)

  node._time = 3
  node._decay = 2
  node._reverse = false

  node.cutoff.value = 20000
  node.filterType = 'lowpass'

  node._building = false
  node._buildImpulse()


  return node
}

var properties = {

  connect: {
    value: function(){
      this.output.connect.apply(this.output, arguments)
    }
  },

  disconnect: {
    value: function(){
      this.output.disconnect.apply(this.output, arguments)
    }
  },

  wet: {
    get: function(){
      return this._wet.gain
    }
  },

  dry: {
    get: function(){
      return this._dry.gain
    }
  },

  cutoff: {
    get: function(){
      return this._filter.frequency
    }
  },

  filterType: {
    get: function(){
      return this._filter.type
    },
    set: function(value){
      this._filter.type = value
    }
  },

  _buildImpulse: {
    value: function () {
      var self = this
      var rate = self.context.sampleRate
      var length = Math.max(rate * self.time, 1)

      if (self._building){
        buildImpulse.cancel(self._building)
      }

      self._building = buildImpulse(length, self.decay, self.reverse, function(channels){
        var impulse = self.context.createBuffer(2, length, rate)
        impulse.getChannelData(0).set(channels[0])
        impulse.getChannelData(1).set(channels[1])
        self._convolver.buffer = impulse
        self._building = false
      })
    }
  },

  /**
   * Public parameters.
   */

  time: {
    enumerable: true,
    get: function () { return this._time; },
    set: function (value) {
      this._time = value;
      this._buildImpulse();
    }
  },

  decay: {
    enumerable: true,
    get: function () { return this._decay; },
    set: function (value) {
      this._decay = value;
      this._buildImpulse();
    }
  },

  reverse: {
    enumerable: true,
    get: function () { return this._reverse; },
    set: function (value) {
      this._reverse = value;
      this._buildImpulse();
    }
  }

}

