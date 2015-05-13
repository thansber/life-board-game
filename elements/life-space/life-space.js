Polymer({

  addInsurance: function(event, detail, sender) {
    this.player.insurance.push(sender.getAttribute('insurance'));
    this.transfer.apply(this, arguments);
  },

  becomeMillionaire: function(event, detail, sender) {
    this.fire('millionaire', { player: this.player });
  },

  becomeTycoon: function(evemt, detail, sender) {
    this.fire('tycoon', { player: this.player });
  },

  crossedTollBridge: function(event, detail, sender) {
    this.fire('toll-bridge-crossed', { player: this.player, amount: +sender.getAttribute('amount') });
    this.next();
  },

  dayOfReckoning: function(event, detail, sender) {
    this.transaction(+sender.getAttribute('amount') * (this.player.sons + this.player.daughters));
    this.next();
  },

  // handled by game
  everyonePays: function(event, detail, sender) {
    this.fire('everyone-pays', { player: this.player, amount: +sender.getAttribute('amount') });
    this.next();
  },

  failedAtLife: function(event, detail, sender) {
    this.fire('failed', { player: this.player });
  },

  getMarried: function(event, detail, sender) {
    this.player.married = true;
    this.everyonePays.apply(this, arguments);
  },

  next: function(event, detail, sender) {
    this.fire('next-space');
  },

  taxes: function(event, detail, sender) {
    this.transaction(this.player.job.salary / -2);
    this.next();
  },

  transaction: function(amount) {
    this.player.cash += amount;
  },

  transfer: function(event, detail, sender) {
    this.transaction(+sender.getAttribute('amount'));
    this.next();
  }

});
