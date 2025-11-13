const config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 800,
  background: "#000",

  scene: { preload, create, update },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1500 },
      debug: false,
    },
  },
};

let speed = 300;
let player;
let score = 0;
let scoreDisplay;
let hearts = [];
let apple;

const game = new Phaser.Game(config);

function preload() {
  this.load.image("appleTree", "/assets/images/apple-tree.webp");
  this.load.image("apple", "/assets/images/apple.png");
  this.load.image("bag", "/assets/images/bag.png");
  this.load.image("heart", "/assets/images/heart.webp");
}

function create() {
  cursor = this.input.keyboard.createCursorKeys();

  const background = this.add.sprite(0, 0, "appleTree");
  background.setPosition(config.width / 2, config.height / 2);
  background.setScale(1.39);

  player = this.physics.add.sprite(200, config.height - 100, "bag");
  player.setScale(0.7);
  player.setCollideWorldBounds(true);
  player.body.setSize(250, 200);

  // Création de la pomme
  apple = this.physics.add.sprite(
    randomNumber(100, config.width - 100),
    0,
    "apple"
  );
  apple.setScale(0.15);
  apple.setVelocityY(Phaser.Math.Between(150, 300)); // la pomme tombe
  apple.setCollideWorldBounds(false);

  this.physics.add.overlap(player, apple, appleCatch, null, this);

  // Score
  scoreDisplay = this.add.text(config.width - 200, 50, "Score: 0", {
    fontFamily: "monospace",
    color: "black",
    fontSize: "30px",
  });

  // Cœurs
  const heart0 = this.add.sprite(60, 50, "heart").setScale(0.06);
  const heart1 = this.add.sprite(130, 50, "heart").setScale(0.06);
  const heart2 = this.add.sprite(200, 50, "heart").setScale(0.06);
  hearts = [heart2, heart1, heart0]; // ordre de disparition
}

function update() {
  // Déplacement du joueur
  if (cursor.right.isDown) {
    player.setVelocityX(speed);
  } else if (cursor.left.isDown) {
    player.setVelocityX(-speed);
  } else {
    player.setVelocityX(0);
  }


  if (apple.y > config.height) {
    appleMissed();
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function appleCatch(player, apple) {
  apple.disableBody(true, true);

  score++;
  scoreDisplay.setText("Score: " + score);


  apple.enableBody(true, randomNumber(100, config.width - 100), 0, true, true);
  apple.setVelocityY(Phaser.Math.Between(150, 300));
}


function appleMissed() {
  apple.disableBody(true, true);
  removeHeart();

  
  apple.enableBody(true, randomNumber(100, config.width - 100), 0, true, true);
  apple.setVelocityY(Phaser.Math.Between(150, 300));
}


function removeHeart() {
  if (hearts.length > 0) {
    const lostHeart = hearts.pop();
    lostHeart.setVisible(false);
  } else {
    
    const gameOverDiv = document.getElementById("game-over");
    gameOverDiv.style.display = "flex"; 

    
    game.scene.scenes[0].scene.pause();

    
    const restartBtn = document.getElementById("restartBtn");
    restartBtn.onclick = () => {
      gameOverDiv.style.display = "none";
      game.scene.scenes[0].scene.restart();
      hearts = [
        heart2.setVisible(true),
        heart1.setVisible(true),
        heart0.setVisible(true),
      ];
      score = 0;
      scoreDisplay.setText("Score: 0");
    };
  }
}