const config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 800,
  background: "#000",

  scene: { preload, create, update },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 },
      debug: true,
    },
  },
};

let speed = 1000;
let player;
let score = 0;
let scoreDisplay;
let hearts = [];
let apple;
let enemy;
let enemies;
let comboCatch = 0;
let appleFallSpeed = { min: 250, max: 500 };

const game = new Phaser.Game(config);

function preload() {
  this.load.image("appleTree", "/assets/images/apple-tree.webp");
  this.load.image("apple", "/assets/images/apple.png");
  this.load.image("bag", "/assets/images/bag.png");
  this.load.image("heart", "/assets/images/heart.webp");
  this.load.image("purpleHeart", "/assets/images/purple_heart.png");
  this.load.image("gumGum", "/assets/images/gum-gum.png");
  this.load.image("enemy", "/assets/images/enemy.png");
}

function create() {
  cursor = this.input.keyboard.createCursorKeys();

  const background = this.add.sprite(0, 0, "appleTree");
  background.setPosition(config.width / 2, config.height / 2);
  background.setScale(1.39);

  player = this.physics.add.sprite(200, config.height - 100, "bag");
  player.setScale(0.7);
  player.setCollideWorldBounds(true);
  player.body.setSize(230, 100);
  player.body.setOffset(75, 120);

  // Création de la pomme
  apple = this.physics.add.sprite(
    randomNumber(100, config.width - 100),
    0,
    "apple"
  );
  apple.setScale(0.15);
  apple.setCollideWorldBounds(false);

  this.physics.add.overlap(player, apple, appleCatch, null, this);

  // Score
  scoreDisplay = this.add.text(config.width - 200, 50, "Score: 0", {
    fontFamily: "monospace",
    color: "black",
    fontSize: "30px",
  });

  // Heart

  const heart0 = this.add.sprite(60, 50, "heart").setScale(0.06);
  const heart1 = this.add.sprite(130, 50, "heart").setScale(0.06);
  const heart2 = this.add.sprite(200, 50, "heart").setScale(0.06);
  hearts = [heart0, heart1, heart2]; // ordre de disparition

  // enemy = this.physics.add.sprite(300, 0, "enemy").setScale(0.27);
  // enemy.setCollideWorldBounds(false);
  // enemy.body.setSize(290, 250);
  // enemy.setOffset(100, 20);

  enemies = this.physics.add.group();



  this.time.addEvent({
    delay: 3000, // 3000 ms = 3 secondes
    callback: spawnEnemy,
    callbackScope: this,
    loop: true, // répète indéfiniment
  });

    this.physics.add.overlap(player, enemies, enemyCatch, null, this);


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

  comboCatch++;

  if (comboCatch >= 7 && hearts.length > 1) {
    addHeart();
    comboCatch = 0;

    appleFallSpeed.min += 100;
    appleFallSpeed.max += 150;

    appleFallSpeed.max = Math.min(appleFallSpeed.max, 900);
  }

  if (score >= 30) {
    apple.setTexture("gumGum").setScale(0.2);
    apple.setVelocityY(1500);
  } else {
    apple.setTexture("apple");
    apple.setScale(0.15);
  }

  apple.enableBody(true, randomNumber(100, config.width - 100), 0, true, true);
  apple.setVelocityY(Phaser.Math.Between(150, 300));
}

function enemyCatch(player, enemy) {
  enemy.disableBody(true, true);

  score = score - 2;
  scoreDisplay.setText("Score: " + score);

  removeHeart();

}

function spawnEnemy() {
  const x = randomNumber(100, config.width - 100);
  const enemy = enemies.create(x, 0, "enemy"); // créer un nouvel ennemi dans le groupe
  enemy.setScale(0.27);
  enemy.setVelocityY(Phaser.Math.Between(200, 400));
  enemy.body.setSize(290, 250);
  enemy.setOffset(100, 20);
}

function appleMissed() {
  apple.disableBody(true, true);
  removeHeart();

  comboCatch = 0;

  apple.enableBody(true, randomNumber(100, config.width - 100), 0, true, true);
  apple.setVelocityY(
    Phaser.Math.Between(appleFallSpeed.min, appleFallSpeed.max)
  );
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
      score = 0;
      scoreDisplay.setText("Score: 0");
      hearts = [
        heart2.setVisible(true),
        heart1.setVisible(true),
        heart0.setVisible(true),
      ];

      appleFallSpeed = { min: 150, max: 300 };
      comboCatch = 0;
    };
  }
}

function addHeart() {
  if (hearts.length >= 5) {
    return; // max 5 cœurs → on ne fait rien
  }

  const scene = game.scene.scenes[0];

  const x = 60 + hearts.length * 70;
  const y = 50;

  const newHeart = scene.add.sprite(x, y, "purpleHeart").setScale(0.125);
  

  hearts.push(newHeart);
}
