function NewBox(x,y,z,w,h,l){
  this.pos = createVector(x,y,z);
  this.w=w;
  this.h=h;
  this.l=l;
  // this.c = color(0, random(100, 255), random(100, 255));
  
  this.display = function(){
    specularMaterial(30, 202, 250);
    push();
    translate(this.pos.x,this.pos.y-this.h/2,this.pos.z);
    box(this.w,this.h,this.l);
    pop();
    
  }
}