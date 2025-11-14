const config = {
  type: Phaser.CANVAS,
  width: 1400,
  height: 700,
  background: "#000",

  scene: { preload, create, update },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: true,
    },
  },
};

let max = config.width / 2;
let min = config.width / 2;

let cursor;
let player;
let score = 0;
let scoreDisplay;

const winDisplay = document.getElementById('winCondition');
const game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/images/sky.png");
  this.load.image("player", "assets/images/face.png");
  this.load.image("run1", "assets/images/run1.png");
  this.load.image("run2", "assets/images/run1.png");
  this.load.image("ground", "assets/images/ground_1.png");
  this.load.image("right1", "assets/images/right1.png");
  this.load.image("right2", "assets/images/right2.png");
  this.load.image("right", "assets/images/right.png");
  this.load.image("coin", "assets/images/coin.png");
}

function create() {
  cursor = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: "playerWalk",
    frames: [{ key: "run1" }, { key: "run2" }],
    frameRate: 5,
    repeat: -1,
  });

  this.anims.create({
    key: "playerRunDroite",
    frames: [{ key: "right1" }, { key: "right" }, { key: "right2" }],
    frameRate: 10,
    repeat: -1,
  });

  // this.anims.create({
  //   key: "playerJump",
  //   frames: [{ key: "right1" }, { key: "right" }],
  //   frameRate: 10,
  //   repeat: -1,
  // });


  const sky = this.add.sprite(0, 0, "sky");
  sky.setPosition(config.width / 2, config.height / 2);
  sky.setScale(2);

  player = this.physics.add.sprite(100, 100, "player");
  player.setCollideWorldBounds(true);
  player.body.setSize(130, 130);
  player.flipInProgress = false;


  const ground1 = this.physics.add.staticSprite(350, 550, "ground");
  const ground2 = this.physics.add.staticSprite(500, 450, "ground");

  const platforms = this.physics.add.staticGroup();
  platforms.add(ground1);
  platforms.add(ground2);

  this.physics.add.collider(player, platforms);

const coin = this.physics.add.sprite(
  randomNumber(100, config.width - 100),
  randomNumber(100, config.height - 200),
  "coin"
);
coin.setImmovable(true); 
  coin.body.allowGravity = false;
  
  this.physics.add.overlap(player, coin, collectCoin, null, this);

  scoreDisplay = this.add.text(config.width - 200, 30, "Score: 0", {
    fontFamily: "monospace",
    fontSize: "32px",
    fill: "#fff"
  });



}

function update() {
  if (cursor.left.isDown) {
    player.setVelocityX(-200);
    player.anims.play("playerRunDroite", true);
    player.setFlip(true, false);
  } else if (cursor.right.isDown) {
    player.setVelocityX(200);
    player.anims.play("playerRunDroite", true);
    player.setFlip(false, false);
  } else if (cursor.up.isDown) {
    player.setVelocityY(-300);
  } else if (cursor.down.isDown) {
    player.setVelocityY(-300);
  }

  if (cursor.left.isUp && cursor.right.isUp) {
    player.setVelocityX(0);
  }
}



const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("game-container");

startBtn.addEventListener("click", () => {
  const canvas = document.querySelector("canvas");
  canvas.style.display = "block";
  gameContainer.style.display = "none";
});

function randomNumber(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}


function collectCoin(player, coin) {
  coin.disableBody(true, true);


  score += 1;
  scoreDisplay.setText("Score: " + score);


  if (score < 3) {
    const newX = randomNumber(100, config.width - 100);
    const newY = randomNumber(100, config.height - 200);
    coin.enableBody(true, newX, newY, true, true);
  } else {
  
    winGame.call(this); 
  }

  console.log("Coin ramassée !");
}

function winGame() {
  
  winDisplay.style.display = "block";

  
  player.setVelocity(0);
  player.body.moves = false;

  
  cursor.left.reset();
  cursor.right.reset();
  cursor.up.reset();
  cursor.down.reset();

  
  this.physics.pause();

  // 
  player.setTint(0x00ff00);

  console.log("Victoire !");
}
