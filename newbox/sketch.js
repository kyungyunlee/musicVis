var song, amplitude;

var newbox = [];
var newbox2=[];
var musicPlaying = true;
var zpos = -500;
var cameraZ = 0;
var w = 300;
var l = 300;

var boxheight = [];
var boxColor;
var onBeat=false;

var sizeSlider;
var moveCameraY = -300;
var moveCameraX = 500;

var beatHoldFrames=20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff=0;
var beatDecayRate=0.98;
var countFramesSinceLastBeat=0;

function preload() {
  song = loadSound('assets/lifeincolor.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(20);
  song.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);

  sizeSlider = createSlider(30,300,300,0.1);
  sizeSlider.position(300,windowHeight-30);
  
  boxColor = color(random(20,40), random(100,120), random(140,180));

}

function draw() {
  var timer = int(millis() / 1000);
  print(timer);
  background(20);
  ambientLight(150);
  pointLight(250, 250, 250, 200, 300, 100);

  camera(moveCameraX, moveCameraY, cameraZ);
  if(timer>0){
    if (timer%40==0){
      moveCameraX-=60;
      moveCameraY-=20;
    }
    else if (timer%30==0){
      moveCameraX-=75;
      moveCameraY+=45;
    }
    else if (timer%20==0){
      moveCameraX+=50;
      moveCameraY-=20;
    }
    else if (timer%10==0){
      moveCameraX+=25;
      moveCameraY-=20;
    }
  }

  var boxheight = map(amplitude.getLevel(), 0, 1, 30, 2000);
  newbox.push(new NewBox(0, 0, zpos, sizeSlider.value(), boxheight, sizeSlider.value(),boxColor));
  newbox2.push(new NewBox(1000, 0, zpos, sizeSlider.value(), boxheight, sizeSlider.value(), boxColor));
  detectBeat(amplitude.getLevel());
  
  for (var i = 0; i < newbox.length; i++) {
    newbox[i].display();
    newbox2[i].display();
  }

  if ((cameraZ-zpos)>5000){
    cameraZ -= sizeSlider.value()*1.3;
  }
  else {
    zpos -= sizeSlider.value() + 10;
    cameraZ -= sizeSlider.value();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function musicOnOff() {
  if (musicPlaying == true) {
    song.pause();
    musicPlaying = false;
  } else {
    song.play();
    musicPlaying = true;
  }
}

function detectBeat(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    boxColor = color(74,143,99);
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
  }
  else{
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