Polymer({

  is: 'life-settings',

  properties: {
    player: {
      type: Object,
      value: function() { return {}; },
      notify: true
    },
    revengeables: {
      type: Array,
      value: function() { return []; },
      notify: true
    },
    settingDetailClasses: {
      type: String,
      value: 'horizontal layout center center-justified wrap'
    },
    spaces: {
      type: Array,
      value: function() { return []; }
    }
  },

  closeSettings: function() {
    var previousSetting = Polymer.dom(this.root).querySelector('[setting].selected-setting');
    if (previousSetting) {
      previousSetting.classList.toggle('selected-setting');
      Polymer.dom(this.root).querySelector('[setting-detail].selected-setting').classList.toggle('selected-setting');
      this.$.settingSelector.selected = '';
      this.$.settingDetail.selected = '';
    }
  },

  detailSelected: function(event) {
    if (event.detail.item.getAttribute('setting-detail') === 'adjuster') {
      event.detail.item.applyFocus();
    }
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
  }

});
