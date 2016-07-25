var song, amplitude;

var newbox = [];
var newbox2=[];
var musicPlaying = true;
var zpos = -500;
var cameraZ = 0;
var w = 300;
var l = 300;

var boxheight = [];
var boxColor = [];

var sizeSlider;
var moveCameraY = -300;
var moveCameraX = 500;

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
  
  
  
}

function draw() {
  var timer = int(millis() / 1000);
  print(timer);
  background(40);
  ambientLight(150);
  pointLight(250, 250, 250, 0, 400, 100);

  camera(moveCameraX, moveCameraY, cameraZ);
  if(timer>0){
    if (timer%50==0){
      moveCameraX-=50;
      moveCameraY-=20;
    }
    else if (timer%40==0){
      moveCameraX-=15;
      moveCameraY-=10;
    }
    else if (timer%30==0){
      moveCameraX-=77;
      moveCameraY+=30;
    }else if (timer%20==0){
      moveCameraX+=60;
      moveCameraY-=10;
    }
    else if (timer%10==0){
      moveCameraX+=25;
      moveCameraY-=10;
    }
  }

  var boxheight = map(amplitude.getLevel(), 0, 1, 30, 2000);
  newbox.push(new NewBox(0, 50, zpos, sizeSlider.value(), boxheight, sizeSlider.value()));
  newbox2.push(new NewBox(1000, 50, zpos, sizeSlider.value(), boxheight, sizeSlider.value()));
  
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
  // background(0);
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