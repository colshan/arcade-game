let grunt = new Audio('images/grunt.mp3');
let scream = new Audio('images/scream.mp3');


// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    let sprites = ['images/char-cat-girl.png',
                    'images/char-horn-girl.png',
                    'images/char-pink-girl.png',
                    'images/char-princess-girl.png']

    this.sprite = sprites[Math.floor(Math.random()*4)];

    this.y = Math.floor(Math.random()*6-1)*85+60;
    this.x = Math.floor(Math.random()*-2000);
    this.speed = Math.random()*3+1
    this.size = 70;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    this.x += 100*dt*this.speed;

    if (this.x > 1500){ //wraparound
        this.x -= 2500;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 404;
    this.y = 230;
    this.money = 100;
    this.dead = false;
    this.max = 100;
    this.size = 70;
}

Player.prototype.update = function (){
}

Player.prototype.render = function (dt){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.injure = function (){

    if (!this.dead){
        grunt.play();
        this.money -= 4;
        document.getElementById('money').innerHTML = '$' + this.money;

        if (this.money <= 0){
            this.die();
        }
    }
}

Player.prototype.increaseMoney = function () {

    this.money += 20;
    let bell = new Audio('images/bell.mp3');
    bell.play();
    if (this.money > this.max){
        this.max = this.money;
    }

    document.getElementById('money').innerHTML = '$' + this.money;

}

Player.prototype.die = function () {

    this.dead = true;
    scream.play();
    music.playbackRate = 1;
    $('#modal-background').toggle();
    $('#modal-content').html(`<p>You are bankrupt.  Your highest balance was $${this.max}. Would you like to play again?</p>`);
    $('#modal-content').append('<button class="modal-button restart" id="restart">Restart</button>');
    $('.modal-button').on('click', function () {
        window.location.reload(false);
    });
}

Player.prototype.handleInput = function (direction){
    if (!this.dead){
        switch (direction){
            case 'left':
                if (this.x > 0){
                    this.x -= 101;
                }
                break;
            case 'right':
                if (this.x < 700){
                    this.x += 101;
                }
                break;
            case 'up':
                if (this.y >= 0){
                    this.y -= 85;
                }
                break;
            case 'down':
                if (this.y < 400){
                    this.y += 85;
                }
        }
    }   
}


Player.prototype.checkCollision = function (otherEntity) {
    const size = this.size/2 + otherEntity.size/2;

    if (Math.abs(otherEntity.y - this.y ) < size){

        if (Math.abs(otherEntity.x - this.x) < size){

            return true;
            
            }
        }
    return false;
}

Player.prototype.checkCollisions = function () {

    for (enemy of allEnemies){

            if (this.checkCollision(enemy)){
                this.injure();
            };
        }

    if (this.checkCollision(gem)){

        this.increaseMoney();
        gem.position();

    }
}




var Gem = function () {

    this.sprite = 'images/Gem Orange.png';

    this.x = Math.random()*708;
    this.y = Math.random()*406;
    this.size = 70;
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.update = function () {

}

Gem.prototype.position = function () {

    this.x = Math.random()*708;
    this.y = Math.random()*406;

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
})


const player = new Player();
const gem = new Gem();
            
let allEnemies = [];
generateEnemies();


function generateEnemies () {

    for (var i =0; i < 30; i++){
        allEnemies.push(new Enemy());
    }
}


