Polymer({
  created: function() {
    this.allSpaces = [
      { id: 'auto-insurance' },
      { id: 'tuition' },
      { id: 'jobs' },
      { id: 'life-insurance' },
      { id: 'marriage' },
      { id: 'house' },
      { id: 'fire-insurance' },
      { id: 'taxes1', tag: 'taxes-space' },
      { id: 'stock-insurance' },
      { id: 'taxes2', tag: 'taxes-space' },
      { id: 'taxes3', tag: 'taxes-space' },
      { id: 'orphanage' },
      { id: 'toll-bridge' }
    ];
  },

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

  ready: function() {
    var child;
    this.allSpaces.forEach(function(space) {
      child = document.createElement(space.tag || space.id + '-space');
      child.id = space.id;
      child.setAttribute('space', '');
      child.bind('player', new PathObserver(this, 'player'));
      this.$.spaces.appendChild(child);
    }, this);
  },

  spaceChanged: function() {
    this.$.spaces.selected = this.player.space;
    this.style.top = this.topOffset();
  },

  topOffset: function() {
    return (106 * this.player.index + 21) + 'px';
  }
});