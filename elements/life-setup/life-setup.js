Polymer({

  is: 'life-setup',

  properties: {
    players: {
      type: Array,
      value: function() { return []; },
      notify: true
    },
    started: {
      type: Boolean,
      value: false,
      notify: true,
      observer: 'startedChanged'
    }
  },

  observers: ['playersChanged(players.splices)'],

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
    Polymer.dom(swatch).setAttribute('disabled', true);

    player = this.createPlayer(this.name, this.$.swatches.selected, car);
    this.push('players', player);
    //this.$.swatches.selected = ''; // TODO: unselect an iron-selector
  },

  createPlayer: function(name, color, car) {
    return {
      canHaveLuckyNumber: true,
      car: car,
      cash: 10000,
      cashChange: 10000,
      color: color,
      crossedTollBridge: false,
      daughters: 0,
      hasInsurance: {},
      index: this.players.length,
      insurance: [],
      job: null,
      largeCarIcon: 'car-icons-large:' + car,
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
    var $removedPlayerSwatch;
    if (!changes || !changes.indexSplices) {
      return;
    }

    this.hasPlayers = this.players.length > 0;

    if (changes.indexSplices[0].addedCount) {
      this.players.slice(0, this.players.length - 1).forEach(function(player, i) {
        this.set('players.' + i + '.last', false);
      }, this);
    }

    changes.indexSplices[0].removed.forEach(function(removedPlayer) {
      $removedPlayerSwatch = Polymer.dom(this.$.swatches).querySelector('[player-color="' + removedPlayer.color + '"]');
      $removedPlayerSwatch.removeAttribute('disabled');
    }, this);
  },

  ready: function() {
    this.carChoices = [
      { type: 'car', icon: 'car-icons:car' },
      { type: 'classic-car', icon: 'car-icons:classic-car' },
      { type: 'antique-car', icon: 'car-icons:antique-car' },
      { type: 'suv', icon: 'car-icons:suv' },
      { type: 'van', icon: 'car-icons:van' },
      { type: 'truck', icon: 'car-icons:truck' }
    ];
    this.colorChoices = [
      { color: 'red' },
      { color: 'pink' },
      { color: 'orange' },
      { color: 'green' },
      { color: 'blue' },
      { color: 'cyan' },
      { color: 'white' }
    ];
    this.hasPlayers = false;
    this.players = [];

    this.setupFakeData();
  },

  setupFakeData: function() {
    this.push('players', this.createPlayer('Madelyn', 'red', 'car'));
    this.push('players', this.createPlayer('Todd', 'blue', 'classic-car'));
    this.push('players', this.createPlayer('Renee', 'orange', 'antique-car'));
    this.push('players', this.createPlayer('Will', 'green', 'suv'));
    //this.players[0].space = 'ending';
    this.players[0].cash = 543210;
    this.players[0].job = { salary: 50000, desc: 'Doctor' };
    this.players[0].insurance.push('auto', 'life', 'stock');
    this.players[2].luckyNumber = 7;
    this.players[3].ownsTollBridge = true;
    this.players[1].space = 'taxes2';

  },

  startedChanged: function() {
    document.querySelector('body').classList.toggle('started', this.started);
  },

  startGame: function() {
    this.started = true;
  },

  swatchChanged: function(inEvent, inDetail, inSender) {
    Polymer.dom(this.$.cars).setAttribute('color', inDetail.item.getAttribute('player-color'));
  }
});