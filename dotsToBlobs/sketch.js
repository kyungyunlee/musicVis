var song, amplitude;
var musicPlaying = true;

var circles=[];
var numOfCircles=200;
var gravity;
var angle=0;

var circlePos = 20;
var cPos = 20; //initial position of circles

var beatHoldFrames=20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff=0;
var beatDecayRate=0.98;
var countFramesSinceLastBeat=0;

var onBeat =false;

var circleSizeSlider;
var backgroundColor;

function preload(){
  song = loadSound('assets/lifeincolor.mp3');
}


function setup() {
  createCanvas(windowWidth,windowHeight);
  backgroundColor=10;
  song.play();
  
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  for (var i=0;i<numOfCircles;i++){
    var x=cPos*cos(random(TWO_PI/numOfCircles*i,TWO_PI/numOfCircles*i+TWO_PI/numOfCircles));
    var y=cPos*sin(random(TWO_PI/numOfCircles*i,TWO_PI/numOfCircles*i+TWO_PI/numOfCircles));
    circles.push(new Circle(x,y));
  }
  
  circleSizeSlider = createSlider(2,200,0.1);
  circleSizeSlider.position(windowWidth/2-10,windowHeight-30);
  
}

function draw() {
  background(10);
  
  var mult_cPos = map(amplitude.getLevel(),0,1,0,20);
  var mult_maxspeed = map(amplitude.getLevel(),0,1,1,110);
  detectBeat(amplitude.getLevel());
  translate(windowWidth/2,windowHeight/2);
  rotate(angle);
  push();
  
  beginShape();
  // circles[0].display();
  for(var i=0;i<circles.length;i++){
    var c = createVector(circlePos*cos(TWO_PI/circles.length*i),circlePos*sin(TWO_PI/circles.length*i));
    c.mult(mult_cPos);
    circles[i].pushpull(c,mult_maxspeed);
    circles[i].update(mult_maxspeed);
    circles[i].display();
  }
  // circles[circles.length-1].display();
  endShape();

  pop();
  
  stroke(255);
  noFill();
  angle+=0.001*mult_cPos;
}

function detectBeat(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
    onBeat = true;
  }
  else{
    
    if(countFramesSinceLastBeat <= beatHoldFrames){
      countFramesSinceLastBeat++;
    }
    else{
      beatCutOff *= beatDecayRate;
      beatCutOff = Math.max(beatCutOff,beatThreshold);
      onBeat =false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  circleSizeSlider.position(windowWidth/2-10,windowHeight-30);
}

function keyPressed(){
  if (keyCode ==32){
    if (musicPlaying){
      song.pause();
      musicPlaying=false;
    }
    else{
      song.play();
      musicPlaying=true;
    }
  }
}



