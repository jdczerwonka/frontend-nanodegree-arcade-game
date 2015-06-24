var LIVES_START = 3;

var COL_WIDTH = 101, ROW_HEIGHT = 83;
var COL_NUM = 7, ROW_NUM = 6;
var COL_START = 3; ROW_START = 4;
var OFFSET = 61;
var ENEMY_NUM_START = 2, ENEMY_ROW_NUM = 4; ENEMY_NUM_MAX = 10; ENEMY_FREQUENCY = 15;
var ENEMY_SPEED_FREQUENCY = 10, ENEMY_SPEED_INCR = 5;

var BLUE_GEM_VALUE = 100, GREEN_GEM_VALUE = 200, ORANGE_GEM_VALUE = 500;
var BLUE_GEM_DURATION = 15, GREEN_GEM_DURATION = 10, ORANGE_GEM_DURATION = 5;
var BLUE_GEM_URL = "images/gem-blue.png", GREEN_GEM_URL = "images/gem-green.png", ORANGE_GEM_URL = "images/gem-orange.png";
var GEM_FREQUENCY = 5;



// This class handles the various variables and functions associated with
// this game including game time, lives, score, and the generation of new
// enemies and gems.
var Game = function(){
    "use strict";
    this.lives = LIVES_START;
    this.life_time = 0;
    this.time_start = Date.now();
    this.score = 0;
};

// This function decides whether or not to create a gem, and
// if so, what kind of gem should be created.
Game.prototype.create_gem = function(){
    "use strict";
    //  Generates a gem every GEM_FREQUENCY seconds
    if(this.time_curr() % GEM_FREQUENCY === 0){
        // Since the game renders ~60 fps the createdGem function ensures that only
        // one gem is created a second
        if(this.createdGem === false){
            var rand = Math.floor(Math.random() * 100) + 1;
            var aGem;

            if(rand < 10){                       // 10% of the time an orange gem is created
                aGem = new Gem("orange");
            } else if(rand < 15){                // 5% of the time a heart gem is created
                aGem = new Gem("heart");
            } else if(rand < 50){                // 35% of the time a green gem is created
                aGem = new Gem("green");
            } else {                             // 50% of the time a blue gem is created
                aGem = new Gem("blue");
            }

            allRewards.push(aGem);
            this.createdGem = true;
        }
    } else {
        this.createdGem = false;
    }
};

// This function decides whether or not to create an additional
// enemy on the game board.
Game.prototype.create_enemy = function(){
    "use strict";
    if(allEnemies.length <= ENEMY_NUM_MAX){
        if(allEnemies.length !== this.enemy_num()){
            allEnemies.push(new Enemy());
        }
    }
};

// This function slowly increases the baseline speed of all enemies
// every ENEMY_SPEED_FREQUENCY seconds by ENEMY_SPEED_INCR amount.
Game.prototype.enemy_speed_boost = function(){
    "use strict";
    return (Math.floor(this.time_curr() / ENEMY_SPEED_FREQUENCY) * ENEMY_SPEED_INCR);
};

// This function determines how many enemies should be on the game
// board given how many seconds have passed in the game.
Game.prototype.enemy_num = function(){
    "use strict";
    return Math.floor(this.time_curr() / ENEMY_FREQUENCY) + ENEMY_NUM_START;
};

// This function increments lives by 1.
Game.prototype.inc_life = function(){
    "use strict";
    this.lives++;
};

// This function decrements lives by 1.
Game.prototype.dec_life = function(){
    "use strict";
    this.lives--;
};

// This function determines how many seconds have passed since the
// game started.
Game.prototype.time_curr = function(){
    "use strict";
    return Math.floor((Date.now() - this.time_start) / 1000);
};

// This function calls functions to check if an enemy or
// gem needs to be added to the game board.
Game.prototype.update = function(){
    "use strict";
    this.create_enemy();
    this.create_gem();
};

// This function renders the relevant game information on to the canvas.
Game.prototype.render = function(){
    "use strict";
    ctx.font = "28pt Impact";
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    // ctx.strokeText(this.time_curr(), 50, 40);

    ctx.textAlign = "left";
    ctx.fillText(this.lives, 10, 580);
    ctx.strokeText(this.lives, 10, 580);

    ctx.textAlign = "right";
    ctx.fillText(this.score, COL_WIDTH * COL_NUM - 10, 580);
    ctx.strokeText(this.score, COL_WIDTH * COL_NUM - 10, 580);
};




