// ═══════════════════════════════════════════
//  VIDEO → CANVAS
// ═══════════════════════════════════════════

const video  = document.getElementById("videoElement");
const canvas = document.getElementById("videoCanvas");
const ctx    = canvas.getContext("2d");

// Crisp canvas — matches screen pixel density
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Override with actual video dimensions once known
video.addEventListener("loadedmetadata", () => {
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
});

function drawVideoFrame() {
    if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(drawVideoFrame);
}

video.addEventListener("canplay", () => {
    video.play().catch(() => {});
    requestAnimationFrame(drawVideoFrame);
});

video.addEventListener("ended", () => {
    video.currentTime = 0;
    video.play();
});

// ═══════════════════════════════════════════
//  GSAP
// ═══════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

const overlay = document.querySelector(".hero-overlay");

// ── 1. Polygon expands to fullscreen ────────────────────────────
const expandTl = gsap.timeline({
    paused: true,
    defaults: { duration: 1.2, ease: "power3.inOut" }
});

expandTl
    .to(".canvas-wrap", {
        width:    "100%",
        height:   "100%",
        top:      "0%",
        left:     "0%",
        xPercent: 0,
        yPercent: 0,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    })
    .to(".canvas-wrap canvas", { scale: 1.05 }, 0);

ScrollTrigger.create({
    trigger:     ".hero-section",
    start:       "top top",
    onEnter:     () => expandTl.play(),
    onLeaveBack: () => expandTl.reverse()
});

// ── 2. Scroll-driven blur + theme fade ──────────────────────────
ScrollTrigger.create({
    trigger: ".hero-section",
    start:   "top top",
    end:     "bottom top",
    onUpdate(self) {
        const p      = self.progress;
        const isDark = document.documentElement.classList.contains("dark");

        // Phase 1 (0→60%): blur ramps 0 → 24px
        const blur  = Math.min(p / 0.6, 1) * 24;

        // Phase 2 (60→100%): bg fades transparent → theme color
        const alpha = Math.max((p - 0.6) / 0.4, 0) * 0.97;

        overlay.style.backdropFilter       = `blur(${blur}px)`;
        overlay.style.webkitBackdropFilter = `blur(${blur}px)`;
        overlay.style.backgroundColor      = isDark
            ? `rgba(0, 0, 0, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
    }
});