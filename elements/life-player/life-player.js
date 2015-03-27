Polymer({

  cashChanged: function() {
    this.player.formattedCash = this.formatCash();
  },

  created: function() {
    this.cashFormatter = /(\d+)(\d{3})/;
  },

  formatCash: function() {
    var formattedCash = '' + this.player.cash;
    while (this.cashFormatter.test(formattedCash)) {
      formattedCash = formattedCash.replace(this.cashFormatter, '$1' + ',' + '$2');
    }
    return formattedCash;
  },

  observe: {
    'player.cash': 'cashChanged'
  },

  playerAction: function(event, details, sender) {
    var action = event.target.getAttribute('player-action'),
        index = +sender.getAttribute('player-index');
    this.fire(action ? action : 'select-player', { index: index });
  }

});
