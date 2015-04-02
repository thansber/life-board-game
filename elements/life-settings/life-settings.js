Polymer({

  childBorn: function() {
    this.fire('child-birth', { player: this.player, amount: 1000 });
  },

  daughterIsBorn: function() {
    this.player.daughters++;
    this.childBorn();
  },

  sonIsBorn: function() {
    this.player.sons++;
    this.childBorn();
  }

});
