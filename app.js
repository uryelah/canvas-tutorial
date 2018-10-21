// Some app setup.
const ENEMIES_STORE = [];
let ENEMIES_SIZE = 45;
const ENEMIES_COLORS = [
  'red', 'blue', 'yellow', 'white',
  'green', 'purple', 'navy', 'silver', 'olive',
  'lime', 'fuchsia', 'teal', 'aqua', 'maroon'
];
let ENEMY_SPRITE = new Image();
let HERO_SPRITE = new Image();
let ENEMY_SPRITE_SOURCE = "img/transparent-ufo-8-bit.gif";

const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_COLOR = "white";
const BULLET_STORE = [];
const HERO_SIZE = ENEMIES_SIZE;
const HERO_COLOR = 'grey';
let shooting = false;

let lost = false;
let score = 0;
let score_color = "green";
let score_font = '20px Verdana';
let score_x = 400;
let score_y = 30;
const GAME_OVER_FONT = '20px Verdana';
const GAME_OVER_COLOR = 'white';
const GAME_OVER_TEXT = 'GAME OVER';
const GAME_OVER_X = 185;
const GAME_OVER_Y = 220;
const RESTART_TEXT =  'press Enter to RESTART';
const PAUSED_TEXT = "GAME PAUSED";
let paused;

// Getting the DOM element.
const canvas = document.getElementById('my-canvas');

// Getting the 2d context.
const ctx = canvas.getContext('2d');

// Paused text y coord 
let PAUSED_TEXT_Y_ALIGN = (canvas.width/1.8) - (PAUSED_TEXT.length/2) * parseInt(GAME_OVER_FONT);

// Our looper control.
let looper;

// Animation frames counter.
let frames = 0;

// Stage of time survived counter.
let stage = 1;

let speed = 1.5;

// Our class that will generate enemies instances.
class Enemy {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.width = ENEMIES_SIZE;
    this.height = ENEMIES_SIZE;
    // Getting a random color when the object is instantiated.
    this.color = ENEMIES_COLORS[Math.floor(Math.random() * ENEMIES_COLORS.length)];
  }

  draw() {
    if(frames < 3000){
      ENEMIES_SIZE = 100;
      if(frames % 40 > 0 && frames % 40 < 16){
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);  
        ENEMY_SPRITE_SOURCE = "img/ezgif.com-crop(1).gif";
        ENEMY_SPRITE.src = ENEMY_SPRITE_SOURCE;
        this.y += stage/speed;
        ctx.drawImage(ENEMY_SPRITE, this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);
        } else {
          ENEMY_SPRITE_SOURCE = "img/ezgif.com-rotate(2).gif";
          ENEMY_SPRITE.src = ENEMY_SPRITE_SOURCE;
        this.y += stage/speed;
        ctx.drawImage(ENEMY_SPRITE, this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);
        }
    } else{
      ENEMIES_SIZE = 75;
      if(frames % 40 > 0 && frames % 40 < 16){
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);  
        ENEMY_SPRITE_SOURCE = "img/ezgif.com-crop(1).gif";
        ENEMY_SPRITE.src = ENEMY_SPRITE_SOURCE;
        this.y += stage/speed;
        ctx.drawImage(ENEMY_SPRITE, this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);
        } else {
          ENEMY_SPRITE_SOURCE = "img/ezgif.com-rotate(2).gif";
          ENEMY_SPRITE.src = ENEMY_SPRITE_SOURCE;
        this.y += stage/speed;
        ctx.drawImage(ENEMY_SPRITE, this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);
        }
    }
      
  }
  // Check position against bullets
  checkIfShot(bullet) {
    return (this.x < bullet.x + bullet.width) && (this.x + this.width > bullet.x) && (this.y + this.height > bullet.y) && (this.y < bullet.y + bullet.height);
  } 
}

