let doors = [];
let W, H;

const SHADOW_VALUE = 150;
const PASTEL_COLORS = [
  [255, 182, 193], // Light Pink
  [221, 160, 221], // Plum
  [176, 224, 230], // Powder Blue
  [152, 251, 152], // Pale Green
  [255, 218, 185], // Peach
  [230, 230, 250], // Lavender
];

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
  let t = millis() * 0.001; // Convert to seconds for smoother animation
  let sx = 40;
  let sy = 40;

  // Draw shadows
  for (let i = 0; i < doors.length; i++) {
    let opening = smoothstep(-0.4, 0.1, sin(t + i * 0.3));
    resetMatrix();
    let door = doors[i];
    translate(door.x, door.y);
    rotate(PI);
    shearY(-QUARTER_PI * (1 - opening));
    fill(SHADOW_VALUE);
    ellipse(0, 0, sx + sx * (1 - opening), sy);
  }

  // Draw doors
  for (let i = 0; i < doors.length; i++) {
    let opening = smoothstep(-0.4, 0.1, sin(t + i * 0.3));
    resetMatrix();
    let door = doors[i];
    translate(door.x, door.y);
    rotate(PI);
    
    // Pre-calculate color
    let currentColor;
    if (i % 2 === 0) {
      currentColor = [0, 0, 0]; // Black
    } else {
      let colorIndex = floor((i / 2) % PASTEL_COLORS.length);
      currentColor = PASTEL_COLORS[colorIndex];
    }
    
    fill(currentColor[0], currentColor[1], currentColor[2]);
    ellipse(0, 0, sx, sy);
    
    // Draw opening effect
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
