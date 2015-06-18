var gt = 0
var LIVES_START = 3

var COL_WIDTH = 101, ROW_HEIGHT = 83;
var COL_NUM = 7, ROW_NUM = 6;
var COL_START = 3; ROW_START = 4;
var OFFSET = 61;
var ENEMY_NUM_START = 2, ENEMY_ROW_NUM = 4; ENEMY_NUM_MAX = 10; ENEMY_FREQUENCY = 15;

var BLUE_GEM_VALUE = 100, GREEN_GEM_VALUE = 200, ORANGE_GEM_VALUE = 500;
var BLUE_GEM_DURATION = 15, GREEN_GEM_DURATION = 10, ORANGE_GEM_DURATION = 5;
var GEM_FREQUENCY = 5;


var Game = function(){
    this.lives = LIVES_START;
    this.life_time = 0;
    this.time_start = Date.now();
    this.score = 0;
}

Game.prototype.enemy_speed_boost = function(){
    return (Math.floor(this.time_curr() / 10) * 5);
}

Game.prototype.create_gem = function(){
    if(this.time_curr() % GEM_FREQUENCY === 0){
        if(this.createdGem === false){
            var rand = Math.floor(Math.random() * 100) + 1

            if(rand < 10){
                var aGem = new Gem("orange");
            } else if(rand < 50){
                var aGem = new Gem("green");
            } else {
                var aGem = new Gem("blue");
            }

            allRewards.push(aGem);
            this.createdGem = true;
        }
    } else {
        this.createdGem = false;
    }
}

Game.prototype.inc_life = function(){
    this.lives++;
}

Game.prototype.dec_life = function(){
    this.lives--;
    if(this.lives < 1){
        console.log("GAME OVER!!");
    }
}

Game.prototype.enemy_num = function(){
    return Math.floor(this.time_curr() / ENEMY_FREQUENCY) + ENEMY_NUM_START;
}

Game.prototype.time_curr = function(){
    return Math.floor((Date.now() - this.time_start) / 1000);
}

Game.prototype.update = function(){
    if(allEnemies.length <= ENEMY_NUM_MAX){
        if(allEnemies.length !== this.enemy_num()){
            allEnemies.push(new Enemy);
        }
    }

    this.create_gem();
}

Game.prototype.render = function(){
    ctx.font = "28pt Impact";
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    // ctx.strokeText(this.time_curr(), 50, 40);

    ctx.textAlign = "left"
    ctx.fillText(this.lives, 10, 580);
    ctx.strokeText(this.lives, 10, 580);

    ctx.textAlign = "right"
    ctx.fillText(this.score, COL_WIDTH * COL_NUM - 10, 580);
    ctx.strokeText(this.score, COL_WIDTH * COL_NUM - 10, 580);
}

var Gem = function(color){
    switch(color){
        case "blue":
            this.sprite = 'images/Gem Blue.png'
            this.gem_value = BLUE_GEM_VALUE;
            this.duration = BLUE_GEM_DURATION;
            break;
        case "green":
            this.sprite = "images/Gem Green.png"
            this.gem_value = GREEN_GEM_VALUE
            this.duration = GREEN_GEM_DURATION;
            break;
        case "orange":
            this.sprite = "images/Gem Orange.png"
            this.gem_value = ORANGE_GEM_VALUE
            this.duration = ORANGE_GEM_DURATION;
            break;
    }

    this.time_start = game_state.time_curr();
    this.set_pos();
}

Gem.prototype.get_gem_value = function(){
    return this.gem_value;
}

Gem.prototype.remove = function(){
    return this.time_start + this.duration < game_state.time_curr()
}

Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.set_pos = function(){
    this.x = COL_WIDTH * Math.floor(Math.random() * COL_NUM);
    this.y = OFFSET + ROW_HEIGHT * Math.floor((Math.random() * ENEMY_ROW_NUM));
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.set_pos();
    this.set_speed();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if(this.x < COL_WIDTH * COL_NUM){
        this.x += dt * this.speed;
    } else {
        this.set_pos();
        this.set_speed();
    }
}

Enemy.prototype.set_pos = function(){
    this.x = -COL_WIDTH;
    this.y = OFFSET + ROW_HEIGHT * Math.floor((Math.random() * ENEMY_ROW_NUM));
}

Enemy.prototype.set_speed = function(){
    this.speed = 50 + game_state.enemy_speed_boost() + 25 * Math.floor((Math.random() * 5) + 1);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.start_pos();
}

Player.prototype.start_pos = function(){
    this.x = COL_START * COL_WIDTH;
    this.y = OFFSET + ROW_START * ROW_HEIGHT; 
}

Player.prototype.update = function(){
    for(var x = 0; x < allEnemies.length; x++){
        if(allEnemies[x].y === this.y && allEnemies[x].x > this.x - 65 && allEnemies[x].x < this.x + 35){
            this.start_pos();
            game_state.dec_life();
            break;
        }
    }

    for(var x = allRewards.length - 1; x >= 0; x--){
        if(allRewards[x].y === this.y && allRewards[x].x > this.x - 65 && allRewards[x].x < this.x + 35){
            game_state.score += allRewards[x].get_gem_value();
            allRewards.splice(x, 1);
            break;
        }
    }
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(dir){
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
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var game_state = new Game();
var player = new Player();
var allEnemies = [];
var allRewards = [];

for(var x = 0; x < ENEMY_NUM_START; x++){
    allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
