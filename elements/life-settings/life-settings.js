Polymer({

  childBorn: function() {
    this.fire('child-birth', { player: this.player, amount: 1000 });
  },

  created: function() {
    this.revengePlayers = [];
    this.player = null;
  },

  daughterIsBorn: function() {
    this.player.daughters++;
    this.childBorn();
  },

  payday: function(event, detail, sender) {
    this.fire('pay-day');
  },

  settingChanged: function(event, detail, sender) {
    var previousSetting = this.shadowRoot.querySelector('.selected'),
        detailId = detail.item.id;
    if (previousSetting) {
      previousSetting.classList.toggle('selected');
    }
    if (/payday/.test(detailId)) {
      return;
    }
    this.$[detailId + '-detail'].classList.add('selected');
  },

  sonIsBorn: function() {
    this.player.sons++;
    this.childBorn();
  },

  transaction: function(event, detail, sender) {
    this.player.cash += +sender.getAttribute('amount');
  }

});
