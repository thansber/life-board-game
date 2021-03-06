Polymer({
  is: 'life-spaces',
  properties: {
    player: {
      type: Object,
      value: function() { return {}; },
      notify: true
    },
    started: Boolean,
    taxAmount: Number
  },
  observers: [
    'playerChanged(player)',
    'playerChanged(player.job)'
  ],

  nextSpace: function() {
    this.$.spaces.selectNext();
  },

  playerChanged: function() {
    if (!this.started) {
      return;
    }
    if (!this.player.space) {
      this.set('player.space', Polymer.dom(this.$.spaces).querySelectorAll('[space]')[0].getAttribute('space'));
    }

    if (this.player.job) {
      this.taxAmount = this.player.job.salary / 2;
    }
  }

});