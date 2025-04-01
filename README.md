# System Simulation - Browser-Based Web App

This project is a multi-part browser-based system simulation built using **vanilla JavaScript** and native **HTML5 APIs**. It demonstrates geolocation tracking, interactive voting using Drag & Drop, and parallel computation via Web Workers — all without any external frameworks.

---

## 🔧 Features

### 🗺️ Geolocation Tracker
- Simulates real-time bird tracking using `navigator.geolocation`
- Updates location on Google Maps every few seconds using `setInterval`
- Displays dynamic latitude & longitude values

### 🗳️ Drag & Drop Voting Simulation
- Users drag senator names into a voting area
- Tracks votes with Drag & Drop API
- Loads senator info from an external XML file via AJAX
- Stores vote results in `localStorage` and restores UI state on reload

### ⚙️ Parallel Computation with Web Workers
- 5 Web Workers compute the sum of squares asynchronously
- Results stored in `localStorage` and displayed in real-time
- Demonstrates non-blocking, parallel JavaScript execution

---

## 💡 Technologies Used

- **HTML5 APIs**: Geolocation, Drag & Drop, Web Workers, localStorage
- **JavaScript**: DOM manipulation, AJAX (`XMLHttpRequest`), JSON
- **Google Maps Embed** for geolocation visualization

---
