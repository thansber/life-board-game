Polymer({

  childBorn: function() {
    this.fire('child-birth', { player: this.player, amount: 1000 });
  },

  created: function() {
    this.revengePlayers = [];
    this.player = null;
  },

  daughterIsBorn: function() {
    if (!this.player) {
      return;
    }
    this.player.daughters++;
    this.childBorn();
  },

  luckyNumber: function(event, detail, sender) {
    this.fire('lucky-number', { player: this.player, amount: +sender.getAttribute('amount') });
  },

  payday: function(event, detail, sender) {
    this.fire('pay-day');
  },

  setSpace: function(event, detail, sender) {
    this.player.space = sender.getAttribute('space');
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
    if (!this.player) {
      return;
    }
    this.player.sons++;
    this.childBorn();
  },

  tollBridgeLost: function(event, detail, sender) {
    this.player.ownsTollBridge = false;
  },

  transaction: function(event, detail, sender) {
    this.player.cash += +sender.getAttribute('amount');
  }

});
