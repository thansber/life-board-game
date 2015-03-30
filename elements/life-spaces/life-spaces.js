Polymer({
  nextSpace: function() {
    this.$.spaces.selectNext(true);
    this.player.space = this.$.spaces.selected;
  },

  observe: {
    'player.space': 'spaceChanged'
  },

  playerChanged: function() {
    if (!this.player.space) {
      this.player.space = this.$.spaces.querySelectorAll('[space]').item(0).id;
    } else {
      this.spaceChanged();
    }
  },

  spaceChanged: function() {
    this.$.spaces.selected = this.player.space;
    this.style.top = this.topOffset();
  },

  topOffset: function() {
    return (106 * this.player.index + 21) + 'px';
  }
});