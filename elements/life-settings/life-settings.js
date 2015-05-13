Polymer({

  adjustCash: function(event, detail, sender) {
    var adjustValue = this.$['adjust-value'],
        amountChanged = +sender.getAttribute('multiplier') * +adjustValue.value * 1000;
    if (isNaN(amountChanged)) {
      adjustValue.value = '';
      adjustValue.focus();
      return;
    }
    adjustValue.focus();
    this.player.cash += amountChanged;
  },

  childBorn: function() {
    this.fire('child-birth', { player: this.player, amount: 1000 });
  },

  closeSettings: function() {
    var previousSetting = this.shadowRoot.querySelector('.selected');
    if (previousSetting) {
      previousSetting.classList.toggle('selected');
      this.$.settingSelector.selected = null;
    }
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

  getRevenge: function(event, detail, sender) {
    var revengeOnIndex = +this.$['revenge-detail'].querySelector('#revenge-whom').selectedIndex,
        amount = +sender.getAttribute('amount');
    this.player.cash += amount;
    this.revengePlayers[revengeOnIndex].cash -= amount;
  },

  highlight: function(event, detail, sender) {
    sender.select();
  },

  luckyNumber: function(event, detail, sender) {
    this.fire('lucky-number', { player: this.player, amount: +sender.getAttribute('amount') });
  },

  payday: function(event, detail, sender) {
    this.fire('pay-day');
  },

  playerChanged: function() {
    this.closeSettings();
  },

  setSpace: function(event, detail, sender) {
    this.player.space = sender.getAttribute('space');
    this.closeSettings();
  },

  settingChanged: function(event, detail, sender) {
    var detailId = detail.item.id;
    if (!this.$.settingSelector.selected) {
      return;
    }
    this.closeSettings();

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
