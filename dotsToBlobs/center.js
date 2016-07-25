function Center(){
  this.pos = createVector(0,0);
  this.mass=10;
  this.r=100; //if mass is big then circels around it will be more free 
  this.G =1;
  
  this.calculateAttraction=function(circles){
    var f = p5.Vector.sub(this.pos,circles.pos); 
    var d = f.mag();
    d=constrain(d,this.r,this.r+20);
    if ((d>this.r)&&(d<this.r+20)){
      
    }
    f.normalize(); //direction
    var strength = (this.G*this.mass*circles.mass)/(d*d); //scalar
    f.mult(strength);
    return f;
  }
  
  this.display=function(){
    noStroke();
    fill(255,10);
    ellipse(0,0,this.r,this.r);
  }
}