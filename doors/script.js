let doors = [];
let W, H;
let timeScale = 1; // Dynamic time scaling

const SHADOW_VALUE = 80; // Even softer shadow
const PASTEL_COLORS = [
    [255, 235, 245], // Ethereal Pink
    [245, 235, 255], // Ethereal Lavender
    [235, 255, 245], // Ethereal Mint
    [255, 245, 235], // Ethereal Peach
    [235, 245, 255], // Ethereal Blue
    [255, 255, 235]  // Ethereal Yellow
];

function setup() {
    W = windowWidth;
    H = windowHeight;
    createCanvas(W, H);
    background(255);
    noStroke();
    ellipseMode(CORNER);
    initHeartPoints(24); // Fewer points for more artistic spacing
}

function draw() {
    background(255);
    
    // Accelerating time scale
    timeScale = 1 + (millis() * 0.00001); // Gradually increase speed
    let t = millis() * 0.0003 * timeScale;
    
    let sx = 52; // Larger, more prominent circles
    let sy = 52;

    // Create a subtle glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';

    // Draw shadows with ethereal effect
    for (let i = 0; i < doors.length; i++) {
        let phase = t + i * (TWO_PI / doors.length);
        let opening = smoothstep(-0.9, 0.4, sin(phase));
        resetMatrix();
        let door = doors[i];
        translate(door.x, door.y);
        rotate(PI + sin(phase * 0.5) * 0.1); // Subtle rotation
        
        // Dynamic shadow based on phase
        let shadowOpacity = map(sin(phase), -1, 1, 40, 100);
        fill(SHADOW_VALUE, shadowOpacity);
        shearY(-QUARTER_PI * (1 - opening) * 0.5);
        ellipse(0, 0, sx + sx * (1 - opening) * 0.6, sy);
    }

    // Draw main circles with enhanced effects
    for (let i = 0; i < doors.length; i++) {
        let phase = t + i * (TWO_PI / doors.length);
        let opening = smoothstep(-0.9, 0.4, sin(phase));
        resetMatrix();
        let door = doors[i];
        translate(door.x, door.y);
        rotate(PI + sin(phase * 0.5) * 0.1);
        
        // Enhanced color transitions
        let currentColor;
        if (i % 2 === 0) {
            // Create a dynamic bright white/red pulse
            let pulse = sin(phase * 2) * 0.5 + 0.5;
            let redValue = lerp(255, 245, pulse);
            let brightness = map(sin(phase), -1, 1, 0.9, 1);
            currentColor = [
                redValue * brightness,
                255 * brightness,
                255 * brightness
            ];
        } else {
            let colorIndex = floor((i / 2) % PASTEL_COLORS.length);
            let baseColor = PASTEL_COLORS[colorIndex];
            let brightness = map(sin(phase), -1, 1, 0.95, 1.05);
            currentColor = baseColor.map(c => c * brightness);
        }
        
        // Add subtle bloom effect
        drawingContext.shadowBlur = opening * 20;
        fill(currentColor[0], currentColor[1], currentColor[2]);
        ellipse(0, 0, sx, sy);
        
        // Enhanced highlight effect
        let highlightOpacity = map(opening, 0, 1, 150, 220);
        if (i % 2 === 0) {
            fill(255, 255, 255, highlightOpacity);
        } else {
            fill(255, highlightOpacity * 0.8);
        }
        
        // Dynamic highlight size based on phase
        let highlightScale = map(sin(phase), -1, 1, 0.8, 1);
        ellipse(-1, -1, (sx + 2) * opening * highlightScale, sy + 2);
    }
}

function smoothstep(edge0, edge1, x) {
    x = constrain((x - edge0) / (edge1 - edge0), 0, 1);
    // Enhanced smoothing function for more organic movement
    return x * x * x * (x * (x * 6 - 15) + 10) * (sin(x * PI) * 0.1 + 0.9);
}

function initHeartPoints(n) {
    doors = [];
    let scale = 16; // More dramatic spacing
    let centerX = W / 2;
    let centerY = H / 2;

    for (let i = 0; i < n; i++) {
        let t = map(i, 0, n, 0, TWO_PI);
        // Enhanced heart shape with slightly more dramatic curves
        let x = 16 * pow(sin(t), 3);
        let y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t));
        
        // Add subtle variation to positions
        let variation = sin(t * 3) * 0.1;
        doors.push({
            x: centerX + (x + variation) * scale,
            y: centerY + (y + variation) * scale,
        });
    }
}
