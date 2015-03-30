Polymer({

  addInsurance: function(event, detail, sender) {
    this.player.insurance.push(sender.getAttribute('insurance'));
    this.transfer.apply(this, arguments);
  },

  next: function(event, detail, sender) {
    this.fire('next-space');
  },

  transaction: function(amount) {
    this.player.cash += amount;
  },

  transfer: function(event, detail, sender) {
    this.transaction(+sender.getAttribute('amount'));
    this.next();
  }

});
