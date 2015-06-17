var COL_WIDTH = 101, ROW_HEIGHT = 83;
var COL_NUM = 5, ROW_NUM = 6;
var COL_START = 2; ROW_START = 4;
var OFFSET = 61;
var ENEMY_NUM = 6;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = Math.floor((Math.random() * COL_WIDTH * COL_NUM) + 1);
    this.y = OFFSET + ROW_HEIGHT * Math.floor((Math.random() * 3));
    this.speed = 50 + 25 * Math.floor((Math.random() * 5) + 1);
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
        this.x = -COL_WIDTH;
    }
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
            if(this.y > ROW_HEIGHT){
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

var player = new Player();
var allEnemies = [];

for(var x = 0; x < ENEMY_NUM; x++){
    allEnemies[x] = new Enemy();
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
