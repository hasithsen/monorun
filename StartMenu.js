MonoRun.StartMenu = function(game) {
    this.startBG;
    this.startPrompt;
}

MonoRun.StartMenu.prototype = {

    create: function() {
        startBG = this.add.image(0, 0, 'bg_menu');
        startBG.scale.setTo(3 / 5);
        startBG.inputEnabled = true;
        startBG.events.onInputDown.addOnce(this.startGame, this);

        startPrompt = this.add.bitmapText(this.world.centerX - 155, this.world.centerY, 'eightbitwonder', 'Touch to Start!', 24);
    },

    startGame: function(pointer) {
        this.state.start('Game');
    }
};