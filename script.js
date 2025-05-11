// Color palettes - inspired by The Book of HOV with gold as a primary palette
const palettes = {
    gold: ['#d4af37', '#caa52a', '#bf9b22', '#b7922d', '#aa8a2a', '#9c7521', '#8e6516', '#4d3b17'], // Gold Accent
    mono: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3'], // Monochrome
    warm: ['#7b4800', '#a86032', '#d17a46', '#e89a5e', '#e0a568', '#ff8800', '#e07325', '#c45e00'], // Warm Tones
    cool: ['#002185', '#1a3a7e', '#245393', '#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#003c32'], // Cool Tones
    vibrant: ['#ff2702', '#f65314', '#f8961e', '#fcd300', '#6b9404', '#009688', '#004d80', '#6236ff']  // Vibrant
};

// Presets with minimalist approach
const presets = {
    sketch: {
        brushType: '2B',
        fieldType: 'none',
        colorPalette: 'mono',
        density: 40,
        complexity: 5,
        weight: 1,
        backgroundType: 'none',
        backgroundOpacity: 10
    },
    watercolor: {
        brushType: 'marker',
        fieldType: 'waves',
        colorPalette: 'gold',
        density: 25,
        complexity: 7,
        weight: 2.5,
        backgroundType: 'wash',
        backgroundOpacity: 30
    },
    abstract: {
        brushType: 'spray',
        fieldType: 'curved',
        colorPalette: 'vibrant',
        density: 70,
        complexity: 8,
        weight: 1.2,
        backgroundType: 'subtle',
        backgroundOpacity: 15
    },
    technical: {
        brushType: 'rotring',
        fieldType: 'zigzag',
        colorPalette: 'cool',
        density: 50,
        complexity: 4,
        weight: 0.8,
        backgroundType: 'grid',
        backgroundOpacity: 10
    }
};

// Canvas variable
let canvas;
let fieldTime = 0;
let canvasInitialized = false;

// Initialize UI elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider value displays
    initSliderValues();
    
    // Initialize palette preview
    updatePalettePreview();
    
    // Add event listeners to presets
    initPresets();
    
    // Listen for palette changes
    document.getElementById('colorPalette').addEventListener('change', updatePalettePreview);
    
    // Subtle hover effect for title
    const titleSpans = document.querySelectorAll('.title-stack span');
    titleSpans.forEach(span => {
        span.addEventListener('mouseenter', function() {
            this.classList.add('accent-gold');
        });
        
        span.addEventListener('mouseleave', function() {
            this.classList.remove('accent-gold');
        });
    });
});

// Initialize slider value displays with clean minimal design
function initSliderValues() {
    // Weight slider
    const weightSlider = document.getElementById('weight');
    const weightValue = document.getElementById('weight-value');
    weightValue.textContent = parseFloat(weightSlider.value).toFixed(1);
    
    weightSlider.addEventListener('input', function() {
        weightValue.textContent = parseFloat(this.value).toFixed(1);
    });
    
    // Density slider
    const densitySlider = document.getElementById('density');
    const densityValue = document.getElementById('density-value');
    densityValue.textContent = densitySlider.value;
    
    densitySlider.addEventListener('input', function() {
        densityValue.textContent = this.value;
    });
    
    // Complexity slider
    const complexitySlider = document.getElementById('complexity');
    const complexityValue = document.getElementById('complexity-value');
    complexityValue.textContent = complexitySlider.value;
    
    complexitySlider.addEventListener('input', function() {
        complexityValue.textContent = this.value;
    });
    
    // Background opacity slider
    const bgOpacitySlider = document.getElementById('backgroundOpacity');
    const bgOpacityValue = document.getElementById('bg-opacity-value');
    bgOpacityValue.textContent = bgOpacitySlider.value + '%';
    
    bgOpacitySlider.addEventListener('input', function() {
        bgOpacityValue.textContent = this.value + '%';
    });
}

// Initialize preset buttons with minimal design
function initPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const presetName = this.getAttribute('data-preset');
            applyPreset(presetName);
        });
    });
}

