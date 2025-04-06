//Tree stem code forked form: https://openprocessing.org/sketch/2071621 & credit to original designer of the tree: https://openprocessing.org/sketch/1991212
//Inspired by Alexis Middleton - https://persialou.com/diy-birch-tree-wall-art/
//Hope you all enjoy!
function w(n) 
{
  if(n==null) return width
  return width*n
}

function h(n) 
{
  if(n==null) return height
  return height*n
}

function hsbShift(col, h, s, b)
{
    return color(hue(col)+h, saturation(col)+s, brightness(col)+b)
}

function randNeg(n) 
{
  return (n==null)?(random() < 0.5 ? 1:-1):(random() < 0.5 ? n:-n)
}

function ease(n) 
{
  return n**3
}

class particle 
{
  constructor(sx, sy, sc, ss, sd, sl, ls, tag, others, directionMultiplier = 1) {
    this.tag = tag
    this.pos = createVector(sx, sy)
    this.col = sc
    this.siz = 1
    this.asiz = ss
    this.dir = sd
    this.dirMult = directionMultiplier
    this.spd = (this.tag=="trunk")?2:random(0.25, 2)
    this.life = sl
    this.lifespan = ls
    this.others = others
    this.thshift = random(-1, 1)*0
    this.tsshift = random(1)*0
    this.tbshift = random(-1)*0
    this.rsiz = this.asiz*this.siz
  }
  
  kill() 
	{
    let index = this.others.indexOf(this)
    if(index > -1) 
		{
      this.others.splice(index, 1)
    }
  }
  
  update() 
	{
    this.rsiz = this.asiz*this.siz
    this.pos.add(createVector(cos(radians(this.dir))*this.spd*this.dirMult, sin(radians(this.dir))*this.spd))
    this.dir += random(-.9, 1)*(this.tag == "trunk" && this.siz > 0.7 ? 1:map(this.life, 0, this.lifespan, 1, 5))
    if(random() < (this.tag=="branch" ? 0.003:0.005) && this.tag!="trunk") this.dir += randNeg(72)*0
    this.siz = lerp(this.siz, 0, random(0.015))
    
    if(this.rsiz < 0.1 || this.spd > this.rsiz) 
		{
      this.kill()
    }
    
    this.col = hsbShift(this.col, random(this.thshift), random(this.tsshift), random(this.tbshift))
    
    if(random() < 0.03 && this.tag=="trunk" && this.siz < .55) 
		{
      this.others.push(new particle(this.pos.x, this.pos.y, this.col, this.rsiz, this.dir+randNeg(random(15, 30)), this.life, this.lifespan, "branch", this.others, this.dirMult))
    }
    
    if(random() < 0.01 && this.tag=="branch") 
		{
      this.others.push(new particle(this.pos.x, this.pos.y, this.col, this.rsiz, this.dir, this.life, this.lifespan, "branch", this.others, this.dirMult))
    }
    
    if(random() < map(this.siz, 0, 0.25, 0.5, 0.3) && this.tag=="branch" && this.siz < 0.25) 
		{
      this.others.push(new particle(this.pos.x, this.pos.y, this.col, (this.siz**0.5)*this.rsiz, this.dir+randNeg(random(5, 20)), 0, random(this.lifespan*0.05), "twig", this.others, this.dirMult))
    }
    
    noStroke()
    fill(this.col)
		stroke(random(50))
		strokeWeight(((this.siz/2*this.asiz)/13))
		let chance=round(random(1))
    line(this.pos.x, this.pos.y, this.pos.x+random(this.siz*this.asiz )/2*this.dirMult, this.pos.y)
		let choice=round(random(1))
		if(choice==0) circle(this.pos.x+( this.siz*this.asiz )*this.dirMult, this.pos.y,1)

    if(this.life > this.lifespan) 
		{
			this.kill()
    }
	
    this.life++
  }
}

let PARTS = []
let count = 2
let counter=0
function setup() 
{
  let canvas = createCanvas(600, 500);
  canvas.parent('animation-container');
  background(255)
  // Right-tilting tree
  for(let i = 0; i < count; i++) 
	{
    PARTS.push(new particle(w(0.3), h(0.95), "#000", 50, 300, 0, 500, "trunk", PARTS, 1))
  }
}

function draw() 
{
	counter++
	push()
	translate(0,0)
  for(var p of PARTS) 
	{
    for(let i = 0; i < 1; i++) p.update()
  }
	pop()
}

function smoothstep(start, end, amount) 
{
  amount = Math.max(0, Math.min(1, amount));
  return (amount * amount * (3 - 2 * amount)) * (end - start) + start;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

