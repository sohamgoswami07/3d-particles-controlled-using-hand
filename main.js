import * as THREE from 'three';

// --- Configuration ---
const PARTICLE_COUNT = 5000;
const PARTICLE_SIZE = 0.05;
const SPREAD_RADIUS = 15;
const SPHERE_RADIUS = 4;
const LERP_FACTOR = 0.1;

// --- Globals ---
let scene, camera, renderer, particles;
let fistPercentage = 0; // 0 = fully open, 1 = fully closed

// Pre-calculate two sets of positions for performance
const spreadPositions = new Float32Array(PARTICLE_COUNT * 3);
const spherePositions = new Float32Array(PARTICLE_COUNT * 3);

// --- Helper Functions ---
function getRandomPointInSphere(radius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * radius;
    const sinPhi = Math.sin(phi);
    return [
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * Math.cos(phi)
    ];
}

function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
}

// --- Initialization ---
function init() {
    // Scene Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Generate particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const [sx, sy, sz] = getRandomPointInSphere(SPREAD_RADIUS);
        spreadPositions[i * 3] = sx;
        spreadPositions[i * 3 + 1] = sy;
        spreadPositions[i * 3 + 2] = sz;

        const [cx, cy, cz] = getRandomPointInSphere(SPHERE_RADIUS);
        spherePositions[i * 3] = cx;
        spherePositions[i * 3 + 1] = cy;
        spherePositions[i * 3 + 2] = cz;
    }

    // Create particle system with round particles
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spreadPositions), 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: PARTICLE_SIZE,
        map: createCircleTexture(),
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize, false);
    animate();
    initHandTracking();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        // Simple automatic rotation
        particles.rotation.y += 0.002;

        // Interpolate positions based on fist percentage
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            // Interpolate between spread and sphere positions
            const targetPos = spreadPositions[i] + (spherePositions[i] - spreadPositions[i]) * fistPercentage;
            positions[i] += (targetPos - positions[i]) * LERP_FACTOR;
        }

        particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// --- Hand Tracking ---
function initHandTracking() {
    const videoElement = document.getElementById('input_video');

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => await hands.send({ image: videoElement }),
        width: 640,
        height: 480
    });
    cameraUtils.start();
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        detectGesture(landmarks);
    } else {
        fistPercentage = 0; // Default to fully open when no hand detected
    }
}

function detectGesture(landmarks) {
    const wrist = landmarks[0];
    const tips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
    let fingersClosed = 0;

    for (let tipIdx of tips) {
        const tip = landmarks[tipIdx];
        const dx = tip.x - wrist.x;
        const dy = tip.y - wrist.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.2) {
            fingersClosed++;
        }
    }

    // Calculate fist percentage (0 = open, 1 = closed)
    fistPercentage = fingersClosed / tips.length;
}

init();
