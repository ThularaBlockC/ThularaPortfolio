class Player extends Sprite {
  constructor({
    position,
    collisionBoxs,
    platformCollisionBoxs,
    imageSrc,
    frameRate,
    scale = 1,
    animation,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    // Player size decided by: scale = 1
    this.collisionBoxs = collisionBoxs;
    this.platformCollisionBoxs = platformCollisionBoxs;

    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 15,
    };
    this.animation = animation;
    this.lastDirection = "right";

    for (let key in this.animation) {
      const image = new Image();
      image.src = this.animation[key].imageSrc;

      this.animation[key].image = image;
    }
    this.cameraBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 200,
    };
  }

  swapSprite(key) {
    if (this.image === this.animation[key].image || !this.loaded) return;
    this.currentFrame = 0;
    this.image = this.animation[key].image;
    this.frameBuffer = this.animation[key].frameBuffer;
    this.frameRate = this.animation[key].frameRate;
  }

  updateCameraBox() {
    this.cameraBox = {
      position: {
        x: this.position.x - 55,
        y: this.position.y,
      },
      width: 200,
      height: 200,
    };
  }

  // checkForHorizontalCanvasCollision() {
  //   if (
  //     this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 3328 ||
  //     this.hitbox.position.x + this.velocity.x <= 0

  //   ) {
  //     this.velocity.x = 0
  //     console.log("hitboxxxxxxx : "+this.velocity.x)
  //   }
  // }
  desideLeftPanCamera({ canvas, camera }) {
    const transformHeight = screen.height;
    const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
    const transformCanvasWidth = canvas.width / 4;

    if (transformHeight <= 844) {
      if (cameraBoxRight >= 3328) return;
      if (
        cameraBoxRight >=
        transformCanvasWidth + Math.abs(camera.position.x)
      ) {
        camera.position.x -= this.velocity.x;
      }
    } else if (transformHeight == 1024) {
      console.log("transform : " + transformHeight);
      if (cameraBoxRight >= 3328) return;
      if (
        cameraBoxRight >=
        transformCanvasWidth + Math.abs(camera.position.x)
      ) {
        camera.position.x -= this.velocity.x;
      }
    } else if (transformHeight >= 1120) {
      if (cameraBoxRight >= 2770) return;
      if (
        cameraBoxRight >=
        transformCanvasWidth + Math.abs(camera.position.x)
      ) {
        camera.position.x -= this.velocity.x;
      }
    } else {
      if (cameraBoxRight >= 3328) return;
      if (
        cameraBoxRight >=
        transformCanvasWidth + Math.abs(camera.position.x)
      ) {
        camera.position.x -= this.velocity.x;
      }
    }
  }

  //   if (transformHeight <= 844) {

  //     if (cameraBoxRight >= 3328) return;
  //     if (
  //       cameraBoxRight >=
  //       transformCanvasWidth + Math.abs(camera.position.x)
  //     ) {
  //       camera.position.x -= this.velocity.x;
  //     }
  //   }

  //   else if (transformHeight <= 1024 || transformHeight >= 1025) {
  //     console.log("transform : "+transformHeight)
  //     if (cameraBoxRight >= 3328) return;
  //     if (
  //       cameraBoxRight >=
  //       transformCanvasWidth + Math.abs(camera.position.x)
  //     ) {
  //       camera.position.x -= this.velocity.x;
  //     }
  //   }

  //   else if (transformHeight >= 1120) {

  //     if (cameraBoxRight >= 2770) return;
  //     if (
  //       cameraBoxRight >=
  //       transformCanvasWidth + Math.abs(camera.position.x)
  //     ) {
  //       camera.position.x -= this.velocity.x;
  //     }
  //   }
  //   else{
  //     if (cameraBoxRight >= 3328) return;
  //     if (
  //       cameraBoxRight >=
  //       transformCanvasWidth + Math.abs(camera.position.x)
  //     ) {
  //       camera.position.x -= this.velocity.x;
  //     }
  //   }
  // }

  desideRightPanCamera({ canvas, camera }) {
    if (this.cameraBox.position.x <= 0) return;
    if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  decideCameraDown({ canvas, camera }) {
    if (this.cameraBox.position.y + this.velocity.y <= 0) return;

    if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  decideCameraUp({ canvas, camera }) {
    const scaledCanvasHeight = canvas.height / 4;
    if (
      this.cameraBox.position.y + this.cameraBox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitBox();
    this.updateCameraBox();

    //Draw Camera area/box
    // c.fillStyle = "blue";
    // c.fillRect(
    //   this.cameraBox.position.x,
    //   this.cameraBox.position.y,
    //   this.cameraBox.width,
    //   this.cameraBox.height
    // );

    this.draw();

    this.position.x += this.velocity.x;
    this.updateHitBox();
    this.checkHorizontalC();
    this.applyGravity();
    this.updateHitBox();
    this.checkVerticalC();
  }

  updateHitBox() {
    this.hitbox = {
      position: {
        x: this.position.x + 70,
        y: this.position.y + 50,
      },
      width: 30,
      height: 48,
    };
  }

  checkHorizontalC() {
    for (let i = 0; i < this.collisionBoxs.length; i++) {
      const collisionBox = this.collisionBoxs[i];

      if (
        collision({
          objectRepresentator: this.hitbox,
          objectCollisionBox: collisionBox,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBox.position.x - offset - 0.01;
          //-100
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;

          this.position.x =
            collisionBox.position.x + collisionBox.width - offset + 0.01;
          //+100
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkVerticalC() {
    for (let i = 0; i < this.collisionBoxs.length; i++) {
      const collisionBox = this.collisionBoxs[i];

      if (
        collision({
          objectRepresentator: this.hitbox,
          objectCollisionBox: collisionBox,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          // position the hitbox and sprite on top of collisionbox
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBox.position.y - offset - 0.01;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          // position the hitbox and sprite on top of collisionbox
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.width;
          // + this.hitbox.width wasint there
          this.position.y =
            collisionBox.position.y + collisionBox.height - offset + 0.01;
        }
      }
    }
    // For the Platform Collisions
    for (let i = 0; i < this.platformCollisionBoxs.length; i++) {
      const platformCollisionBox = this.platformCollisionBoxs[i];

      if (
        platformCollision({
          objectRepresentator: this.hitbox,
          objectCollisionBox: platformCollisionBox,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          // position the hitbox and sprite on top of platformCollisionBox
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformCollisionBox.position.y - offset - 0.01;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          // position the hitbox and sprite on top of platformCollisionBox
          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            platformCollisionBox.position.y +
            platformCollisionBox.height -
            offset +
            0.01;
        }
      }
    }
  }
}
