Polymer({

  addPlayer: function() {
    var swatch = this.$.swatches.selectedItem,
        car = this.$.cars.selected,
        player;
    if (!swatch || swatch.hasAttribute('disabled')) {
      return;
    }
    if (!car) {
      return;
    }
    swatch.setAttribute('disabled', true);

    this.players.push(this.createPlayer(this.name, this.$.swatches.selected, car));
    this.$.swatches.selected = '';
  },

  created: function() {
    this.players = [];
    this.started = false;
  },

  createPlayer: function(name, color, car) {
    return {
      canHaveLuckyNumber: true,
      car: car,
      cash: 10000,
      color: color,
      crossedTollBridge: false,
      daughters: 0,
      hasInsurance: {},
      index: this.players.length,
      insurance: [],
      job: null,
      lostEverything: false,
      luckyNumber: 0,
      married: false,
      millionaire: false,
      name: name,
      ownsTollBridge: false,
      sons: 0,
      space: null,
      tollBridgeText: ''
    };
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

    //this.setupFakeData();
  },

  setupFakeData: function() {
    this.players.push(this.createPlayer('Madelyn', 'red', 'car'));
    this.players.push(this.createPlayer('Todd', 'blue', 'classic-car'));
    this.players.push(this.createPlayer('Renee', 'orange', 'antique-car'));
    this.players.push(this.createPlayer('Will', 'green', 'suv'));
    this.players[0].space = 'ending';
    this.players[0].cash = 543210;
    this.players[0].job = { salary: 50000, desc: 'Doctor' };
    this.players[0].insurance.push('auto', 'life', 'stock');
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