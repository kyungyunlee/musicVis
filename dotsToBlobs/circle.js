function Circle(x,y){
  this.pos = createVector(x,y);
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.r=2;
  this.mass=2;
  this.maxspeed=0.3;
  this.ampspeed=random(0.08,this.maxspeed);
  this.maxforce =0.1;
  
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
  }
  this.display = function(){
    fill(255,200);
    noStroke();
    ellipse(this.pos.x,this.pos.y,circleSizeSlider.value(),circleSizeSlider.value());
  }
  
}