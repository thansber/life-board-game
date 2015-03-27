Polymer({

  addInsurance: function(event, detail, sender) {
    this.player.insurance.push(sender.getAttribute('insurance'));
    this.transaction(+sender.getAttribute('amount'));
  },

  transaction: function(amount) {
    this.player.cash += amount;
  }

});
