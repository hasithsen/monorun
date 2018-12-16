MonoRun.Game = function(game) {
    this.gamePaused;
    this.gameSpeed;
    this.gameover;
    this.scaleFactor;
    this.ninja;
    this.bg;
    this.sky;
    this.clouds;
    this.mountains;
    this.trees;
    this.ground;
    this.birdgroup;
    this.totalLives;
    this.totalbirds;
    this.totalLives_text;
    this.totalBirds_text;

    this.burst;
    this.gameover;
    this.overmessage;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
};

MonoRun.Game.prototype = {

    create: function() {
        this.gamePaused == false;
        this.gameSpeed = 20;
        this.gameover = false;
        this.scaleFactor = 3 / 5;
        this.sky = [];
        this.clouds = [];
        this.mountains = [];
        this.trees = [];
        this.ground = [];
        this.totalbirds = 5;
        this.totalLives = 3;

        this.buildWorld();
        //this.addBird();

    },

    buildWorld: function() {
        this.birdgroup = this.add.group();
        this.bg = this.add.group();

        this.sky[0] = this.add.image(0, 0, 'sky');
        this.sky[1] = this.add.image(this.world.width + this.sky[0].width / 2, 0, 'sky');
        this.clouds[0] = this.add.image(0, 0, 'clouds');
        this.clouds[1] = this.add.image(this.world.width + this.clouds[0].width / 2, 0, 'clouds');
        this.mountains[0] = this.add.image(0, 0, 'mountains');
        this.mountains[1] = this.add.image(this.world.width + this.mountains[0].width / 2, 0, 'mountains');
        this.trees[0] = this.add.image(0, 10, 'trees');
        this.trees[1] = this.add.image(this.world.width + this.trees[0].width / 2, 10, 'trees');
        this.ground[0] = this.add.image(0, 0, 'ground');
        this.ground[1] = this.add.image(this.world.width + this.ground[0].width / 2, 0, 'ground');
        this.bg.add(this.sky[0]);
        this.bg.add(this.sky[1]);
        this.bg.add(this.clouds[0]);
        this.bg.add(this.clouds[1]);
        this.bg.add(this.mountains[0]);
        this.bg.add(this.mountains[1]);
        this.bg.add(this.trees[0]);
        this.bg.add(this.trees[1]);
        this.bg.add(this.ground[0]);
        this.bg.add(this.ground[1]);
        this.bg.scale.setTo(this.scaleFactor);

        this.buildNinja();
        this.input.onDown.add(this.ninjaSlide, this);
        this.input.onUp.add(this.ninjaRun, this);

        this.buildBirds();

        this.totalLives_text = this.add.bitmapText(10, 10, 'eightbitwonder', 'Lives Left ' + this.totalLives, 20);
        this.totalBirds_text = this.add.bitmapText(this.world.width-225, 10, 'eightbitwonder', 'Birds Left ' + this.totalbirds, 20);
    },

    addBird: function() {
        // Create a bird at the position x and y
        var bird = this.add.sprite(this.world.width / 2, this.world.height / 2, 'ninja');

        // Add the bird to our previously created group
        this.birdgroup.add(bird);

        // Enable physics on the bird 
        this.physics.arcade.enable(bird);

        // Add velocity to the bird to make it move left
        bird.body.velocity.x = -200;

        // Automatically kill the bird when it's no longer visible 
        bird.checkWorldBounds = true;
        bird.outOfBoundsKill = true;
    },

    buildNinja: function() {
        this.ninja = this.add.sprite(this.world.width / 2, this.world.height / 2, 'ninja');
        this.ninja.scale.setTo(Math.pow(this.scaleFactor, 2));
        this.ninja.x = this.world.width * Math.pow(this.scaleFactor, 3);
        this.ninja.y = this.world.height * 0.865;
        this.ninja.anchor.setTo(0.5, 1);
        this.ninja.inputEnabled = true;
        this.ninja.animations.add('idling', Phaser.Animation.generateFrameNames('Idle__', 0, 9, '', 3), Math.floor(this.gameSpeed * 0.6), true);
        this.ninja.animations.add('sliding', Phaser.Animation.generateFrameNames('Slide__', 0, 9, '', 3), Math.floor(this.gameSpeed * 1), true);
        this.ninja.animations.add('running', Phaser.Animation.generateFrameNames('Run__', 0, 9, '', 3), Math.floor(this.gameSpeed * 0.8), true);
        this.ninja.animations.play('running');
        this.physics.enable(this.ninja, Phaser.Physics.ARCADE);
        this.ninja.enableBody = true;
        this.ninja.checkWorldBounds = true;
        this.ninja.body.velocity.x = 0;

        this.ninja.events.onInputDown.add(this.togglePaused, this);
    },

    ninjaRun: function() {
        if (!this.gamePaused) {
            this.ninja.animations.play('running');
        }
    },

    ninjaSlide: function() {
        if (!this.gamePaused) {
            this.ninja.animations.play('sliding');
        }
    },

    resizeNinja: function(n) {
        n.scale.x == Math.pow(this.scaleFactor, 2) ? this.ninja.scale.setTo(.3 / this.scaleFactor) : this.ninja.scale.setTo(Math.pow(this.scaleFactor, 2));
    },

    buildBirds: function() {
        this.birdgroup = this.add.group();
        for (var i = 0; i < this.totalbirds; i++) {
            var b = this.birdgroup.create(this.world.width / this.scaleFactor, this.rnd.integerInRange(0, this.world.height * this.scaleFactor), 'bird', 'frame-1');
            var scale = this.rnd.realInRange(0.1, 0.2);
            b.scale.x = -scale;
            b.scale.y = scale;
            this.physics.enable(b, Phaser.Physics.ARCADE);
            b.enableBody = true;
            b.body.velocity.x = this.rnd.integerInRange(-200, -400);
            b.animations.add('fly');
            b.animations.play('fly', 24, true);
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(this.resetBird, this);
        }
    },

    resetBird: function(b) {
        if(b.x < 0-b.width) {
            this.respawnBird(b);   
        }
    },
    
    respawnBird: function(b) {
        if(this.gameover == false){
            b.reset(this.world.width / this.scaleFactor, this.rnd.integerInRange(0, this.ninja.y - this.ninja.height - b.height / 2  + this.rnd.realInRange(-5 , 5)));
            b.body.velocity.x = this.rnd.integerInRange(-200, -400);
        }
    },

    parallax: function() {

        this.ground[0].x -= this.gameSpeed * .6;
        this.ground[1].x -= this.gameSpeed * .6;
        this.trees[0].x -= this.gameSpeed * .08;
        this.trees[1].x -= this.gameSpeed * .08;
        this.mountains[0].x -= this.gameSpeed * .04;
        this.mountains[1].x -= this.gameSpeed * .04;
        this.clouds[0].x -= this.gameSpeed * .02;
        this.clouds[1].x -= this.gameSpeed * .02;
        this.sky[0].x -= 0 //this.gameSpeed * .02;
        this.sky[1].x -= 0 //this.gameSpeed * .02;

        if (this.ground[0].x < -this.ground[0].width) {
            this.ground[0].x = this.world.width + this.ground[0].width / 2 - 12;
        }
        if (this.ground[1].x < -this.ground[1].width) {
            this.ground[1].x = this.world.width + this.ground[1].width / 2 - 12;
        }
        if (this.trees[0].x < -this.trees[0].width) {
            this.trees[0].x = this.world.width + this.trees[0].width / 2 - 6;
        }
        if (this.trees[1].x < -this.trees[1].width) {
            this.trees[1].x = this.world.width + this.trees[1].width / 2 - 6;
        }
        if (this.mountains[0].x < -this.mountains[0].width) {
            this.mountains[0].x = this.world.width + this.mountains[0].width / 2 - 6;
        }
        if (this.mountains[1].x < -this.mountains[1].width) {
            this.mountains[1].x = this.world.width + this.mountains[1].width / 2 - 6;
        }
        if (this.clouds[0].x < -this.clouds[0].width) {
            this.clouds[0].x = this.world.width + this.clouds[0].width / 2 - 6;
        }
        if (this.clouds[1].x < -this.clouds[1].width) {
            this.clouds[1].x = this.world.width + this.clouds[1].width / 2 - 6;
        }
        if (this.sky[0].x < -this.sky[0].width) {
            this.sky[0].x = this.world.width + this.sky[0].width / 2 - 6;
        }
        if (this.sky[1].x < -this.sky[1].width) {
            this.sky[1].x = this.world.width + this.sky[1].width / 2 - 6;
        }
    },
    
    togglePaused: function() {
        this.gamePaused ? this.gamePaused = false : this.gamePaused = true;
        console.log('hit');
    },

    checkLivesLeft: function() {
        if(this.totalLives <= 0){
            //this.gameover = true;
            //this.music.stop();
            //this.countdown.setText('Bunnies Left 0');
            //this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER\n\n' + this.secondsElapsed, 42);
            //this.overmessage.align = "center";
            //this.overmessage.inputEnabled = true;
            //this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
            this.state.start('StartMenu')
        }else {
            this.totalLives_text.setText('Lives Left ' + this.totalLives);
            this.totalBirds_text.setText('Birds left ' + this.totalbirds);
        }
    },

    birdHit: function(ninja, b) {
        if(b.exists){
            //this.ouch.play();
            //this.respawnRock(r);
            //this.makeGhost(b);
            b.kill();
            this.totalLives--;
            this.totalbirds--;
            this.checkLivesLeft();
        }
    },

    update: function() {
        this.physics.arcade.overlap(this.birdgroup, this.ninja, this.birdHit, null, this);
        if (!this.gamePaused) {
            this.parallax();
        } else {
            //
        }
    }

};