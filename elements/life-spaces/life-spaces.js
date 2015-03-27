Polymer({
  attached: function() {
    this.spaces = this.shadowRoot.querySelectorAll('[space]');
  },

  observe: {
    'player.space': 'spaceChanged'
  },

  playerChanged: function() {
    if (!this.player.space) {
      this.player.space = this.spaces.item(0).id;
    } else {
      this.spaceChanged();
    }
  },

  spaceChanged: function() {
    var prevSpace = this.shadowRoot.querySelector('[space][active]'),
        nextSpace;
    if (prevSpace) {
      prevSpace.removeAttribute('active');
    }
    nextSpace = this.$[this.player.space];
    if (nextSpace) {
      nextSpace.setAttribute('active', '');
      this.style.top = this.topOffset();
    }
  },

  topOffset: function() {
    return (106 * this.player.index + 20) + 'px';
  }
});