/* Presentation Deck Controller & Application Script */

// Slide State
let currentSlide = 1;
const totalSlides = 30;
let timerSeconds = 0;
let timerInterval = null;

// Sound Effects Engine using Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playAudioTone(freq = 440, duration = 0.08) {
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}
window.playAudioTone = playAudioTone;

// Slide Navigation
function showSlide(index) {
  if (index < 1 || index > totalSlides) return;

  const prevSlide = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
  if (prevSlide) prevSlide.classList.remove('active');

  currentSlide = index;

  const nextSlide = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
  if (nextSlide) nextSlide.classList.add('active');

  // Update UI Counter & Progress Bar
  const counter = document.getElementById('slide-counter');
  if (counter) counter.textContent = `SLIDE ${currentSlide} / ${totalSlides}`;

  const progress = document.getElementById('progress-bar-fill');
  if (progress) progress.style.width = `${(currentSlide / totalSlides) * 100}%`;

  // Nav button state
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  if (prevBtn) prevBtn.disabled = currentSlide === 1;
  if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;


  playAudioTone(480, 0.06);
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Fullscreen Toggle
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert("Fullscreen mode can be triggered by pressing F11 or clicking the Fullscreen button.");
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.log(err));
    }
  }
}


// Slide Overview Grid Modal Toggle
function toggleSlideOverview() {
  const modal = document.getElementById('overview-modal');
  if (modal) {
    modal.classList.toggle('active');
  }
}

// Timer Controller
function startLessonTimer() {
  timerSeconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds++;
    const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const secs = String(timerSeconds % 60).padStart(2, '0');
    const badge = document.getElementById('timer-display');
    if (badge) badge.textContent = `${mins}:${secs}`;
  }, 1000);
}


// Quick Reflection (2-Minute) Timer Logic
let refTimer = null;
let refTimeLeft = 120; // 2 minutes (120 seconds)

function updateRefTimerDisplay() {
  const display = document.getElementById('ref-timer-digits');
  if (!display) return;
  const mins = String(Math.floor(refTimeLeft / 60)).padStart(2, '0');
  const secs = String(refTimeLeft % 60).padStart(2, '0');
  display.textContent = `${mins}:${secs}`;
}

function startRefTimer() {
  if (refTimer) {
    clearInterval(refTimer);
    refTimer = null;
    const btn = document.getElementById('btn-ref-toggle');
    if (btn) btn.innerHTML = '▶ Resume Timer';
    return;
  }
  
  if (refTimeLeft <= 0) refTimeLeft = 120;
  
  const btn = document.getElementById('btn-ref-toggle');
  if (btn) btn.innerHTML = '⏸ Pause Timer';
  
  refTimer = setInterval(() => {
    if (refTimeLeft > 0) {
      refTimeLeft--;
      updateRefTimerDisplay();
      if (refTimeLeft === 0) {
        clearInterval(refTimer);
        refTimer = null;
        if (btn) btn.innerHTML = '⏰ Time is Up!';
        playAudioTone(880, 0.4);
      }
    }
  }, 1000);
}

function resetRefTimer() {
  clearInterval(refTimer);
  refTimer = null;
  refTimeLeft = 120;
  updateRefTimerDisplay();
  const btn = document.getElementById('btn-ref-toggle');
  if (btn) btn.innerHTML = '▶ Start 2-Min Timer';
}

function toggleRefAnswer() {
  const answerBox = document.getElementById('ref-sample-answer');
  const toggleBtn = document.getElementById('btn-ref-answer');
  if (!answerBox) return;
  if (answerBox.style.display === 'none' || answerBox.style.display === '') {
    answerBox.style.display = 'block';
    if (toggleBtn) toggleBtn.innerHTML = '💡 Hide Key Takeaways';
  } else {
    answerBox.style.display = 'none';
    if (toggleBtn) toggleBtn.innerHTML = '💡 Reveal Key Takeaways';
  }
}
window.startRefTimer = startRefTimer;
window.resetRefTimer = resetRefTimer;
window.toggleRefAnswer = toggleRefAnswer;

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  startLessonTimer();
  showSlide(1);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key.toLowerCase() === 'o') {
      toggleSlideOverview();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });
});