// Apply a preset with clean transitions
function applyPreset(presetName) {
    const preset = presets[presetName];
    
    if (!preset) return;
    
    // Set all values from the preset
    document.getElementById('brushType').value = preset.brushType;
    document.getElementById('fieldType').value = preset.fieldType;
    document.getElementById('colorPalette').value = preset.colorPalette;
    document.getElementById('density').value = preset.density;
    document.getElementById('complexity').value = preset.complexity;
    document.getElementById('weight').value = preset.weight;
    document.getElementById('backgroundType').value = preset.backgroundType;
    document.getElementById('backgroundOpacity').value = preset.backgroundOpacity;
    
    // Update displays
    document.getElementById('weight-value').textContent = parseFloat(preset.weight).toFixed(1);
    document.getElementById('density-value').textContent = preset.density;
    document.getElementById('complexity-value').textContent = preset.complexity;
    document.getElementById('bg-opacity-value').textContent = preset.backgroundOpacity + '%';
    
    // Update palette preview
    updatePalettePreview();
    
    // Generate new artwork
    canvasInitialized = true;
    redraw();
}

// Update palette preview with clean minimal design
function updatePalettePreview() {
    const paletteSelect = document.getElementById('colorPalette');
    const palettePreview = document.getElementById('palette-preview');
    const selectedPalette = palettes[paletteSelect.value];
    
    // Clear previous preview
    palettePreview.innerHTML = '';
    
    // Add gold class if gold palette is selected
    if (paletteSelect.value === 'gold') {
        palettePreview.classList.add('gold-palette-preview');
    } else {
        palettePreview.classList.remove('gold-palette-preview');
    }
    
    // Create color blocks
    selectedPalette.forEach(color => {
        const colorBlock = document.createElement('div');
        colorBlock.style.backgroundColor = color;
        palettePreview.appendChild(colorBlock);
    });
}

// p5.js setup function
function setup() {
    // Create canvas in WEBGL mode as required by p5.brush
    // Use windowWidth to make canvas responsive and larger
    const canvasSize = min(windowWidth * 0.85, 1000);
    canvas = createCanvas(canvasSize, canvasSize, WEBGL);
    canvas.parent('canvas-container');
    
    // Load p5.brush
    brush.load();
    
    // Set random seed for consistency
    const seedValue = random(10000);
    brush.seed(seedValue);
    
    // Don't loop by default - we'll redraw when generate button is clicked
    noLoop();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newCanvasSize = min(windowWidth * 0.85, 1000);
        resizeCanvas(newCanvasSize, newCanvasSize);
        redraw();
    });
    
    // Add event listeners to buttons
    document.getElementById('generate').addEventListener('click', function() {
        // Generate new artwork with a different seed for variation
        brush.seed(random(10000));
        redraw();
    });
    
    document.getElementById('save').addEventListener('click', function() {
        // Add timestamp to filename to prevent overwriting
        const timestamp = Date.now().toString().slice(-4);
        saveCanvas(canvas, `artwork-${timestamp}`, 'png');
    });
}

// Helper function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(random(array.length))];
}

// Generate a random point with Gaussian distribution around center
function getRandomPoint(centerX, centerY, spread) {
    return {
        x: centerX + randomGaussian(0, spread),
        y: centerY + randomGaussian(0, spread)
    };
}

// Create organic shape with clean minimalist aesthetic
function createOrganicShape(centerX, centerY, radius, color, opacity) {
    brush.noStroke();
    brush.fill(color, opacity);
    
    // Add texture and bleed for natural media simulation
    brush.fillTexture(random(0.2, 0.4), random(0.3, 0.5));
    brush.bleed(random(0.1, 0.2), "out");
    
    // Create points for an irregular polygon with cleaner lines
    const numPoints = floor(random(5, 8));
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
        const angle = i * TWO_PI / numPoints;
        // Less variation for cleaner shapes
        const r = radius * (0.85 + random(0.3));
        points.push([
            centerX + cos(angle) * r,
            centerY + sin(angle) * r
        ]);
    }
    
    brush.polygon(points);
}

