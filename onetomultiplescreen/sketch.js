var song, amplitude;
var musicPlaying = true;

var beatHoldFrames = 20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff = 0;
var beatDecayRate = 0.98;
var countFramesSinceLastBeat = 0;

var beatOn = false;

var numOfScreenWidth;
var numOfScreenHeight;
var widthOfScreen;
var heightOfScreen;
var xpos,ypos;


function preload() {
  song = loadSound('assets/colours.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  numOfScreen=1;
  // widthOfScreen=windowWidth/numOfScreen;
  // heightOfScreen=windowHeight/numOfScreen;
  randomSeed(1);
}


function draw() {
  background(100);
  fill(100);
  noStroke();
  
  var amp=amplitude.getLevel();
  
  detectBeat(amp);
  if(beatOn){
    numOfScreen=int(map(amp,0,1,1,8));
  }
  
  widthOfScreen=windowWidth/numOfScreen; //50
  heightOfScreen=windowHeight/numOfScreen; //50
  
  push();
  for (var i=0;i<numOfScreen;i++){ //2
    for (var j=0;j<numOfScreen;j++){
      xpos=j*widthOfScreen;
      ypos=i*heightOfScreen;
      rect(xpos,ypos,widthOfScreen,heightOfScreen);
      push();
      
      translate(widthOfScreen/2,heightOfScreen/2);
      fill(255);
      var ellipseRadius = map(amp,0,1,0.5,2);
      ellipse(xpos,ypos,heightOfScreen*ellipseRadius,heightOfScreen*ellipseRadius);
      
      
      fill(255, 215, 0,50);
      var ellipseRadius2 = map(amp,0,1,0.4,1.9);
      // ellipse(xpos,ypos,heightOfScreen*ellipseRadius2,heightOfScreen*ellipseRadius2);
      
      
      fill(255, 215, 0,100);
      var ellipseRadius3 = map(amp,0,1,0.3,1.8);
      ellipse(xpos,ypos,heightOfScreen*ellipseRadius3,heightOfScreen*ellipseRadius3);
      
      
      fill(255, 215, 0,150);
      var ellipseRadius4 = map(amp,0,1,0,1.7);
      ellipse(xpos,ypos,heightOfScreen*ellipseRadius4,heightOfScreen*ellipseRadius4);
      pop();
    }
  }
  pop();
}



function detectBeat(level) {
  if (level > beatCutOff && level > beatThreshold) {
    backgroundColor = color(random(255), random(255), random(255));
    beatOn = true;
    beatCutOff = level * 1.2;
    countFramesSinceLastBeat = 0;
  } else {
    
    if (countFramesSinceLastBeat <= beatHoldFrames) {
      beatOn=false;
      countFramesSinceLastBeat++;

    } else {
      numOfScreen=1;
      beatCutOff *= beatDecayRate;
      beatCutOff = Math.max(beatCutOff, beatThreshold);

    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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