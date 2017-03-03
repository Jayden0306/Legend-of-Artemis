function arrowObj(game, skeleton, spritesheet, x, y, marker) {
    this.animation = new Animation(spritesheet, 64, 64, 1, 0.10, 1, true, 1);

    this.x = x + 15;
    this.y = y - 6.5;
    this.xAdjust = 8;
    this.yAdjust = 41;
    this.boundingRect = new BoundingRect(this.x + this.xAdjust, this.y + this.yAdjust, 35, 5, game);
    this.skeleton = skeleton;
    this.radius = 10;
    this.collide = false;
    this.marker = marker;
    this.needToRemove = true;
    this.speed = 430;
    this.row = 19;
    this.game = game;
    this.ctx = game.ctx;
    this.frame = 4;
    this.flying = true;
    this.flyingRight = false;
    this.flyingLeft = false;

    if (this.skeleton.rightFaceing) {
      this.flyingRight = true;
    } else {
      this.flyingLeft = true;
    }

    this.camera = game.camera;
    this.step = game.STEP;
}

arrowObj.prototype.draw = function () {
    if(!this.needToRemove) {
      this.game.removeTheUnit(this.marker);
    }else {
      if (this.flying) {
        if (this.flyingLeft) {
            this.animation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y-this.camera.yView, 17, 3);
        } else { // right faceing
            this.animation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 19, 3);
        }
      }
    }


}

arrowObj.prototype.update = function () {

    if (this.flyingRight) {
      this.x += this.game.clockTick * this.speed;
    } else {
      this.x -= this.game.clockTick * this.speed;
    }

    // flies off screen left side
    if(this.x + this.boundingRect.width < 0 && this.needToRemove) {
        this.needToRemove = false;
    }

    // flies off screen right side
    if(this.x > this.game.worldWidth && this.needToRemove) {
        this.needToRemove = false;
    }

    if (this.flyingLeft) {
      this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

    } else {
      this.boundingRect.updateLoc(this.x + this.xAdjust * 2.5, this.y + this.yAdjust);
    }
}


function artermisArrow(game, artermis, spritesheet, x, y, marker) {
    this.animation = new Animation(spritesheet, 64, 64, 1, 0.10, 1, true, 1);

    this.x = x + 15;
    this.y = y - 6.5;
    this.xAdjust = 8;
    this.yAdjust = 41;
    this.boundingRect = new BoundingRect(this.x + this.xAdjust, this.y + this.yAdjust, 35, 5, game);
    this.artermis = artermis;
    this.radius = 10;
    this.collide = false;
    this.marker = marker;
    this.needToRemove = true;
    this.speed = 430;
    this.row = 19;
    this.game = game;
    this.ctx = game.ctx;
    this.frame = 4;
    this.flying = true;
    this.flyingRight = false;
    this.flyingLeft = false;

    if (this.artermis.currDirection == 11) {
      this.flyingRight = true;
    } else {
      this.flyingLeft = true;
    }

    this.camera = game.camera;
    this.step = game.STEP;
}

artermisArrow.prototype.draw = function () {
    if(!this.needToRemove) {
      console.log("artemis arrow");
      this.game.removeTheUnit(this.marker);
    }else {
      if (this.flying) {
        if (this.flyingLeft) {
            this.animation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y-this.camera.yView, 17, 3);
        } else { // right faceing
            this.animation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 19, 3);
        }
      }
    }


}

artermisArrow.prototype.update = function () {

    if (this.flyingRight) {
      this.x += this.game.clockTick * this.speed;
    } else {
      this.x -= this.game.clockTick * this.speed;
    }

    // flies off screen left side
    if(this.x + this.boundingRect.width < 0 && this.needToRemove) {
        this.needToRemove = false;
    }

    // flies off screen right side
    if(this.x > this.game.worldWidth && this.needToRemove) {
        this.needToRemove = false;
    }

    if (this.flyingLeft) {
      this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

    } else {
      this.boundingRect.updateLoc(this.x + this.xAdjust * 2.5, this.y + this.yAdjust);
    }
}
