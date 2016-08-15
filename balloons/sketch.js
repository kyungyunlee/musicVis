var song, amplitude;
var fft;

var beatHoldFrames=20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff=0;
var beatDecayRate=0.98;
var countFramesSinceLastBeat=0;

var shootBeat=false;

var bouncecircle=[];
var ballsize;
var rotateCameraY=0;
var ballcolor;

function preload() {
  song = loadSound('assets/colours.mp3');
}

function setup() {
  createCanvas(windowWidth,windowHeight,WEBGL);
  // background(20);
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  
  fft = new p5.FFT();
  fft.setInput(song);
  ballcolor=color(random(255),random(255),random(255));
  // bouncecircle.push(new BounceCircle(10,1,ballcolor));
  frameRate(20);
}


function draw() {
  background(20);
  ambientLight(200);
  pointLight(200,100,20);
  
  rotateY(radians(-90));
  camera(0,0,500);
  
  rotateY(radians(rotateCameraY));
  var timer = int(millis()/1000);
  println(timer);
  if(timer>0){
    if (timer%30==0){
      rotateCameraY -=3.5;
    }
    else if (timer%20==0){
      rotateCameraY +=1;
    }
    else if (timer%10==0){
      rotateCameraY +=1.3;
    }
  }

  var shootamp=amplitude.getLevel();
  var shootspeedmult=map(shootamp,0,0.8,1,15);
  ballsize=map(shootamp,0.1,0.8,10,120);
  ballcolor=color(random(100,200),random(100),random(50));
  
  detectBeat(shootamp);
  if (shootamp>0.1){
    bouncecircle.push(new BounceCircle(ballsize,shootspeedmult,ballcolor));
  }
  
  for(var i=0;i<bouncecircle.length;i++){
    push();
    bouncecircle[i].shoot();
    bouncecircle[i].update();
    bouncecircle[i].display();
    pop();
  }
  if(bouncecircle.length>400){
    bouncecircle.splice(0,30);
  }
  
}

function BounceCircle(ballsize,shootspeedmult,col){
  this.pos=createVector(0,-100,0);
  this.vel=createVector(0,0,0);
  this.acc=createVector(0,0,0);
  var shootangle=random(10,30);
  var gravity=5;
  var shootspeed=3;
  this.shootspeedmult=shootspeedmult;
  this.ballsize=ballsize;
  this.col=col;
  
  this.shoot=function(){//amplitude determines the power of shoot 
    this.vel.x+=random(-1,1);
    this.vel.z=shootspeed*this.shootspeedmult*cos(radians(shootangle));
    this.vel.y=-(shootspeed*this.shootspeedmult*sin(radians(shootangle))-gravity);
    
  }
  this.update=function(){
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0,0);
    
  }
  
  this.display=function(){
    specularMaterial(this.col);
    push();
    translate(this.pos.x,this.pos.y,this.pos.z);
    sphere(this.ballsize);
    pop();
  }
  
  }




function detectBeat(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    boxColor = color(74,143,99);
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
    shootBeat=true;
  }
  else{
    shootBeat=false;
    
    boxColor = color(random(20,40), random(100,120), random(140,180));
    if(countFramesSinceLastBeat <= beatHoldFrames){
      countFramesSinceLastBeat++;
    }
    else{
      beatCutOff *= beatDecayRate;
      beatCutOff = Math.max(beatCutOff,beatThreshold);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}