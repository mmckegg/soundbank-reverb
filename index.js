// based on https://github.com/web-audio-components/simple-reverb by Nick Thompson

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

  node._context = context;

  Object.defineProperties(node, properties)

  node._time = 3
  node._decay = 2
  node._reverse = false

  node.cutoff.value = 20000
  node.filterType = 'lowpass'

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
      var rate = this._context.sampleRate
        , length = rate * this.time
        , decay = this.decay
        , impulse = this._context.createBuffer(2, length, rate)
        , impulseL = impulse.getChannelData(0)
        , impulseR = impulse.getChannelData(1)
        , n, i;

      for (i = 0; i < length; i++) {
        n = this.reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }

      this._convolver.buffer = impulse;
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
