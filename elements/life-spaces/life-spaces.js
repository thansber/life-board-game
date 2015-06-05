Polymer({
  is: 'life-spaces',
  properties: {
    player: {
      type: Object,
      value: function() { return {}; },
      notify: true
    },
    started: Boolean
  },
  observers: [
    'playerChanged(player)'
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
  }

});