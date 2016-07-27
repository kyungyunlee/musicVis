function NewBox(x,y,z,w,h,l,boxcolor){
  this.pos = createVector(x,y,z);
  this.w=w;
  this.h=h;
  this.l=l;
  this.bc = boxcolor;
  
  this.display = function(){

    specularMaterial(this.bc);

    push();
    translate(this.pos.x,this.pos.y-this.h/2,this.pos.z);
    box(this.w,this.h,this.l);
    pop();
    
  }
}
