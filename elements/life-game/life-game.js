Polymer({

  is: 'life-game',

  hostAttributes: {
    tabindex: 0
  },

  observers: [
    'cashChanged(currentPlayer.cash)',
    'childBirth(currentPlayer.daughters,currentPlayer.sons)',
    'insuranceChanged(currentPlayer.insurance)',
    'tollBridgeChanged(currentPlayer.crossedTollBridge)',
    'tollBridgeChanged(currentPlayer.ownsTollBridge)'
  ],

  properties: {
    currentPlayer: {
      type: Object,
      value: function() {
        return {
          insurance: []
        };
      },
      notify: true
    },
    gameOver: {
      type: Boolean,
      value: false,
      notify: true
    },
    players: {
      type: Array,
      value: function() { return []; },
      notify: true
    },
    playersForRevenge: {
      type: Array,
      value: function() { return []; },
      notify: true
    },
    // TODO: remove this
    spaces: { type: Array, value: function() { return []; } },
    started: {
      type: Boolean,
      value: false,
      notify: true,
      observer: 'startedChanged'
    }
  },

  allPlayers: function() {
    return Polymer.dom(this.$.playerList).querySelectorAll('life-player');
  },

  becomeMillionaire: function(event, detail, sender) {
    var
      otherPlayers = this.otherPlayers(detail.player),
      anyOtherMillionaires = otherPlayers.some(function(player) {
        return !!player.millionaire;
      });

    detail.player.millionaire = true;
    detail.player.space = 'millionaire';
    if (!anyOtherMillionaires) {
      detail.player.cash += 240000;
      otherPlayers.forEach(function(player) {
        player.canHaveLuckyNumber = false;
      });
    }
    if (detail.player.hasInsurance.life) {
      detail.player.cash += 8000;
    }
    if (detail.player.hasInsurance.stock) {
      detail.player.cash += 120000;
    }
  },

  becomeTycoon: function(event, detail, sender) {
    detail.player.tycoon = true;
    this.gameOver = true;
  },

  cashChanged: function(newAmount) {
    this.currentPlayerSet('cash', newAmount);
    this.playersForRevenge = this.otherPlayers(this.currentPlayer).filter(function(player) {
      return player.cash >= 200000;
    });
  },

  childBirth: function(numDaughters, numSons) {
    if (numDaughters || numSons) {
      this.everyonePays(1000);
    }
  },

  currentPlayerSet: function(field, value) {
    this.playerSet(this.currentPlayer, field, value);
  },

  currentlySelectedPlayer: function() {
    return Polymer.dom(this.$.playerList).querySelector('life-player[active]');
  },

  everyonePays: function(amount) {
    var otherPlayers = this.otherPlayers(this.currentPlayer);
    otherPlayers.forEach(function(player) {
      this.playerSet(player, 'cash', player.cash - amount);
    }, this);
    this.currentPlayerSet('cash', this.currentPlayer.cash + (amount * otherPlayers.length));
  },

  failedAtLife: function(event, detail, sender) {
    detail.player.lostEverything = true;
    detail.player.space = 'failed';
    detail.player.cash = 0;
  },

  hideSettings: function(started, gameOver) {
    return !started || gameOver;
  },

  insuranceChanged: function(changes) {
    this.currentPlayer.insurance.forEach(function(insuranceType) {
      this.currentPlayer.hasInsurance[insuranceType] = true;
    }, this);
  },

  keyHandler: function(ev) {
    if (this.gameOver) {
      return;
    }
    switch (ev.detail.key) {
      case 'esc':
        this.$.settings.closeSettings();
        break;
      case 'n':
      case 'N':
        this.nextPlayer();
        break;
    };
  },

  luckyNumberOwner: function() {
    return (this.players.filter(function(player) {
      return !!player.luckyNumber;
    }) || [])[0];
  },

  luckyNumberSpun: function(event, detail, sender) {
    var owner = this.luckyNumberOwner();
    if (!detail.player || !owner) {
      return;
    }
    owner.cash += detail.amount;
    detail.player.cash -= detail.amount;
  },

  movePlayer: function(event, detail) {
    var i = detail.index,
        playerMoving = this.splice('players', i, 1);
    this.splice('players', i + detail.direction, 0, playerMoving[0]);
    this.resetIndexes();
  },

  nextPlayer: function() {
    var current = this.currentlySelectedPlayer(),
        nextIndex;
    if (!current) {
      nextIndex = 0;
    } else {
      nextIndex = this.playerIndex(current) + 1;
      if (nextIndex >= this.players.length) {
        nextIndex = 0;
      }
    }

    this.selectPlayer({}, { index: nextIndex });
  },

  otherPlayers: function(notThisPlayer) {
    return (this.players || []).filter(function(player) {
      return player.index !== notThisPlayer.index;
    });
  },

  payday: function() {
    if (!this.currentPlayer) {
      return;
    }

    if (!this.currentPlayer.job) {
      return;
    }

    this.currentPlayer.cash += this.currentPlayer.job.salary;
  },

  playerIndex: function(playerElem) {
    return +playerElem.shadowRoot.querySelector('#player').getAttribute('player-index');
  },

  playerSet: function(player, field, value) {
    this.set('players.' + player.index + '.' + field, value);
  },

  removePlayer: function(event, detail, sender) {
    this.splice('players', detail.index, 1);
    this.resetIndexes();
  },

  resetIndexes: function() {
    this.players.forEach(function(player, i, a) {
      this.set('players.' + i + '.index', i);
    }, this);
    this.set('players.length', this.players.length);
  },

  selectPlayer: function(event, detail, sender) {
    var index = detail.index;

    if (this.gameOver) {
      return;
    }

    this.unselectPlayer(this.currentlySelectedPlayer());
    this.allPlayers()[index].setAttribute('active', '');
    this.currentPlayer = this.players[index];
  },

  startedChanged: function() {
    if (this.started) {
      this.focus();
      this.selectPlayer({}, { index: 0 });
    }
  },

  tollBridgeChanged: function() {
    var text = '';
    if (this.currentPlayer.crossedTollBridge) {
      text = this.currentPlayer.ownsTollBridge ? 'I own the toll bridge' : 'I crossed the toll bridge';
    }
    this.currentPlayer.tollBridgeText = text;
  },

  tollBridgeCrossed: function(event, detail, sender) {
    var owner = this.tollBridgeOwner();
    if (owner) {
      detail.player.cash -= detail.amount;
      owner.cash += detail.amount;
    } else {
      detail.player.ownsTollBridge = true;
    }
    detail.player.crossedTollBridge = true;
  },

  tollBridgeOwner: function() {
    return (this.players.filter(function(player) {
      return player.ownsTollBridge;
    }) || [])[0];
  },

  unselectPlayer: function(playerElem) {
    if (playerElem) {
      Polymer.dom(playerElem).removeAttribute('active');
    }
  }

});
