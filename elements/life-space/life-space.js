Polymer({

  addInsurance: function(event, detail, sender) {
    this.player.insurance.push(sender.getAttribute('insurance'));
    this.pay.apply(this, arguments);
  },

  next: function(event, detail, sender) {
    this.fire('next-space');
  },

  pay: function(event, detail, sender) {
    this.transaction(+sender.getAttribute('amount'));
    this.next();
  },

  transaction: function(amount) {
    this.player.cash += amount;
  }

});
