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

  animateCashChange: function(newCash) {
    var multiplier = this.player.cashChange < newCash ? 1 : -1,
        increment = Math.abs(this.player.cashChange - newCash) / 10;
    this.animating = true;
    this.animator = setInterval(function() {
      if (this.player.cashChange === newCash) {
        clearInterval(this.animator);
        this.cashIsChanging(false);
        this.animating = false;
        return;
      }
      this.set('player.cashChange', this.player.cashChange += (increment * multiplier));
    }.bind(this), 50);
  },

  cashChanged: function(newCash) {
    if (!this.started) {
      return;
    }

    if (this.animating) {
      clearInterval(this.animator);
      this.cancelAsync(this.asyncCashChange);
      this.animating = false;
      this.set('player.cashChange', newCash);
    }
    this.toggleClass('adding', this.player.cashChange < newCash);
    this.toggleClass('removing', this.player.cashChange > newCash);
    this.cashIsChanging(true);
    this.asyncCashChange = this.async(this.animateCashChange.bind(this, newCash));
  },

  cashIsChanging: function(isChanging) {
    this.toggleAttribute('hidden', isChanging, this.$.cash);
    this.toggleAttribute('hidden', !isChanging, this.$.changingCash);
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
