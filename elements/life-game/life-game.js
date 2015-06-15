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

  becomeMillionaire: function(event) {
    var
      otherPlayers = this.otherPlayers(this.currentPlayer),
      anyOtherMillionaires = otherPlayers.some(function(player) {
        return !!player.millionaire;
      }),
      transactions = [];

    this.set('currentPlayer.millionaire', true);
    this.set('currentPlayer.space', 'millionaire');
    if (!anyOtherMillionaires) {
      transactions.push({
        player: this.currentPlayer,
        amount: 240000
      });
      otherPlayers.forEach(function(player) {
        this.playerSet(player, 'canHaveLuckyNumber', false);
      }, this);
    }
    if (this.currentPlayer.hasInsurance.life) {
      transactions.push({
        player: this.currentPlayer,
        amount: 8000
      });
    }
    if (this.currentPlayer.hasInsurance.stock) {
      transactions.push({
        player: this.currentPlayer,
        amount: 120000
      });
    }
    this.onTransaction({ detail: transactions });
  },

  becomeTycoon: function(event) {
    this.set('currentPlayer.tycoon', true);
    this.set('gameOver', true);
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

  failedAtLife: function(event) {
    this.set('currentPlayer.lostEverything', true);
    this.set('currentPlayer.space', 'failed');
    this.onTransaction({
      detail: [{
        player: this.currentPlayer,
        amount: -1 * this.currentPlayer.cash
      }]
    });
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

  onMarriage: function(event) {
    this.set('currentPlayer.married', true);
    this.everyonePays(event.detail.amount);
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

  onTollBridgeCrossed: function(event) {
    var owner = this.tollBridgeOwner();
    if (owner) {
      this.onTransaction({
        detail: [
          {
            player: event.detail.player,
            amount: -1 * event.detail.amount
          },
          {
            player: owner,
            amount: event.detail.amount
          }
        ]
      });
    } else {
      this.set('currentPlayer.ownsTollBridge', true);
    }
    this.set('currentPlayer.crossedTollBridge', true);
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
    this.set('currentPlayer.tollBridgeText', text);
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
