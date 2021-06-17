var invisible_ground, ground, groundimg; // grounds

var mario; // mario sprite
var rr, rl, sr, sl, jr, jl; // mario moving animations

var monster; // monster sprite
var monster_moving, monsterSmashed; // monster animations

var fireball, fireball_shooting; // fireball
var background;

var obstacle, obstacleimg; //obstacles

var cloud, scloud; // cloud sprites
var cloud1, cloud2, cloud3, cloud4, cloud5; // cloud images
var scloud1, scloud2, scloud3, scloud4, scloud5, scloud6; // second group of cloud images

var monsters, clouds, platforms, fireballs, obstacles; // groups

var gamestate = "start"; // gamestate

var backimg
var s = 1;
var distance = 0;
var score = 0

function preload() {

  // ground image
  groundimg = loadImage("ground.png");
  
  // mario moving
  rr = loadAnimation("r1.png", "r2.png", "r3.png", "r4.png", "r5.png", "r6.png", "r7.png", "r8.png");
  rl = loadAnimation("l1.png", "l2.png", "l3.png", "l4.png", "l5.png", "l6.png", "l7.png", "l8.png");
  sr = loadAnimation("rStop.png");
  sl = loadAnimation("lStop.png");
  jr = loadAnimation("rJump.png");
  jl = loadAnimation("lJump.png");

  // cloud images
  cloud1 = loadImage("cloud1.png");
  cloud2 = loadImage("cloud2.png");
  cloud3 = loadImage("cloud3.png");
  cloud4 = loadImage("cloud4.png");
  cloud5 = loadImage("cloud5.png");
  scloud1 = loadImage("scloud1.png");
  scloud2 = loadImage("scloud2.png");
  scloud3 = loadImage("scloud3.png");
  scloud4 = loadImage("scloud4.png");
  scloud5 = loadImage("scloud5.png");
  scloud6 = loadImage("scloud6.png");
  back = loadImage("download.jpg");
  obstacleimg = loadImage("stone.png");

  // monster animations
  monster_moving = loadAnimation("monster1.png", "monster2.png", "monster3.png", "monster4.png", "monster5.png", "monster6.png", "monster7.png", "monster8.png");
  monsterSmashed = loadAnimation("monsterSmashed.png");

  // fireball
  fireball_shooting = loadAnimation("fireball1.png", "fireball2.png", "fireball3.png", "fireball4.png");

   // sounds
  bgm = loadSound("bgm.mp3");
  jumps = loadSound("jump.wav");
  stomp = loadSound("stomp.wav");
  checkPoint = loadSound("smb_1-up.wav");

    
}



function setup() {

  var canvas = createCanvas(displayWidth, displayHeight);

  invisible_ground = createSprite(350, 510, 1400, 1);
  invisible_ground.visible=false;

  ground = createSprite(350, 550, 1700, 300);
  ground.addImage("ground", groundimg);
  ground.x = ground.width / 2;

  mario = createSprite(200, 480, 60, 60);
  mario.addAnimation("stopr", sr);
  mario.addAnimation("runr", rr);
  mario.addAnimation("runl", rl);
  mario.addAnimation("stopl", sl);
  mario.addAnimation("jumpr", jr);
  mario.addAnimation("jumpl", jl);
  
  backimg=createSprite(500,400,1000,1000);
  backimg.addImage(back)

  clouds = new Group();
  monsters = new Group();
  platforms = new Group();
  fireballs = new Group();
  
  
}



function draw() {
 background("lightblue");

if (gamestate=="start") {
  textSize(20);
  textFont("Arial");
  text("Controls",100,100);
  text("* Move forward = right arrow key *",100,200);
  text("* Move backward = left arrow key *",100,250);
  text("* Jump = up arrow key *",100,300);
  text("* Shoot fireball = $ *",100,350);
  text("To Continue press space",100,450);
  mario.visible=false;
  ground.visible=false;
  backimg.visible=false;

 }  
if (keyDown("space")&&gamestate=="start") {
  gamestate="play"
} 

if (gamestate=="play") { 
  
 
  mario.visible=true;
  ground.visible=true;
  backimg.visible=false;
  if (keyDown("RIGHT_ARROW") && World.frameCount % 5 === 0) {
    distance = distance + 1;
  }

  if (keyDown("LEFT_ARROW") && distance >= 1 && World.frameCount % 5 === 0) {
    distance = distance - 1;
  }

  if (keyDown("RIGHT_ARROW")) {
    s=1
  }

  if (keyDown("LEFT_ARROW")) {
    s=2
  }

 if (monsters.isTouching(mario)) {
   gamestate="end";
 }

  run();
  jump();
  groundReset();
  spawnclouds();
  spawnSclouds();
  Monster();
  shoot();

  stroke("red")
  textSize(20)
  textFont("Harlow Solid Italic")
  fill("red")  
  text("SCORE:"+score,500,100)

  }
  
 if (gamestate=="end") {
   backimg.visible=true
   mario.visible=false;
   ground.visible=false;
   monsters.destroyEach()
   clouds.destroyEach()
 }
  if (mousePressedOver(backimg)) {
    reset();
    }

    mario.collide(invisible_ground);  
  drawSprites();

}



