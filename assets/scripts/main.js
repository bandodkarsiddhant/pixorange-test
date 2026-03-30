// ================= VIDEO → CANVAS =================

const video = document.getElementById("videoElement");
const canvas = document.getElementById("videoCanvas");
const ctx = canvas.getContext("2d");

// Match canvas resolution to video
video.addEventListener("loadedmetadata", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
});

// Continuous draw loop
function drawVideoFrame() {
  if (video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(drawVideoFrame);
}

// Autoplay + start rendering
video.addEventListener("canplay", () => {
  video.play().catch(() => {});
  requestAnimationFrame(drawVideoFrame);
});

// Safari safety loop
video.addEventListener("ended", () => {
  video.currentTime = 0;
  video.play();
});

// ================= GSAP HERO EXPANSION =================

gsap.registerPlugin(ScrollTrigger);

const expandTl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 1.2,
    ease: "power3.inOut"
  }
});

expandTl.to(".canvas-wrap", {
  width: "100%",
  height: "100%",
  top: "0%",           // changed from '70px'
  left: "0%",
  xPercent: 0,         // override the -50% translate
  yPercent: 0,
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%)"
});

// Optional subtle zoom (safe)
expandTl.to(
  ".canvas-wrap canvas",
  { scale: 1.05 },
  0
);

ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  onEnter: () => expandTl.play(),
  onLeaveBack: () => expandTl.reverse()
});

gsap.to(".video-wrapper > .blur-element", {
  backdropFilter: "blur(0px)",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    scrub: true
  }
});