# 3D Particles Controlled Using Hand

An immersive WebGL interaction where **thousands of 3D particles react to your hand gestures in real time**.  
Open your hand to scatter the particles into a nebula; close your hand into a fist to collapse them into a perfect sphere — all through your webcam.

---

## 🎬 Preview

https://github.com/user-attachments/assets/7bb12369-458d-44af-88d9-de89a84882d6

---

## 🔗 Live Project

Hosted on GitHub Pages:  
**https://sohamgoswami07.github.io/3d-particles-controlled-using-hand/**

---

## ✨ Highlights

- Real-time **gesture-controlled morphing** of a 3D particle field
- Smooth interpolation powered by **THREE.Points + GPU rendering**
- **MediaPipe Hands** for highly accurate hand tracking in the browser
- Pure **HTML + CSS + JavaScript** — no backend required
- Fully responsive WebGL layout

---

## 🧰 Tech Stack

| Area | Tools |
|------|-------|
| Rendering | **Three.js** |
| Hand Tracking | **MediaPipe Hands**, **MediaPipe Camera Utils** |
| Languages | **HTML, CSS, JavaScript (ES6)** |
| Hosting | **GitHub Pages** |

---

## 📁 Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Sets up the DOM, video feed for MediaPipe, and the WebGL canvas |
| `style.css` | Styling for fullscreen WebGL + optional hand-video debugging |
| `main.js` | Core logic: scene setup, particle animation, and gesture detection |

---

## 🧠 How It Works (Short Overview)

- The project initializes a **3D particle cloud** using Three.js
- Every particle has:
  - a **spread-position** (nebula)
  - a **sphere-position** (compact formation)
- **Fist percentage** is computed using MediaPipe:
  - Hand open → value close to `0` → particles spread
  - Hand closed → value close to `1` → particles form a sphere
- Particles smoothly interpolate between both states each frame

---

## ▶️ Usage

### 1. Clone the project
```bash
git clone https://github.com/sohamgoswami07/3d-particles-controlled-using-hand.git
cd 3d-particles-controlled-using-hand
````

### 2. Run with a local server (recommended)

use **VS Code Live Server**

### 3. Allow camera access

The browser will request webcam permissions — grant access to enable hand tracking.

---

## 🎯 Visibility of the Webcam Video (Important)

The webcam feed used by MediaPipe is inserted using:

```html
<video id="input_video"></video>
```

Since it is only needed internally, **hide it in `index.html` by default**:

```html
<video id="input_video" style="display: none;"></video>
<!-- The video is hidden because it is only used for MediaPipe to read camera frames.
     Remove "display: none" temporarily if you want to debug hand tracking visually. -->
```

This keeps the UI clean and ensures only the 3D particles are visible.

---

## ⚙ Customization

You can tune the visual behavior directly in `main.js`:

| Variable         | Effect                           |
| ---------------- | -------------------------------- |
| `PARTICLE_COUNT` | Number of particles              |
| `PARTICLE_SIZE`  | Size of each point               |
| `SPREAD_RADIUS`  | Distance of open-hand dispersion |
| `SPHERE_RADIUS`  | Size of compact sphere           |
| `LERP_FACTOR`    | Speed of movement between shapes |

---

## 🚀 Future Improvements (Ideas)

* Multiple particle formations (cube, torus, text, logo)
* Hand gestures mapped to color / rotation / shape switching
* UI controls to tweak parameters visually
* Multi-hand support for advanced interactions

---

## 🙌 Credits

* **Three.js** → WebGL rendering
* **MediaPipe Hands** → Hand landmark tracking
* **GitHub Pages** → Hosting