function run() {
  
  if (keyWentDown("RIGHT_ARROW")) {
    platforms.setVelocityXEach(-7);
    monsters.setVelocityXEach(-10);
    ground.velocityX = -7;
    mario.changeAnimation("runr");
  }

  if (keyWentDown("LEFT_ARROW")) {
    platforms.setVelocityXEach(7);
    monsters.setVelocityXEach(4);
    ground.velocityX = 7;
    mario.changeAnimation("runl");
  }

  if (keyWentUp("RIGHT_ARROW")) {
    platforms.setVelocityXEach(0);
    ground.velocityX = 0;
    mario.changeAnimation("stopr");
    monsters.setVelocityXEach(-3);
  }

  if (keyWentUp("LEFT_ARROW")) {
    platforms.setVelocityXEach(0);
    ground.velocityX = 0;
    mario.changeAnimation("stopl");
    monsters.setVelocityXEach(-3);
  }

  if (mario.x < 200 || mario.x > 200) {
    mario.x = 200;
  }
  
  if (ground.velocityX === 0) {
    platforms.setVelocityXEach(0);
  }
    
}



function jump() {
 
  if (mario.y > 461 && keyWentDown("UP_ARROW") && s === 1) {
    mario.velocityY = -25;
    jumps.play();
    mario.changeAnimation("jumpr");
  }

  if (mario.y > 461 && keyWentDown("UP_ARROW") && s === 2) {
    mario.velocityY = -25;
    mario.changeAnimation("jumpl");
    jumps.play();
  }
  
  mario.velocityY = mario.velocityY + 2;

  if (mario.y > 467 && s === 1) {
    mario.changeAnimation("stopr");
    if (keyDown("RIGHT_ARROW")) {
      mario.changeAnimation("runr");
    }
  }

  if (mario.y > 467 && s === 2) {
    mario.changeAnimation("stopl");
    if (keyDown("LEFT_ARROW")) {
      mario.changeAnimation("runl");
    }
  }

}



function groundReset() {
  
  if (ground.x < 350) {
    ground.x = 500;
  }

  if (ground.x > 650) {
    ground.x = 500;
  }

}



function spawnSclouds() {

  if (frameCount % 100 === 0 || frameCount === 10) {
    var scloud = createSprite(950, 185, 10, 40);
    scloud.y = Math.round(random(120, 200));

    scloud.depth = mario.depth - 3;
    mario.depth = mario.depth + 3;
    console.log("mscolud" + mario.depth);
    scloud.velocityX = -(4 + 3* score/10);
    var randomn = Math.round(random(1, 6));
    switch (randomn) {
      case 1: scloud.addImage(scloud1);
        break;
      case 2: scloud.addImage(scloud2);
        break;
      case 3: scloud.addImage(scloud3);
        break;
      case 4: scloud.addImage(scloud4);
        break;
      case 5: scloud.addImage(scloud5);
        break;
      case 6: scloud.addImage(scloud6);
        break;

      default: break;
      
      }

    scloud.scale = 1.5;
    scloud.lifetime = 2000;

    clouds.add(scloud);
  
  }

}



function spawnclouds() {
 
  if (frameCount % 200 === 0 || frameCount === 30) {

    var cloud = createSprite(950, 165, 10, 40);
    var randomy = Math.round(random(40, 100));
    cloud.y = randomy;
    cloud.velocityX = -(4 + 3* score/10);
    cloud.depth = mario.depth - 3;
    mario.depth = mario.depth + 3;
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1: cloud.addImage(cloud1);
        break;
      case 2: cloud.addImage(cloud2);
        break;
      case 3: cloud.addImage(cloud3);
        break;
      case 4: cloud.addImage(cloud4);
        break;

      default: break;

    }

    cloud.scale = 3;
    cloud.lifetime = 2000;

    clouds.add(cloud);

  }

}



function Monster() {
  
  var monsterNo = Math.round(random(1));
  
  if (frameCount % 100 === 0) {
    
    for (var z = 0; z <= monsterNo; z++) {
      monster = createSprite(900 + (50 * z), 490, 10, 10);
      monster.addAnimation("monsterMoving", monster_moving);
      monster.addAnimation("monsterSmashed", monsterSmashed);
      monster.setLifetime = 300;
      monster.velocityX = -(2+score/10);
      monster.scale = 0.11;
      monsters.add(monster);
    }

  }
  if (fireballs.isTouching(monsters)) {
    monsters.destroyEach();
    fireballs.destroyEach();
    score=score+2
  }
  
  monsters.collide(invisible_ground);

}



function shoot() {
    
  if (keyDown("s") && frameCount % 15 === 0) {

    fireball = createSprite(mario.x, mario.y, 5, 5);
    fireball.lifetime = 100;
    fireball.addAnimation("fireball", fireball_shooting);
    fireball.scale = 0.3;

    if (s === 1) {
      fireball.velocityX = 7;
    }

    if (s === 2) {
      fireball.velocityX = -7;
    }
  fireballs.add(fireball);   
  }

}



function reset(){
  gamestate="play"
}



function spawnobstacles(){

  if (frameCount % 60 === 0) {
    obstacle = createSprite(800, 490, 10, 10)
    
  }

}


