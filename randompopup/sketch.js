var song, amplitude;
var fft;

var beatHoldFrames=20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff=0;
var beatDecayRate=0.98;
var countFramesSinceLastBeat=0;

var randomBeat=false;

var randombox=[];
var col;
var rotateCameraX=0;
var rotateCameraY=0;

function preload() {
  song = loadSound('assets/lifeincolor.mp3');
}

function setup() {
  createCanvas(windowWidth,windowHeight,WEBGL);
  frameRate(20);
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  
  fft = new p5.FFT();
  fft.setInput(song);
  
  col=color(240,10,20);
}


function draw() {
  background(20);
  ambientLight(200);
  pointLight(200,150,100);
  specularMaterial(col);
  camera(-500,-100,0);
  rotateX(radians(5));
  // rotateX(map(mouseY,0,height,0,30));
  
  rotateX(radians(rotateCameraX));
  rotateY(radians(rotateCameraY));
  
  var timer = int(millis()/1000);
  println(timer);
  if(timer>0){
    if (timer%30==0){
      rotateCameraY -=0.5;
      rotateCameraX -=0.5;
    }
    else if (timer%20==0){
      rotateCameraY +=0.2;
    }
    else if (timer%10==0){
      rotateCameraX +=0.5;
    }
  }
  
  var amp=amplitude.getLevel();
  detectBeat(amp);
  
  if(amp>0.35){
    randombox.push(new randomBox(random(-1000,0),-200,random(-1000,-600), random(5,10),color(random(200,255),random(190,240),20,200)));
  }
  else if(amp>0.2){
      randombox.push(new randomBox(random(-1000,0),-50,random(-600,-300), random(10,15),color(random(170,250),random(100,150),20,200)));
  }
  else if(amp>0.05 ){
      randombox.push(new randomBox(random(-1000,0),70,random(0,-300), random(15,20),color(random(150,200),random(0,40),20,200)));
  }
  if (randombox.length>30){
      randombox.splice(0,1);
    }

  for(var i=0; i<randombox.length;i++){
    randombox[i].display();
  }
  
}

function randomBox(x,y,z,randomnum,col){
  this.x=x;
  this.y=y;
  this.z=z;
  var boxh=10;
  this.numOfRange=20;
  this.randomnum=randomnum;
  this.col=col;
  

  
  this.display=function(){
    specularMaterial(this.col);
    var freq = fft.analyze();
    var range = freq.length/this.numOfRange; //1024/30
    
    var randomamp=amplitude.getLevel();
    // boxh=map(randomamp,0,1,10,300);
    boxh=map(fft.getEnergy(range*randomnum,range*randomnum+range),0,255,10,300);
    push();
    translate(this.x,this.y-boxh/2,this.z);
    rotateY(radians(40));
    box(80,boxh,80);
    pop();
  }
}


function detectBeat(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    boxColor = color(74,143,99);
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
    randomBeat=true;
  }
  else{
    randomBeat=false;
    
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