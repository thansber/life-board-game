Polymer({
  observe: {
    'player': 'playerInsuranceChanged',
    'player.insurance': 'playerInsuranceChanged'
  },

  playerInsuranceChanged: function() {
    this.hasInsurance = this.player.hasInsurance[this.insurance];
  }
});