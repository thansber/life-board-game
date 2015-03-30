Polymer({

  allPlayers: function() {
    return this.$.players.querySelectorAll('[player]');
  },

  created: function() {
    this.currentPlayer = null;
    this.players = [];
  },

  currentlySelectedPlayer: function() {
    return this.$.players.querySelector('[player][active]');
  },

  everyonePays: function(event, detail, sender) {
    var otherPlayers = this.players.filter(function(player) {
      return player.index !== detail.player.index;
    });
    otherPlayers.forEach(function(player) {
      player.cash -= detail.amount;
    });
    detail.player.cash += (detail.amount * otherPlayers.length);
  },

  keyHandler: function(ev) {
    switch (ev.detail.key) {
      case 'n':
      case 'N':
        this.nextPlayer();
        break;
    };
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

  unselectPlayer: function(playerElem) {
    if (playerElem) {
      playerElem.removeAttribute('active');
    }
  }


});
