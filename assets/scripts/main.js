// ═══════════════════════════════════════════
//  VIDEO → CANVAS
//  Draws the raw (unblurred) video onto the
//  canvas so the polygon shows a crisp feed
//  while the background video is CSS-blurred.
// ═══════════════════════════════════════════

const video  = document.getElementById("videoElement");
const canvas = document.getElementById("videoCanvas");
const ctx    = canvas.getContext("2d");

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
//
// Splits scroll progress into two phases:
//
//   Phase 1  progress 0.0 → 0.6
//     backdrop-filter blur ramps from 0px → 24px
//     background stays transparent
//     → canvas gets progressively blurred out
//
//   Phase 2  progress 0.6 → 1.0
//     blur holds at 24px
//     background-color fades transparent → theme color (0 → 0.97 alpha)
//     → page color bleeds in, ready for featured section handoff
//
// The featured section has a solid bg at z-index:10 and slides
// naturally over the fixed layers — no JS needed for that part.

ScrollTrigger.create({
    trigger: ".hero-section",
    start:   "top top",
    end:     "bottom top",
    onUpdate(self) {
        const p      = self.progress; // 0 → 1
        const isDark = document.documentElement.classList.contains("dark");

        // Phase 1: blur 0 → 24px over first 60% of scroll
        const blurProgress = Math.min(p / 0.6, 1);
        const blur = blurProgress * 24;

        // Phase 2: bg fade over last 40% of scroll
        const fadeProgress = Math.max((p - 0.6) / 0.4, 0);
        const alpha = fadeProgress * 0.97;

        overlay.style.backdropFilter       = `blur(${blur}px)`;
        overlay.style.webkitBackdropFilter = `blur(${blur}px)`;
        overlay.style.backgroundColor      = isDark
            ? `rgba(0, 0, 0, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
    }
});