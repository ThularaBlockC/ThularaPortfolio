const canvas = document.querySelector("#canvas canvas");
const c = canvas.getContext("2d");

window.addEventListener("resize", resizeCanvas, false);
const transformHeight = screen.height;

function resizeCanvas() {
  if (transformHeight <= 844) {
    canvas.width = window.innerWidth;
    canvas.height = screen.height * 10;
    if (transformHeight <= 1024) {
      canvas.width = window.innerWidth;
      canvas.height = screen.height * 6;
    }
  } else {
    canvas.width = window.innerWidth;
    canvas.height = screen.height * 2;
  }
}
resizeCanvas();

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

const floorCollision2D = [];
for (let i = 0; i < floorC.length; i += 256) {
  floorCollision2D.push(floorC.slice(i, i + 256));
}

const collisionBoxs = [];
floorCollision2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 3390) {
      collisionBoxs.push(
        new CollisionBox({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const platformCollision2D = [];
for (let i = 0; i < platformC.length; i += 256) {
  platformCollision2D.push(platformC.slice(i, i + 256));
}

const platformCollisionBoxs = [];
platformCollision2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 3390) {
      platformCollisionBoxs.push(
        new CollisionBox({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

const gravity = 0.1;

const player = new Player({
  position: {
    y: 1350,
    x: 0,
  },
  collisionBoxs,
  platformCollisionBoxs,
  imageSrc: "./images/Sprites/Idle.png",
  frameRate: 8,
  animation: {
    Idle: {
      imageSrc: "./images/Sprites/Idle.png",
      frameRate: 8,
      frameBuffer: 9,
    },
    Run: {
      imageSrc: "./images/Sprites/Run.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    Jump: {
      imageSrc: "./images/Sprites/Jump.png",
      frameRate: 2,
      frameBuffer: 19,
    },
    Fall: {
      imageSrc: "./images/Sprites/Fall.png",
      frameRate: 2,
      frameBuffer: 19,
    },
    BackRun: {
      imageSrc: "./images/Sprites/BackRun.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    FallLeft: {
      imageSrc: "./images/Sprites/fallLeft.png",
      frameRate: 2,
      frameBuffer: 19,
    },
    JumpLeft: {
      imageSrc: "./images/Sprites/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 19,
    },
  },
});

const keys = {
  d: {
    pressed: false,
  },
  D: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  A: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/backgroundThulara.png",
});

const backgroundImgHeight = 1728;

const camera = {
  position: {
    x: 0,
    y: -backgroundImgHeight + scaledCanvas.height,
  },
};

var buttonMove = false;
function moveright() {
  buttonMove = true;
  player.velocity.x += 2;
  player.swapSprite("Run");
  player.lastDirection = "right";
  player.desideLeftPanCamera({ canvas, camera });
}
function moveleft() {
    buttonMove = true;
    player.swapSprite("BackRun");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.desideRightPanCamera({ canvas, camera });
}


function clearmove() {
  buttonMove = false;
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.swapSprite("Idle");
}

function jump() {
  buttonMove = true;
  player.velocity.y = -4;
  if (player.velocity.y < 0) {
    player.decideCameraDown({ canvas, camera });
    player.swapSprite("Jump");
  } else if (player.velocity.y > 0) {
    player.decideCameraUp({ camera, canvas });
    if (player.lastDirection === "right") player.swapSprite("Fall");
    else player.swapSprite("FallLeft");
  }
}


function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "#000000";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.save();
  c.scale(1, 1);
  c.translate(camera.position.x, camera.position.y + 435);

  background.update();
  player.update();
  player.velocity.x = 0;
  
  if (keys.ArrowRight.pressed || keys.d.pressed) {
    player.swapSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.desideLeftPanCamera({ canvas, camera });
  } else if (keys.ArrowRight.pressed || keys.D.pressed) {
    player.swapSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.desideLeftPanCamera({ canvas, camera });
  } else if (keys.ArrowLeft.pressed || keys.a.pressed) {
    player.swapSprite("BackRun");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.desideRightPanCamera({ canvas, camera });
  } else if (keys.ArrowLeft.pressed || keys.A.pressed) {
    player.swapSprite("BackRun");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.desideRightPanCamera({ canvas, camera });
  } else if (player.velocity.y === 0) {
    player.swapSprite("Idle");
  }

  if (player.velocity.y < 0) {
    player.decideCameraDown({ canvas, camera });
    if (player.lastDirection === "right") player.swapSprite("Jump");
    else player.swapSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.decideCameraUp({ camera, canvas });
    if (player.lastDirection === "right") player.swapSprite("Fall");
    else player.swapSprite("FallLeft");
  }

  c.restore();
}
animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;

    case "D":
      keys.D.pressed = true;
      break;
    case "A":
      keys.A.pressed = true;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "w":
      player.velocity.y = -4;
      break;
    case "W":
      player.velocity.y = -4;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      player.velocity.y = -4;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "D":
      keys.D.pressed = false;
      break;
    case "A":
      keys.A.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
