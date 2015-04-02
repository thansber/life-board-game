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

  createPlayer: function(name, color, car) {
    return {
      color: color,
      car: car,
      cash: 10000,
      crossedTollBridge: false,
      daughters: 0,
      hasInsurance: {},
      index: this.players.length,
      insurance: [],
      job: null,
      luckyNumber: 0,
      married: false,
      name: name,
      ownsTollBridge: false,
      sons: 0,
      space: null,
      tollBridgeText: ''
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

    // TODO: remove this
    this.players.push(this.createPlayer('Madelyn', 'red', 'car'));
    this.players.push(this.createPlayer('Todd', 'blue', 'classic-car'));
    this.players.push(this.createPlayer('Renee', 'orange', 'antique-car'));
    this.players.push(this.createPlayer('Will', 'green', 'suv'));
    this.players[0].space = 'orphanage';
    this.players[0].cash = 543210;
    this.players[0].luckyNumber = 6;
    this.players[0].job = { salary: 50000 };
    this.players[0].insurance.push('stock');
    this.players[1].space = 'orphanage';
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