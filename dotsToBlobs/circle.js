function Circle(x,y){
  this.pos = createVector(x,y);
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.r=2;
  this.mass=2;
  this.maxspeed=0.3;
  this.ampspeed=random(0.08,this.maxspeed);
  this.maxforce =0.1;
  var circleColor = color(178,20,110);
  
  // this.history =[];
  
  this.applyForce=function(force){
    this.acc.add(force);
  }
  
  this.pushpull = function(center,mult_max){ 
    var f = p5.Vector.sub(center, this.pos);
    
    var d = f.mag(); //get distance
    f.normalize();//getdirection
    var m= map(d,0,100,0,this.ampspeed*mult_max); 
      
    f.setMag(m);
    f.mult(1);
    this.applyForce(f);
  }
  
  this.update =function(mult_max){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed*mult_max);
    this.pos.add(this.vel);
    this.acc.set(0,0);
    
    // var v =createVector(this.pos.x,this.pos.y);
    // this.history.push(v);
    
    // if (this.history.length>3){
    //   this.history.splice(0,1);
    // }
  }
  this.display = function(){
    if(onBeat == true){
      circleColor =color(255,127,80);
    }
    else{
      circleColor = color(178,20,110);
    }
    fill(circleColor);
    noStroke();
    ellipse(this.pos.x,this.pos.y,circleSizeSlider.value(),circleSizeSlider.value());
    
    // beginShape();
    // for (var i=0; i<this.history.length;i++){
    //   noFill();
    //   stroke(255);
    //   var a = this.history[i];
    //   vertex(a.x,a.y);
    // }
    // endShape();
    
  }
  
}