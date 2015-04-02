Polymer({

  allPlayers: function() {
    return this.$.players.querySelectorAll('[player]');
  },

  cashChanged: function(oldValue, newValue) {
    this.playersForRevenge = this.otherPlayers(this.currentPlayer).filter(function(player) {
      return player.cash >= 200000;
    });
  },

  childBirth: function(event, detail, sender) {
    this.everyonePays.apply(this, arguments);
  },

  created: function() {
    this.currentPlayer = null;
    this.players = [];
    this.playersForRevenge = [];
  },

  currentlySelectedPlayer: function() {
    return this.$.players.querySelector('[player][active]');
  },

  everyonePays: function(event, detail, sender) {
    var otherPlayers = this.otherPlayers(detail.player);
    otherPlayers.forEach(function(player) {
      player.cash -= detail.amount;
    });
    detail.player.cash += (detail.amount * otherPlayers.length);
  },

  insuranceChanged: function(changes) {
    this.currentPlayer.insurance.forEach(function(insuranceType) {
      this.currentPlayer.hasInsurance[insuranceType] = true;
    }, this);
  },

  keyHandler: function(ev) {
    switch (ev.detail.key) {
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

  moveDown: function(event, detail, sender) {
    var i = detail.index,
        playerMoving = this.players[i];
    this.players[i].index++;
    this.players[i + 1].index--;
    this.players[i] = this.players[i + 1];
    this.players[i + 1] = playerMoving;
  },

  moveUp: function(event, detail, sender) {
    var i = detail.index,
        playerMoving = this.players[i];
    this.players[i].index--;
    this.players[i - 1].index++;
    this.players[i] = this.players[i - 1];
    this.players[i - 1] = playerMoving;
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

  observe: {
    'currentPlayer.cash': 'cashChanged',
    'currentPlayer.crossedTollBridge': 'tollBridgeChanged',
    'currentPlayer.insurance': 'insuranceChanged',
    'currentPlayer.ownsTollBridge': 'tollBridgeChanged'
  },

  otherPlayers: function(notThisPlayer) {
    return this.players.filter(function(player) {
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

  ready: function() {
    this.tabIndex = 0;
  },

  removePlayer: function(event, detail, sender) {
    this.players.splice(detail.index, 1);
  },

  selectPlayer: function(event, detail, sender) {
    var index = detail.index;
    this.unselectPlayer(this.currentlySelectedPlayer());
    this.allPlayers().item(index).setAttribute('active', '');
    this.currentPlayer = this.players[index];
  },

  startedChanged: function() {
    if (this.started) {
      this.focus();
      this.fire('select-player', { index: 0 });
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
      playerElem.removeAttribute('active');
    }
  }


});
