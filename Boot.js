var MonoRun = {};

MonoRun.Boot = function(game) {};

MonoRun.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBar', 'images/loader_bar.png');
        this.load.image('titleimage', 'images/TitleImage.png');
    },
    
    create: function() {

        this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.parentIsWindow = true;
        //this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
		this.scale.minWidth = 480;
		this.scale.minHeight = 320;
		//this.scale.pageAlignHorizontally = true;
		//this.scale.pageAlignVertically = true;
		//this.stage.forcePortrait = true;
		this.scale.setScreenSize(true);

		this.input.addPointer();
		this.stage.backgroundColor = '#171642';
        this.stage.disableVisibilityChange = true;
        
        this.state.start('Preloader');
    }
}