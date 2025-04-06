let doors = [];
let W, H;

const SHADOW_VALUE = 150;

function setup() {
  W = windowWidth;
  H = windowHeight;

  createCanvas(W, H);
  background(255);
  noStroke();
  ellipseMode(CORNER);
  initHeartPoints(50); // number of points in heart
}

function draw() {
  background(255);
  let t = millis();
  let sx = 40;
  let sy = 40;

  for (let i = 0; i < doors.length; i++) {
    let opening = smoothstep(-0.4, 0.1, sin((t + i * 3000) * 0.0001));
    resetMatrix();
    let door = doors[i];
    translate(door.x, door.y);
    rotate(PI);
    shearY(-QUARTER_PI * (1 - opening));
    fill(SHADOW_VALUE); // soft shadow
    ellipse(0, 0, sx + sx * (1 - opening), sy);
  }

  for (let i = 0; i < doors.length; i++) {
    let opening = smoothstep(-0.4, 0.1, sin((t + i * 3000) * 0.0001));
    resetMatrix();
    let door = doors[i];
    translate(door.x, door.y);
    rotate(PI);
    fill(0); // solid black circles
    ellipse(0, 0, sx, sy);
    fill(lerp(255, 190, opening));
    ellipse(-1, -1, (sx + 2) * opening, sy + 2);
  }
}

function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function initHeartPoints(n) {
  doors = [];
  let scale = 10;
  let centerX = W / 2;
  let centerY = H / 2;

  for (let i = 0; i < n; i++) {
    let t = map(i, 0, n, 0, TWO_PI);
    let x = 16 * pow(sin(t), 3);
    let y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t));
    doors.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    });
  }
}
