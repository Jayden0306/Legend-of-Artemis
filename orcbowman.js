var GRAVITY = 20;
var DEATH = 2500;
var WALKINGOFFPLATFORM = 0;

function OrcBowman(game, spritesheet) {
  this.walkAnimation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1);
  this.magicAnimation = new Animation(spritesheet, 64, 64, 6.5, 0.1, 6.5, false, 1);
  this.shootRightAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.1, 12.5, false, 1);
  this.shootLeftAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.1, 12.5, false, 1);
  this.upAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1);
  this.jumpAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1);
  this.jumpAnimation = new Animation(spritesheet, 64, 64, 8, 0.1, 8, false, 1);

  this.xAdjust = 21;
  this.yAdjust = 13;
  this.boundingRect = new BoundingRect(20 + this.xAdjust, 2067 + this.yAdjust, 22, 46, game);
  this.previousLoc = new BoundingRect(20 + this.xAdjust, 2067 + this.yAdjust, 22, 46, game);

  this.spritesheet = spritesheet;
  this.x = 20;
  this.y = 2067-this.yAdjust - this.boundingRect.height;
  this.ground = this.y;
  this.speed = 350;
  this.ctx = game.ctx;
  this.game = game;
  this.currDirection = 11;
  this.animating = false;
  this.jumping = false;
  this.falling = false;
  this.newPlatform = false;
  this.currentPlatform = null;

  //////////////////////////
  this.width = 64;
  this.height = 64;
  this.step = game.STEP;
  this.camera = game.camera;
}

OrcBowman.prototype.draw = function () {
  // this.boundingRect.drawRect();

  if (this.jumping) {
    this.jump();
  }
  if (this.falling && !this.jumping) {
    this.fall();
  }

  if(this.right && this.lastPressed === "right") {
    if (!this.jumping){
      this.walkAnimation.drawFrame(this.game.clockTick,
      this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView,
            11, true);
    }


    this.right = false;
    this.animating = false;
  } else if(this.left && this.lastPressed === "left" ) {
    if (!this.jumping){
      this.walkAnimation.drawFrame(this.game.clockTick,
          this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView
          , 9, true);

    }

    this.left = false;
    this.animating = false;
  } else if(this.down && this.lastPressed === "down") {
      this.magicAnimation.drawFrame(this.game.clockTick,
      this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         2, true);
  } else if(this.melee && this.lastPressed === "melee") {
    if(this.currDirection === 11) {
      this.shootRightAnimation.drawFrame(this.game.clockTick,
      this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         19, true);
    } else {
      this.shootRightAnimation.drawFrame(this.game.clockTick, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         17, true);
    }
  } else if(!this.animating){
    if(this.lastPressed === "right" || this.lastPressed === "melee") {
      this.walkAnimation.drawFrame(0, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         this.currDirection, false);
    } else if(this.lastPressed === "left" || this.lastPressed === "melee"){
      this.walkAnimation.drawFrame(0,
      this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         this.currDirection, false);
    } else if(this.lastPressed === "down") {
       this.magicAnimation.drawSpecificFrame(this.ctx,
         this.x - this.camera.xView,
         this.y - this.camera.yView,
         2, 0);
    } else if(this.lastPressed === "melee" && this.currDirection === "right") {
       this.shootRightAnimation.drawSpecificFrame(this.ctx,
         this.x - this.camera.xView,
         this.y - this.camera.yView,
          19, 13);
    } else if(this.lastPressed === "up") {
      this.upAnimation.drawSpecificFrame(this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView, 0, 0);
    }
    else {
      this.walkAnimation.drawFrame(0, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         this.currDirection, false);
    }
  }
}

OrcBowman.prototype.update = function () {

  if (this.game.chars["Space"]) {
    if (!this.falling)
      this.jumping = true;
  }

  if(this.game.chars["ArrowRight"] || this.game.chars["KeyD"]) {
    this.right = true;
    this.currDirection = 11;
    this.lastPressed = "right";
    this.animating = true;
    this.x += this.game.clockTick * this.speed;
  } else if(this.game.chars["ArrowLeft"] || this.game.chars["KeyA"]) {
    this.left = true;
    this.currDirection = 9;
    this.lastPressed = "left";
    this.animating = true;
    this.x -= this.game.clockTick * this.speed;
  } else if(this.game.chars["KeyS"] || this.game.chars["ArrowDown"]) {
    this.lastPressed = "down";
    this.down = true;
    this.animating = true;
  } else if(this.game.chars["KeyZ"] || this.game.chars["KeyJ"]) {
    this.lastPressed = "melee";
    this.melee = true;
    this.animating = true;
  } else if(this.game.chars["ArrowUp"] || this.game.chars["KeyW"]) {
    this.up = true;
    this.lastPressed = "up";
    this.animating = false;
  }

  if (this.magicAnimation.isDone()) {
      this.magicAnimation.elapsedTime = 0;
      this.down = false;
      this.animating = false;
  }
  if (this.shootRightAnimation.isDone()) {
      this.shootRightAnimation.elapsedTime = 0;
      this.melee = false;
      this.animating = false;
  }
  if (this.shootLeftAnimation.isDone()) {
      this.shootLeftAnimation.elapsedTime = 0;
      this.melee = false;
      this.animating = false;
  }

  this.previousLoc.updateLoc(this.boundingRect.x, this.boundingRect.y);
  this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

  this.checkPlatformCollisions();

      // check left boundary
      if(this.x + this.xAdjust < 0) {
        // console.log("before boundary x : " + this.x);
        this.x = 0 - this.xAdjust;
        // console.log("boundary x : " + this.x);
    }
    // //check top boundary
    // if(this.y - this.height/2 < 0) {
    //     this.y = this.height/2;
    //     // console.log("top boundary y : " + this.y);
    // }

    //check right boundary
    if(this.x + this.width - this.xAdjust >  this.game.worldWidth) {
        this.x = this.game.worldWidth - this.width + this.xAdjust;
        // console.log("char boundary x : " + this.x);
    }


}

