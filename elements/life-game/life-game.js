Polymer({

  is: 'life-game',

  hostAttributes: {
    tabindex: 0
  },

  observers: [
    'insuranceChanged(currentPlayer.insurance.splices)',
    'spaceChanged(currentPlayer.space)',
    'tollBridgeChanged(currentPlayer.crossedTollBridge)',
    'tollBridgeChanged(currentPlayer.ownsTollBridge)'
  ],

  properties: {
    currentPlayer: {
      type: Object,
      value: function() {
        return {
          hasInsurance: [],
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
    revengeables: {
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

  calculateRevengeables: function() {
    var newRevengeables = this.otherPlayers(this.currentPlayer).filter(function(player) {
      return player.cash >= 200000;
    });
    if (this.revengeables) {
      this.splice.apply(this, ['revengeables', 0, this.revengeables.length].concat(newRevengeables));
    }
  },

  childBirth: function(numDaughters, numSons) {
    if (numDaughters || numSons) {
      this.everyonePays(1000);
    }
  },

  currentlySelectedPlayer: function() {
    return Polymer.dom(this.$.playerList).querySelector('life-player[active]');
  },

  everyonePays: function(amount) {
    var otherPlayers = this.otherPlayers(this.currentPlayer),
        transactions = otherPlayers.map(function(player) {
          return {
            player: player,
            amount: amount * -1
          };
        }, this);
    transactions.push({
      player: this.currentPlayer,
      amount: amount * otherPlayers.length
    });
    this.onTransaction({ detail: transactions });
  },

  failedAtLife: function(event, detail, sender) {
    detail.player.lostEverything = true;
    detail.player.space = 'failed';
    detail.player.cash = 0;
  },

  hideSettings: function(started, gameOver) {
    return !started || gameOver;
  },

  insuranceChanged: function() {
    this.currentPlayer.insurance.forEach(function(insuranceType) {
      this.set('currentPlayer.hasInsurance.' + insuranceType, true);
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

  onChildBirth: function(event) {
    event.detail.player[event.detail.childType]++;
    this.everyonePays(1000);
  },

  onLuckyNumberSpun: function(event) {
    var owner = this.luckyNumberOwner();
    if (!owner) {
      return;
    }
    this.onTransaction({
      detail: [
        { player: event.detail.player, amount: -1 * event.detail.amount },
        { player: owner, amount: event.detail.amount }
      ]
    })
  },

  onPayday: function(event) {
    if (!this.currentPlayer.job) {
      return;
    }
    this.onTransaction({
      detail: [{
        player: this.currentPlayer,
        amount: this.currentPlayer.job.salary
      }]
    });
  },

  onTransaction: function(event) {
    event.detail.forEach(function(transaction) {
      this.playerSet(transaction.player, 'cash', transaction.player.cash + transaction.amount);
    }, this);
    this.calculateRevengeables();
  },

  otherPlayers: function(notThisPlayer) {
    return (this.players || []).filter(function(player) {
      return player.index !== notThisPlayer.index;
    });
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
    this.calculateRevengeables();
  },

  spaceChanged: function() {
    if (!this.started) {
      return;
    }
    this.$.spaces.style.top = this.currentlySelectedPlayer().offsetTop + 'px';
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
