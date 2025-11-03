/**
 * Parallax Component
 * 
 * Usage: Add class="parallax" and optional data-depth="0.5" to any element
 * - data-depth controls intensity (default: 0.7, range: 0-1)
 * - Works with mouse on desktop and device orientation on mobile
 */

class ParallaxController {
  constructor() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.init();
  }

  init() {
    this.setupViewportHeight();
    this.setupEventListeners();
  }

  setupViewportHeight() {
    const updateVH = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };

    updateVH();
    window.visualViewport?.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', updateVH);
  }

  setupEventListeners() {
    if (this.isMobile) {
      this.initMotionSensors();
    } else {
      this.initMouseTracking();
    }
  }

  initMotionSensors() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS - requires user interaction to request permission
      // You can trigger this on a button click: parallaxController.requestMotionPermission()
      console.log('iOS device detected. Call parallaxController.requestMotionPermission() on user interaction.');
    } else {
      // Android - no permission needed
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);
    }
  }

  // Call this method on a button click for iOS devices
  requestMotionPermission() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);
          } else {
            console.warn('Permission denied for device orientation.');
          }
        })
        .catch(console.error);
    }
  }

  initMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      this.applyParallax(x, y);
    });
  }

  handleOrientation(event) {
    const x = event.gamma / 45; // Normalize to -1..1
    const y = event.beta / 45;
    this.applyParallax(x, y);
  }

  applyParallax(x, y) {
    document.querySelectorAll('.parallax').forEach((el) => {
      const depth = parseFloat(el.getAttribute('data-depth')) || 0.7;
      const moveX = x * 10 * depth;
      const moveY = y * 10 * depth;
      const rotateX = y * 30 * depth;
      const rotateY = -x * 30 * depth;

      el.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      el.style.transformStyle = 'preserve-3d';
      el.style.backfaceVisibility = 'hidden';
      el.style.transition = 'transform 0.1s ease-out';
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.parallaxController = new ParallaxController();
  });
} else {
  window.parallaxController = new ParallaxController();
}