// Bullet class
class Bullet {
  constructor(x) {
    this.x = ourHero.x + (HERO_SIZE/2) - BULLET_WIDTH;
    this.y = canvas.height - HERO_SIZE;
    this.width = BULLET_WIDTH;
    this.height = BULLET_HEIGHT;
    this.color = BULLET_COLOR;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, BULLET_WIDTH, BULLET_HEIGHT);
    this.y -= 10;
  }
}

const createBullet = (x) => { 
  BULLET_STORE.push(new Bullet());
}

// Our Hero class.
class Hero {
  constructor() {
    this.x = 0;
    this.y = canvas.height - HERO_SIZE;
    this.width = HERO_SIZE;
    this.height = HERO_SIZE;
    this.color = HERO_COLOR;
  }
  draw() {
    // Prevent our hero from going beyond the available area.
    if (this.x < 0) this.x = 0;
    if (this.x > canvas.width - HERO_SIZE) this.x = canvas.width - HERO_SIZE;

    // Drawing the hero itself.
    //ctx.fillStyle = this.color;
    //ctx.fillRect(this.x, this.y, HERO_SIZE, HERO_SIZE); 
    if (lost){
      HERO_SPRITE.src = "img/ezgif.com-gif-maker.png";
    }else if(shooting){
      HERO_SPRITE.src = "img/hero.png"
      ctx.drawImage(HERO_SPRITE, this.x, this.y + 10 , 45, 35);
    } else {
      HERO_SPRITE.src = "img/hero.png"
      ctx.drawImage(HERO_SPRITE, this.x, this.y, 45, 45);
    }
  }
  // Checks the hero position against enemies position.
  checkCollision(enemy) {
    return (this.x < enemy.x + enemy.width - 10) && (this.x + this.width > enemy.x + 10) && (this.y < enemy.y + enemy.height - 25) && (this.y + this.height >enemy.y + enemy.height);
  } 
  
}

//const drawEnemies = () => {
//  BULLET_STORE.forEach(bullet => bullet.draw());
//}

// This function just instantiate one enemy in a random x position and add it to the array of enemies.
const createEnemy = () => {
  if(frames < 30000){
    if (frames % (ENEMIES_SIZE+10) === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    }
  } else if(frames < 60000){
    if (frames % ENEMIES_SIZE === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    }
  } else if(frames < 90000){
    if (frames % ENEMIES_SIZE - (ENEMIES_SIZE/4) === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    } 
  }else if(frames < 120000){
    if (frames % ENEMIES_SIZE - (ENEMIES_SIZE/3) === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    }
    
  }else if(frames < 150000){
    if (frames % ENEMIES_SIZE - (ENEMIES_SIZE/2) === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    }
    
  }else if(frames < 360000){
    if (frames % ENEMIES_SIZE - (ENEMIES_SIZE/1.75) === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    }
    
  }else if(frames < 390000){
    if (frames % ENEMIES_SIZE - (ENEMIES_SIZE/1.5) === 0) { 
      // Set enemy x coordinate from 0 to 450.
      const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
      // Adding the enemy to the array of enemies.
      ENEMIES_STORE.push(new Enemy(x+20));
    }

  }

}

// This functions performs a loop in the enemies array and draw each enemy.
const drawEnemies = () => {
  if(!lost){
      // Drawing all enemies.
  ENEMIES_STORE.forEach(enemy => enemy.draw());
  }

}

// Colission checker.
const collisionChecker = () => {
  ENEMIES_STORE.forEach(enemy => {
    if (ourHero.checkCollision(enemy)) {
      lost = true;
      ENEMIES_STORE.splice(0, ENEMIES_STORE.length-1)
      
      setTimeout(function(){
        gameOver();
      },1000)
    }
  })
}

// Enemy BUllet colission checker.
const enemyGotHit = () => {
  BULLET_STORE.forEach(function(bullet){
    ENEMIES_STORE.forEach(enemy => {
      if (enemy.checkIfShot(bullet)){
        ENEMIES_STORE.splice(ENEMIES_STORE.indexOf(enemy),1);
        BULLET_STORE.splice(BULLET_STORE.indexOf(bullet),1);
        score += 1;
        return
      }
    })
  })

}

