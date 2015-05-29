Polymer({

  is: 'life-settings',

  properties: {
    player: {
      type: Object,
      value: function() { return {}; },
      notify: true
    },
    revengePlayers: {
      type: Array,
      value: function() { return []; }
    },
    settingDetailClasses: {
      type: String,
      value: 'horizontal layout center center-justified'
    },
    spaces: {
      type: Array,
      value: function() { return []; }
    }
  },

  closeSettings: function() {
    var previousSetting = Polymer.dom(this.root).querySelector('[detail].selected');
    if (previousSetting) {
      previousSetting.classList.toggle('selected');
      this.$.settingSelector.selected = null;
    }
  },

  getRevenge: function(event, detail) {
    var revengeOnIndex = +this.$['revenge-detail'].querySelector('#revenge-whom').selectedIndex,
        amount = +sender.getAttribute('amount');
    this.player.cash += amount;
    this.revengePlayers[revengeOnIndex].cash -= amount;
  },

  luckyNumber: function(event, detail) {
    this.fire('lucky-number', { player: this.player, amount: +sender.getAttribute('amount') });
  },

  payday: function(event, detail) {
    this.fire('pay-day');
  },

  playerChanged: function() {
    this.closeSettings();
  },

  setSpace: function(event, detail) {
    this.player.space = sender.getAttribute('space');
    this.closeSettings();
  },

  showSetting: function(event, detail) {
    this.selectedSetting = detail.item.getAttribute('setting');
    this.$.settingDetail.select(this.selectedSetting);
    /*if (!this.$.settingSelector.selected) {
      return;
    }
    this.closeSettings();

    if (/payday/.test(detailId)) {
      return;
    }
    this.$[detailId + '-detail'].classList.add('selected');*/
  },

  tollBridgeLost: function(event, detail, sender) {
    this.player.ownsTollBridge = false;
  },

  transaction: function(event, detail, sender) {
    this.player.cash += +sender.getAttribute('amount');
  }

});
