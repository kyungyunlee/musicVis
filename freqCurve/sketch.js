var song, amplitude;
var fft;
var musicPlaying = true;

var beatHoldFrames=20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff=0;
var beatDecayRate=0.98;
var countFramesSinceLastBeat=0;

var drawParticle = false;
var numOfPoints=30;
var r,g,b;
var lines=[];

var strokeSlider;

function preload() {
  song = loadSound('assets/lifeincolor.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);

  fft = new p5.FFT();
  fft.setInput(song);
  smooth(1);
  r=255;
  g=255;
  b=255;
  lines.push(new Lines(r,g,b));
  
  strokeSlider= createSlider(2,30,30,1);
  strokeSlider.position(windowWidth/2-10,windowHeight-30);
}

function draw() {
  background(20);
  var amp = amplitude.getLevel();

  detectBeat(amp);
  r=random(255);
  g=random(255);
  b=random(255);
  if (drawParticle==true){
    lines.push(new Lines(r,g,b));
  }
  if (lines.length>4){
    lines.splice(0,1);
  }
  for (var i=0; i<lines.length;i++){
    lines[i].display();
  }
  
}

function detectBeat(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    drawParticle = true;
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
  }
  else{
    drawParticle=false;
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