// This class handles the various variables and functions associated
// with gems.  Gems are objects that the player tries to collect
// which enable him to improve his status in the game.
var Gem = function(color){
    "use strict";
    switch(color){
        case "blue":
            this.sprite = BLUE_GEM_URL;
            this.gem_value = BLUE_GEM_VALUE;
            this.duration = BLUE_GEM_DURATION;
            this.gem_type = "gem";
            break;
        case "green":
            this.sprite = GREEN_GEM_URL;
            this.gem_value = GREEN_GEM_VALUE;
            this.duration = GREEN_GEM_DURATION;
            this.gem_type = "gem";
            break;
        case "orange":
            this.sprite = ORANGE_GEM_URL;
            this.gem_value = ORANGE_GEM_VALUE;
            this.duration = ORANGE_GEM_DURATION;
            this.gem_type = "gem";
            break;
        case "heart":
            this.sprite = "images/Heart.png";
            this.gem_value = 1;
            this.duration = 5;
            this.gem_type = "heart";
            break;
    }

    this.time_start = game_state.time_curr();
    this.set_pos();
};

// This function determines whether or not a gem needs to be removed
// from the game board based on the length of time that it has existed.
Gem.prototype.remove = function(){
    "use strict";
    return this.time_start + this.duration < game_state.time_curr();
};

// This function renders the gem on to the canvas.
Gem.prototype.render = function(){
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function sets the position of the gem on the canvas.
Gem.prototype.set_pos = function(){
    "use strict";
    this.x = COL_WIDTH * Math.floor(Math.random() * COL_NUM);
    this.y = OFFSET + ROW_HEIGHT * Math.floor(Math.random() * ENEMY_ROW_NUM);
};




// This class handles the various variables and functions associated
// with enemies.  Enemies are objects that the player tries to avoid
// otherwise he forfeits a life.
var Enemy = function() {
    "use strict";
    this.sprite = 'images/enemy-bug.png';
    this.set_pos();
    this.set_speed();
};

// This function updates an enemy's position.  If he moves off the
// game board then a new position and speed are generated for him.
Enemy.prototype.update = function(dt) {
    "use strict";
    if(this.x < COL_WIDTH * COL_NUM){
        this.x += dt * this.speed;
    } else {
        this.set_pos();
        this.set_speed();
    }
};

// This function renders the enemey on to the canvas.
Enemy.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function sets an enemy's initial position.
Enemy.prototype.set_pos = function(){
    "use strict";
    this.x = -COL_WIDTH;
    this.y = OFFSET + ROW_HEIGHT * Math.floor(Math.random() * ENEMY_ROW_NUM);
};

// This function sets an enemy's initial speed.
Enemy.prototype.set_speed = function(){
    "use strict";
    this.speed = 50 + game_state.enemy_speed_boost() + 25 * Math.floor((Math.random() * 5) + 1);
};




// This class handles the various variables and functions associated
// with the player.  The player's goal is to collect gems while
// avoiding enemies.
var Player = function(){
    "use strict";
    this.sprite = 'images/char-boy.png';
    this.start_pos();
};

// This function sets the player's initial position
Player.prototype.start_pos = function(){
    "use strict";
    this.x = COL_START * COL_WIDTH;
    this.y = OFFSET + ROW_START * ROW_HEIGHT;
};

// This function determines whether or not the player has
// collided with either an enemy or gem and updates the
// game accordingly.
Player.prototype.update = function(){
    "use strict";
    for(var x = 0; x < allEnemies.length; x++){
        if(allEnemies[x].y === this.y && allEnemies[x].x > this.x - 65 && allEnemies[x].x < this.x + 35){
            this.start_pos();
            game_state.dec_life();
            break;
        }
    }

    for(var x = allRewards.length - 1; x >= 0; x--){
        if(allRewards[x].y === this.y && allRewards[x].x > this.x - 65 && allRewards[x].x < this.x + 35){
            if(allRewards[x].gem_type === "gem"){
                game_state.score += allRewards[x].gem_value;
            } else {
                game_state.inc_life();
            }
            allRewards.splice(x, 1);
            break;
        }
    }
};

// This function renders the player on to the canvas.
Player.prototype.render = function(){
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function handles input from the human player
// and updates the game player's position accordingly.
Player.prototype.handleInput = function(dir){
    "use strict";
    switch(dir){
        case 'left':
            if(this.x > 0){
                this.x -= COL_WIDTH;
            }
            break;
        case 'up':
            if(this.y > 0){
                this.y -= ROW_HEIGHT;
            }
            break;
        case 'right':
            if(this.x < (COL_NUM - 1) * COL_WIDTH){
                this.x += COL_WIDTH;
            }
            break;
        case 'down':
            if(this.y < OFFSET + ROW_START * ROW_HEIGHT){
                this.y += ROW_HEIGHT;
            }
            break;
    }
};


// Instantiates all objects and arrays of objects.
var game_state = new Game();
var player = new Player();
var allEnemies = [];
var allRewards = [];

// Places any enemies to start the game in the allEnemies array.
for(var x = 0; x < ENEMY_NUM_START; x++){
    allEnemies.push(new Enemy());
}

// This listens for key presses and sends the keys to the
// player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
