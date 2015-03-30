Polymer({

  addPlayer: function() {
    var swatch = this.$.swatches.selectedItem,
        player;
    if (swatch.hasAttribute('disabled')) {
      return;
    }
    swatch.setAttribute('disabled', true);

    this.players.push(this.createPlayer(this.name, this.$.swatches.selected, this.$.cars.selected));
    this.$.swatches.selected = '';
  },

  created: function() {
    this.players = [];
    this.started = false;
  },

  createPlayer: function(name, color, car, space) {
    return {
      color: color,
      car: car,
      cash: 10000,
      index: this.players.length,
      insurance: [],
      job: null,
      married: false,
      name: name,
      space: space
    };
  },

  pauseGame: function() {
    this.started = false;
  },

  playersChanged: function(changes) {
    var removedColor;
    if (changes[0].removed.length) {
      removedColor = changes[0].removed[0].color;
      this.$.swatches.querySelector('[player-color="' + removedColor + '"]').removeAttribute('disabled');
    }
  },

  ready: function() {
    this.carChoices = ['car', 'classic-car', 'antique-car', 'suv', 'van', 'truck'];
    this.colorChoices = ['red', 'pink', 'orange', 'green', 'blue', 'cyan', 'white'];
    this.players.push(this.createPlayer('Madelyn', 'red', 'car', 'marriage'));
    this.players.push(this.createPlayer('Todd', 'blue', 'classic-car'));
    this.players.push(this.createPlayer('Renee', 'orange', 'antique-car'));
    this.players.push(this.createPlayer('Will', 'green', 'suv'));
  },

  startedChanged: function() {
    document.querySelector('body').classList.toggle('started', this.started);
  },

  startGame: function() {
    this.started = true;
  },

  swatchChanged: function(inEvent, inDetail, inSender) {
    this.$.cars.setAttribute('color', inDetail.item.getAttribute('player-color'));
  }
});