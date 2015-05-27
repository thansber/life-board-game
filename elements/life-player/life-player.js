Polymer({

  is: 'life-player',

  properties: {
    player: {
      type: Object,
      value: function() { return {}; },
      notify: true
    },
    started: Boolean
  },

  hostAttributes: {
    numPlayers: 0
  },

  observers: [
    'cashChanged(player.cash)'
  ],

  animateCashChange: function(oldCash, newCash) {
    var increment = Math.abs(oldCash - newCash) / 10;
    this.animator = setInterval(function() {
      if (this.player.cashChange === newCash) {
        clearInterval(this.animator);
        this.cashIsChanging(false);
        return;
      }
      this.player.cashChange += increment * (oldCash < newCash ? 1 : -1);
    }.bind(this), 50);
  },

  cashChanged: function(oldCash, newCash) {
    if (!oldCash || !newCash) {
      return;
    }

    clearInterval(this.animator);
    this.$.changingCash.classList.toggle('adding', oldCash < newCash);
    this.$.changingCash.classList.toggle('removing', oldCash > newCash);
    this.player.cashChange = oldCash;
    this.cashIsChanging(true);
    this.async('animateCashChange', [oldCash, newCash]);
  },

  cashIsChanging: function(isChanging) {
    if (isChanging) {
      this.$.cash.setAttribute('hidden', '');
      this.$.changingCash.removeAttribute('hidden');
    } else {
      this.$.cash.removeAttribute('hidden');
      this.$.changingCash.setAttribute('hidden', '');
    }
  },

  created: function() {
    this.cashFormatter = /(\d+)(\d{3})/;
    this.changing = false;
  },

  formatCash: function(cash) {
    var formattedCash = '' + (cash || '0');
    while (this.cashFormatter.test(formattedCash)) {
      formattedCash = formattedCash.replace(this.cashFormatter, '$1' + ',' + '$2');
    }
    return '$' + formattedCash;
  },

  isFirst: function(index) {
    return index === 0;
  },

  isLast: function(index, numPlayers) {
    return index === numPlayers - 1;
  },

  observe: {
    'player.cash': 'cashChanged'
  },

  playerAction: function(event) {
    var target = Polymer.dom(event).localTarget,
        action = target.getAttribute('player-action'),
        direction = target.getAttribute('direction');
    this.fire(action ? action : 'select-player', {
      index: this.player.index,
      direction: +direction
    });
  }

});
