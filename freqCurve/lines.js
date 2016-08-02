function Lines(r,g,b){
  var op;
  this.r=r;
  this.g=g;
  this.b=b;
  this.history=[];
  
  var numOfPoints=30;
  var lengthBetweenPoints;
  var heightOfPoints=[];

  var smoothFactor=1;
  var sum=[];
  var newFreq=[];
  
  for (var i=0;i<numOfPoints;i++){
    sum[i]=0;
    newFreq[i]=0;
    heightOfPoints[i]=0;
  }
  
  for(var i=0;i<numOfPoints;i++){
      this.history[i]=[];
    }
  
  this.display=function(){
    lengthBetweenPoints = (windowWidth-100)/numOfPoints;
    
    var freq = fft.analyze();
    var range = freq.length/numOfPoints; //1024/30
    
    ///smoothing effect - may be unnecessary
//     for (var k=0;k<numOfPoints;k++){
//       newFreq[k] = fft.getEnergy(range*k+1, range*k+range);
//       sum[k]+=(newFreq[k]-sum[k])*smoothFactor;
//       heightOfPoints[k] = sum[k];
//       // this.y = heightOfPoints[k];
// }
    var col= color(this.r,this.g,this.b,op);
    stroke(col);
    strokeWeight(2);
    noFill();
    // fill(255,1);
    ellipse(50,windowHeight/2,3,3);
    ellipse(windowWidth-50, windowHeight/2,3,3);

    beginShape();
    vertex(50,windowHeight/2);
    curveVertex(50,windowHeight/2);
    for(var i=0; i<numOfPoints;i++){
      heightOfPoints[i] = map(fft.getEnergy(range*i+1, range*i+range),0,255,0,windowHeight*0.8);
      curveVertex(i*lengthBetweenPoints+50, heightOfPoints[i]);
      this.history[i].push(heightOfPoints[i]);
    }
    curveVertex(windowWidth-50, windowHeight/2);
    vertex(windowWidth-50, windowHeight/2);
    endShape();
  
    for (var i=0;i<numOfPoints;i++){
      if (this.history[i].length>1){
        this.history[i].splice(0,1);
      }
      for (var j=0; j<this.history[i].length;j++){
        op=50*j+10;
        col= color(this.r,this.g,this.b,op);
        stroke(col);
        beginShape();
        vertex(50,windowHeight/2);
        curveVertex(50,windowHeight/2);
        for(var k=0; k<numOfPoints;k++){
          curveVertex(k*lengthBetweenPoints+50, this.history[k][j]);
        }
        curveVertex(windowWidth-50, windowHeight/2);
        vertex(windowWidth-50, windowHeight/2);
        endShape();
      }
    }
  }
}