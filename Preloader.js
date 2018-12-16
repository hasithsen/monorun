MonoRun.Preloader = function(game) {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

MonoRun.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		//this.titleText = this.add.image(this.world.centerX, this.world.centerY, 'titleimage');
		//this.titleText.anchor.setTo(0.5, 0.5);
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        this.load.image('bg_menu', 'images/bg_menu_lg.png');
        this.load.image('ground', 'images/bg_game_layer_5.png');
        this.load.image('trees', 'images/bg_game_layer_4.png');
        this.load.image('mountains', 'images/bg_game_layer_3.png');
        this.load.image('clouds', 'images/bg_game_layer_2.png');
        this.load.image('sky', 'images/bg_game_layer_1.png');
        this.load.atlas('ninja', 'images/spritesheets/ninja_atlas.png', 'images/spritesheets/ninja_atlas.json');
        this.load.atlas('bird', 'images/spritesheets/bird_atlas.png', 'images/spritesheets/bird_atlas.json');
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
        if(this.ready == false) {
            this.ready = true;
            this.state.start('StartMenu');
        }
	}
};