OrcBowman.prototype.collide = function(other) {
  return this.boundingRect.left < other.right // left side collision
  && this.boundingRect.right  > other.left // right side collision
  && this.boundingRect.bottom > other.top //
  && this.boundingRect.top < other.bottom;
}

OrcBowman.prototype.collideLeft = function(platform) {
  return this.boundingRect.left < this.previousLoc.left
  && this.boundingRect.right > platform.right;
}

OrcBowman.prototype.collideRight = function(platform) {
  return this.boundingRect.right > this.previousLoc.right
  && this.boundingRect.left < platform.left;
}

OrcBowman.prototype.collideTop = function(platform) {
  return this.boundingRect.top > this.previousLoc.top
  && platform.top > this.previousLoc.bottom;
}

OrcBowman.prototype.collideBottom = function(platform) {
  return this.boundingRect.bottom < this.previousLoc.bottom
  && this.previousLoc.left < platform.right
  && this.previousLoc.right > platform.left;
}

OrcBowman.prototype.checkPlatformCollisions = function () {

  for (var i = 0; i < this.game.platforms.length; i ++) {
    var platform = this.game.platforms[i];

    if (this.collide(platform)) {

      if(this.collideBottom(platform) ) {
        this.y = platform.bottom - this.yAdjust;
        this.falling = true;
        this.jumping = false;
      }
      else if (this.collideTop(platform)) {
        this.newPlatform = true;
        this.currentPlatform = platform;
      }
      else if (this.collideLeft(platform)) {
        this.x = platform.right - this.xAdjust;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      }
      else if (this.collideRight(platform)) {
        this.x = platform.left - this.xAdjust - this.boundingRect.width;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      }
    }

    if (this.boundingRect.left > this.currentPlatform.right
        || this.boundingRect.right < this.currentPlatform.left) {
          this.currentPlatform.current = false;
          this.falling = true;
        }
    }
}

OrcBowman.prototype.jump = function() {

  this.jumpAnimation.elapsedTime += this.game.clockTick;

  if (this.right) {
    this.jumpAnimation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 11, 0);

  } else if (this.left) {
    this.jumpAnimation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 9, 0);
  }

  var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;

  var totalHeight = 200;

  if (jumpDistance > 0.5)
      jumpDistance = 1 - jumpDistance;

  var height = jumpDistance * 2 * totalHeight;
  var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));

  this.y = this.ground - height;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.current = true;
      this.falling = false;
    }

  } else if (this.falling) {
        var newGround = DEATH;

        if (this.y >= newGround) {
          this.ground = newGround;
          this.jumping = false;
          this.jumpAnimation.elapsedTime = 0;
          this.y = this.ground;
          this.newPlatform = false;
          this.falling = false;
        }

  }  else if (this.y >= this.ground) {
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.y = this.ground;
  }
}

OrcBowman.prototype.fall = function() {

  if (this.right) {
      this.jumpAnimation.drawSpecificFrame(this.ctx, this.cX, this.cY, 11, 0);
  } else if (this.left) {
        this.jumpAnimation.drawSpecificFrame(this.ctx, this.cX, this.cY, 9, 0);
  }

  if (WALKINGOFFPLATFORM === 0) {
    this.y = this.y-3;
    WALKINGOFFPLATFORM ++;
  } else {
    this.y += GRAVITY * this.jumpAnimation.elapsedTime;
  }

  this.jumpAnimation.elapsedTime += this.game.clockTick;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.current = true;
      this.falling = false;
      WALKINGOFFPLATFORM = 0;
    }
  } else {
    if (this.y >= DEATH) {
      this.jumpAnimation.elapsedTime = 0;
      this.y = DEATH;
      this.falling = false;
      this.jumping = false;
      WALKINGOFFPLATFORM = 0;
    }
  }
}
