var song, amplitude;

var beatHoldFrames=20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff=0;
var beatDecayRate=0.98;
var countFramesSinceLastBeat=0;

var onBeat=false;

var bouncingspheres=[];
var spreadingline=[];
var centershape;
var angle=0;
var rotateCameraX=0;
var rotateCameraY=0;
var rotateCameraZ=0;

var rectColor;
var smallMult;
var circlePos=20;

var numOfBouncingCircles=20;

function preload() {
  song = loadSound('assets/twice.mp3');
}

function setup() {
  createCanvas(windowWidth,windowHeight,WEBGL);
  
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  for (var i=0;i<numOfBouncingCircles;i++){
    var x=20*cos(random(TWO_PI/numOfBouncingCircles*i,TWO_PI/numOfBouncingCircles*i+TWO_PI/numOfBouncingCircles));
    var y=20*sin(random(TWO_PI/numOfBouncingCircles*i,TWO_PI/numOfBouncingCircles*i+TWO_PI/numOfBouncingCircles));
    bouncingspheres.push(new bouncingSphere(x,y));
  }
  centershape = new centerShape();
  rectColor=color(0,200,255);
}

function draw() {
  background(20);
  ambientLight(150,100);
  pointLight(200,150,100);
  // directionalLight(100,100,100,200,100);
  specularMaterial(rectColor);
  
  // push();
  rotateX(radians(rotateCameraX));
  rotateY(radians(rotateCameraY));
  camera(0,0,0);
  // pop();
  var timer = int(millis()/1000);
  println(timer);
  if(timer>0){
    if (timer%30==0){
      rotateCameraY -=2;
    }
    else if (timer%20==0){
      rotateCameraX +=3;
    }
    else if (timer%10==0){
      rotateCameraY +=1;
    }
  }
  centershape.update();
  centershape.display();
  
  var amp=amplitude.getLevel();
  detectBeat(amp);
  
  smallMult=map(amp,0,1,1,5);

  if(onBeat){
    if(amp>0.45){
      rectColor=color(random(180,231), random(40,80), random(40,100));
    }
    else{
      rectColor=color(random(60), random(140,235), random(70,180));
    }
    spreadingline.push(new spreadingLine(rectColor,smallMult));
  }


  if(spreadingline.length>10){
    spreadingline.splice(0,1);
  }

  for (var i=0;i<spreadingline.length;i++){
    spreadingline[i].update();
    spreadingline[i].display();
  }
  // angle+=0.2;
  var mult_cPos = map(amp,0,1,1,10);
  var mult_maxspeed = map(amp,0,1,1,70);
  detectBeat(amp);
  
  for(var i=0;i<bouncingspheres.length;i++){
    var c = createVector(circlePos*cos(TWO_PI/bouncingspheres.length*i)*mult_cPos,circlePos*sin(TWO_PI/bouncingspheres.length*i)*mult_cPos,0);
    // c.mult(mult_cPos);
    bouncingspheres[i].pushpull(c, mult_maxspeed);
    bouncingspheres[i].update(mult_maxspeed);
    bouncingspheres[i].display();
  }
  
}
function spreadingLine(rectColor,smallMult){
  this.x;
  this.y;
  this.rectColor=rectColor;
  this.startRadius=1;
  var numOfLines=20;
  var boxlength=5;
  this.angle=0;
  this.z=0;
  var radiusMult=1;
  this.smallSize=5;
  var individual=0;
  
  this.update=function(){
    var amp3=amplitude.getLevel();
    radiusMult=map(amp3,0,1,0,14);
    this.startRadius+=1*radiusMult;
    
    // this.z+=3;
  }
  this.display=function(){
    
    specularMaterial(this.rectColor);
    // rotateZ(radians(this.angle));
    // rotateY(radians(this.angle));
    for(var i=0;i<numOfLines;i++){
      this.x=this.startRadius*cos(TWO_PI/numOfLines*i);
      this.y= this.startRadius*sin(TWO_PI/numOfLines*i);
      push();
      translate(this.x,this.y,this.z);
      rotateX(radians(individual));
      rotateY(radians(individual));
      box(this.smallSize*smallMult);
      pop();
      individual+=0.1; 
      // boxlength+=5;
    }
    this.angle+=0.1;

  }
}


function bouncingSphere(x,y){
  this.pos=createVector(x,y,0);
  this.vel=createVector(0,0,0);
  this.acc=createVector(0,0,0);
  this.startRadius=20;
  this.maxspeed=0.3;
  this.ampspeed=random(0.08,this.maxspeed);
  var numOfSpheres=20;
  
  this.applyForce=function(f){
    this.acc.add(f);
  }
  this.pushpull=function(center,mult_max){
 
    var f = p5.Vector.sub(center,this.pos);
    var d= f.mag(); //get distance
    f.normalize(); //get direction
    var m=map(d,0,100,0,mult_max*this.ampspeed);
    f.setMag(m);
    this.applyForce(f);
  }

  this.update=function(mult_max){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed*mult_max)
    this.pos.add(this.vel);
    this.acc.set(0,0,0);
    var amp1=amplitude.getLevel();
    this.startRadius=map(amp1,0,1,0,300);
    
  }
  this.display=function(){
    for (var i=0;i<numOfSpheres;i++){
      push();
      translate(this.pos.x,this.pos.y,0);
      sphere(3);
      pop();
    }
  }
}

function centerShape(){
  this.x;
  this.y;
  this.boxsize=30;
  this.detail=20;
  
  this.update=function(){
    var amp2=amplitude.getLevel();
    boxsize=map(amp2,0,1,0,100);
    this.detail=int(map(amp2,0,1,3,7));
  }
  this.display=function(){
    this.x=0;
    this.y=0;
    sphere(boxsize,this.detail,this.detail);
  }
}

function detectBeat(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    boxColor = color(74,143,99);
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
    onBeat=true;
  }
  else{
    onBeat=false;
    
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