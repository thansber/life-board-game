Polymer({
  is: 'life-spaces',
  properties: {
    player: {
      type: Object,
      value: function() { return {}; },
      notify: true
    }
  },
  observers: [
    //'spaceChanged(player.space)'
  ],
/*
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
*/
  ready: function() {
    /*
    var child, spaces = Polymer.dom(this.$.spaces);
    this.allSpaces.forEach(function(space) {
      child = document.createElement(space.tag || space.id + '-space');
      child.id = space.id;
      child.setAttribute('space', '');

      Object.keys(space.attributes || {}).forEach(function(attr) {
        child.setAttribute(attr, space.attributes[attr]);
      });

      //child.bind('player', new PathObserver(this, 'player'));

      spaces.appendChild(child);
    }, this);
    */
  }
});