// p5.js draw function - with minimalist aesthetic inspired by The Book of HOV
function draw() {
    // Clear background
    background(255);
    
    // Get user settings
    const brushType = document.getElementById('brushType').value;
    const fieldType = document.getElementById('fieldType').value;
    const paletteType = document.getElementById('colorPalette').value;
    const selectedPalette = palettes[paletteType];
    const density = parseInt(document.getElementById('density').value);
    const complexity = parseInt(document.getElementById('complexity').value);
    
    // Scale weight based on canvas size
    const scaleFactor = width / 600; // Scale relative to original 600px design
    const weight = parseFloat(document.getElementById('weight').value) * scaleFactor;
    
    // Set field if selected
    if (fieldType !== 'none') {
        brush.field(fieldType);
        // Update field time for animation effect
        fieldTime += 0.05 * complexity;
        brush.refreshField(fieldTime);
    } else {
        brush.noField();
    }
    
    // Get background settings
    const backgroundType = document.getElementById('backgroundType').value;
    const backgroundOpacity = parseInt(document.getElementById('backgroundOpacity').value);
    
    // Draw background texture based on selected type
    if (backgroundType !== 'none') {
        switch (backgroundType) {
            case 'subtle':
                // Subtle shapes with cleaner lines
                for (let i = 0; i < 5; i++) {
                    const bgColor = getRandomItem(selectedPalette);
                    createOrganicShape(
                        random(-200, 200), // x
                        random(-200, 200), // y
                        random(100, 200),  // radius
                        bgColor,           // color
                        backgroundOpacity * 0.8  // lower opacity for subtlety
                    );
                }
                break;
                
            case 'wash':
                // Watercolor wash effect with cleaner edges
                for (let i = 0; i < 4; i++) {
                    const bgColor = getRandomItem(selectedPalette);
                    
                    brush.push();
                    brush.noStroke();
                    brush.fill(bgColor, backgroundOpacity);
                    
                    // More controlled texture
                    brush.fillTexture(random(0.3, 0.5), random(0.4, 0.6));
                    brush.bleed(random(0.2, 0.3), "out");
                    
                    // Create large circles with less irregularity
                    const x = random(-250, 250);
                    const y = random(-250, 250);
                    const size = random(200, 300);
                    brush.circle(x, y, size, true);
                    brush.pop();
                }
                break;
                
            case 'grid':
                // Grid pattern with cleaner lines
                const gridSize = random(30, 40);
                const gridRows = ceil(500 / gridSize);
                const gridCols = ceil(500 / gridSize);
                
                brush.push();
                brush.pick("2H");
                
                for (let i = 0; i < gridRows; i++) {
                    for (let j = 0; j < gridCols; j++) {
                        if (random() < 0.7) {
                            // Add minimal variation to grid for cleaner look
                            const x = -250 + j * gridSize + random(-2, 2);
                            const y = -250 + i * gridSize + random(-2, 2);
                            const bgColor = getRandomItem(selectedPalette);
                            
                            brush.stroke(bgColor);
                            brush.strokeWeight(random(0.3, 0.6));
                            
                            if (random() < 0.5) {
                                // Horizontal line
                                brush.line(x, y, x + gridSize * random(0.8, 0.9), y);
                            } else {
                                // Vertical line
                                brush.line(x, y, x, y + gridSize * random(0.8, 0.9));
                            }
                        }
                    }
                }
                brush.pop();
                break;
                
            case 'noise':
                // Noise texture with minimal aesthetic
                brush.push();
                brush.pick("spray");
                
                // Create sparse dots for a cleaner look
                for (let i = 0; i < 300; i++) {
                    const x = random(-280, 280);
                    const y = random(-280, 280);
                    const bgColor = getRandomItem(selectedPalette);
                    
                    brush.stroke(bgColor);
                    brush.strokeWeight(random(0.2, 0.5));
                    
                    // Draw small dots
                    brush.beginStroke("curve", x, y);
                    brush.endStroke(0, random(0.3, 0.7));
                }
                brush.pop();
                break;
        }
    }
    
    // Create composition with cleaner focal points
    const focalPoints = [];
    for (let i = 0; i < 2; i++) {
        // Create balanced focal points
        const gridDivisions = [-150, 0, 150];
        const x = gridDivisions[floor(random(3))] + random(-20, 20);
        const y = gridDivisions[floor(random(3))] + random(-20, 20);
        
        focalPoints.push({
            x: x,
            y: y,
            radius: random(80, 150),
            importance: random(0.7, 1)
        });
    }
    
    // Draw main strokes with cleaner aesthetic
    for (let i = 0; i < density; i++) {
        // Pick a random color from the palette
        const strokeColor = getRandomItem(selectedPalette);
        
        // Set brush
        brush.pick(brushType);
        brush.stroke(strokeColor);
        
        // Use more consistent weight for cleaner look
        const strokeWeight = weight * random(0.9, 1.1);
        brush.strokeWeight(strokeWeight);
        
        // Decide if point should be near a focal point or random
        let x, y;
        const useFocalPoint = random() < 0.8; // 80% chance to use focal point
        
        if (useFocalPoint) {
            // Choose a focal point with bias toward more important ones
            const focalPointCandidates = [...focalPoints].sort((a, b) => b.importance - a.importance);
            const focalPoint = random() < 0.7 ? 
                focalPointCandidates[0] : 
                getRandomItem(focalPointCandidates);
            
            // Get point near focal point with gaussian distribution
            const point = getRandomPoint(focalPoint.x, focalPoint.y, focalPoint.radius / 2);
            x = point.x;
            y = point.y;
        } else {
            // Random point
            x = random(-250, 250);
            y = random(-250, 250);
        }
        
        // Create stroke with cleaner, more minimal variation
        const strokeType = random();
        
        if (strokeType < 0.4) {
            // Simple line
            const angle = random(TWO_PI);
            const length = random(20, 70) * (complexity / 5);
            const endX = x + cos(angle) * length;
            const endY = y + sin(angle) * length;
            brush.line(x, y, endX, endY);
        } 
        else if (strokeType < 0.7) {
            // Flow line (follows vector field)
            if (fieldType !== 'none') {
                const length = random(30, 100) * (complexity / 5);
                const angle = random(TWO_PI);
                brush.flowLine(x, y, length, angle);
            } else {
                // Fallback to curve if no field with less segments
                brush.beginStroke("curve", x, y);
                brush.segment(random(TWO_PI), random(30, 80), random(0.8, 1));
                brush.endStroke(random(TWO_PI), random(0.6, 0.9));
            }
        }
        else {
            // Custom stroke with fewer segments for cleaner look
            brush.beginStroke("curve", x, y);
            const numSegments = floor(random(1, 3));
            for (let j = 0; j < numSegments; j++) {
                brush.segment(
                    random(TWO_PI), 
                    random(30, 50), 
                    random(0.8, 1)
                );
            }
            brush.endStroke(random(TWO_PI), random(0.6, 0.9));
        }
    }
    
    // Create some filled shapes with cleaner edges
    for (let i = 0; i < density / 10; i++) {
        const fillColor = getRandomItem(selectedPalette);
        
        brush.noStroke();
        brush.fill(fillColor, random(40, 60));
        
        // Less texture for cleaner look
        brush.fillTexture(random(0.2, 0.4), random(0.3, 0.5));
        brush.bleed(random(0.1, 0.2), "out");
        
        // Position with more intention
        let x, y;
        const useFocalPoint = random() < 0.7;
        
        if (useFocalPoint) {
            const focalPoint = getRandomItem(focalPoints);
            const point = getRandomPoint(focalPoint.x, focalPoint.y, focalPoint.radius / 2);
            x = point.x;
            y = point.y;
        } else {
            x = random(-250, 250);
            y = random(-250, 250);
        }
        
        // Cleaner shape choices
        if (random() < 0.6) {
            // Circle
            const radius = random(15, 35);
            brush.circle(x, y, radius, true);
        } else {
            // Simple polygon with fewer points
            const numPoints = floor(random(3, 5));
            const radius = random(15, 40);
            
            const points = [];
            for (let j = 0; j < numPoints; j++) {
                const angle = j * TWO_PI / numPoints;
                // Less variation for cleaner shapes
                const r = radius * (0.9 + random(0.2));
                points.push([
                    x + cos(angle) * r,
                    y + sin(angle) * r
                ]);
            }
            
            brush.polygon(points);
        }
    }
    
    // Add hatched shapes with cleaner aesthetic
    for (let i = 0; i < density / 15; i++) {
        const hatchColor = getRandomItem(selectedPalette);
        
        // Set hatch properties
        brush.setHatch("rotring", hatchColor, random(0.6, 0.9));
        
        // Cleaner hatching
        brush.hatch(random(3, 6), random(TWO_PI), {
            rand: random(0.05, 0.15), // Less randomness
            continuous: random() < 0.7,
            gradient: random(0, 0.2)
        });
        
        // Random position with bias toward focal points
        let x, y;
        const useFocalPoint = random() < 0.6;
        
        if (useFocalPoint) {
            const focalPoint = getRandomItem(focalPoints);
            const point = getRandomPoint(focalPoint.x, focalPoint.y, focalPoint.radius);
            x = point.x;
            y = point.y;
        } else {
            x = random(-250, 250);
            y = random(-250, 250);
        }
        
        const size = random(20, 50);
        
        // Simple rectangle for cleaner look
        brush.rect(x, y, size, size);
    }
    
    // Make sure everything is properly drawn to the canvas
    brush.reDraw();
    brush.reBlend();
    
    // Mark canvas as initialized
    canvasInitialized = true;
}