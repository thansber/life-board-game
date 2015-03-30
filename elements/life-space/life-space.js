Polymer({

  addInsurance: function(event, detail, sender) {
    this.player.insurance.push(sender.getAttribute('insurance'));
    this.pay.call(this, arguments);
  },

  next: function(event, detail, sender) {
    this.fire('next-space');
  },

  pay: function(event, detail, sender) {
    this.transaction(+sender.getAttribute('amount'));
  },

  transaction: function(amount) {
    this.player.cash += amount;
  }

});
