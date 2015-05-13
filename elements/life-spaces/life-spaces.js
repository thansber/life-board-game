Polymer({
  created: function() {
    this.allSpaces = [
      { id: 'auto-insurance', tag: 'insurance-space', label: 'Auto Insurance', attributes: {
        insurance: 'auto',
        amount: '-1000',
        color: 'orange'
      }},
      { id: 'tuition', label: 'Tuition' },
      { id: 'jobs', label: 'Jobs' },
      { id: 'life-insurance', tag: 'insurance-space', label: 'Life Insurance', attributes: {
        insurance: 'life',
        amount: '-10000',
        color: 'blue'
      }},
      { id: 'marriage', label: 'Marriage' },
      { id: 'house', label: 'House' },
      { id: 'fire-insurance', tag: 'insurance-space', label: 'Fire Insurance', attributes: {
        insurance: 'fire',
        amount: '-10000',
        color: 'red'
      }},
      { id: 'taxes1', tag: 'taxes-space', label: 'Taxes 1' },
      { id: 'stock-insurance', tag: 'insurance-space', label: 'Stock Insurance', attributes: {
        insurance: 'stock',
        amount: '-50000',
        color: 'green'
      }},
      { id: 'taxes2', tag: 'taxes-space', label: 'Taxes 2' },
      { id: 'taxes3', tag: 'taxes-space', label: 'Taxes 3' },
      { id: 'orphanage', label: 'Orphanage' },
      { id: 'toll-bridge', label: 'Toll Bridge' },
      { id: 'property-taxes', label: 'Property Taxes' },
      { id: 'day-of-reckoning', label: 'Day of Reckoning' },
      { id: 'ending', label: 'Ending' }
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

      Object.keys(space.attributes || {}).forEach(function(attr) {
        child.setAttribute(attr, space.attributes[attr]);
      });

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