//Out of Canvas chexker. 
const outOfCanvasChecker = () => {
  ENEMIES_STORE.forEach(enemy => {
    if (enemy.y > 500){
      ENEMIES_STORE.shift();
    }
  })
}

//Game Pause state toggle.
const togglePause = () => {
  !paused ? paused = true : paused = false;
}

// We just need one hero, so let's instantiate it.
const ourHero = new Hero();

// Canvas cleaner.
const resetCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

// Each loop we call render function.
const render = () => {
  // Check is game is not paused
  if(!paused){
  // We clean everything in the canvas.
  resetCanvas();

  // Incremeting frames for each loop.
  frames += 1;

  // Increment stage
  stage += 0.0001;

  scoreFunc();

  // Drawing our hero in the current position.
  ourHero.draw();

  // Instantiate one new enemy at a random x position and add it to the enemies array.
  createEnemy();

  // Draw all enemies available in the enemies array.
  drawEnemies();

  BULLET_STORE.forEach(bullet => bullet.draw());

  // Collision checker.
  collisionChecker();

  // Enemy got hit checker.
  ENEMIES_STORE.forEach(enemy => enemyGotHit());

  // Out of Canvas checker.--
  // check if enemy is out of canvas and shifts it out the array
  outOfCanvasChecker();
  }
}

// Keyboard listener to check if the user press arrows keys.
window.addEventListener('keydown', (e) => {
  // Left arrow key.
  if (e.keyCode === 37) {
    if (ourHero.x <= 0) return;
    ourHero.x -= HERO_SIZE/2;
  }
  // Right arrow key.
  if (e.keyCode === 39) {
    if (ourHero.x >= canvas.width - HERO_SIZE) return;
    ourHero.x += HERO_SIZE/2;
  }  
  // Space key
  if (e.keyCode === 32) {
    if(!paused){
      togglePause();
      looper.preventDefault;
      ctx.font = GAME_OVER_FONT;
      ctx.fillStyle = GAME_OVER_COLOR;
      ctx.fillText(PAUSED_TEXT, PAUSED_TEXT_Y_ALIGN, 250);
    } else {
      togglePause();
      looper.preventDefault;
    }
  }  
  if(e.keyCode === 88){
    createBullet(ourHero.x);
    shooting = true;
    setTimeout(function(){
      shooting = false;
    }, 500)
    //BULLET_STORE[BULLET_STORE.length-1].draw();
    //ourHero.shotBullet;
  }
  if(e.keyCode === 13 && lost){
    lost = false;
    looper = setInterval(render, 0);
  }
  //Makes enemies fall faster if down key arrow is down;
  if(e.keyCode === 40){
    speed = 0.5;
    window.addEventListener( 'keyup', (e) => {
      if(e.keyCode === 40){
        if(speed === 0.5){
          speed = 1.5;
        }
      }
    });
  }
});




// Stop the looper and print game over message.
const gameOver = () => {
  clearInterval(looper);
  ctx.font = GAME_OVER_FONT;
  ctx.fillStyle = GAME_OVER_COLOR;
  ctx.fillText(GAME_OVER_TEXT, GAME_OVER_X, GAME_OVER_Y);
  ctx.fillStyle = "red";
  ctx.fillText(RESTART_TEXT, GAME_OVER_X-55, GAME_OVER_Y+30);
  ctx.fillStyle = 'white';
  ctx.fillText("Enemies missed: " + ENEMIES_STORE.length, GAME_OVER_X-20, GAME_OVER_Y+60)

  resetGlobalVariables();
}

let scoreFunc = () => {
  ctx.font = score_font;
  ctx.fillStyle = score_color;
  ctx.fillText("Score: " + score, score_x, score_y);
}

const resetGlobalVariables = () => {
  score = 0;
  stage =1;
  frames = 1;
}

// Starting looper.
looper = setInterval(render, 0);