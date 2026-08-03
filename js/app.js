/* Presentation Deck Controller & Application Script */

// Slide State
let currentSlide = 1;
const totalSlides = 18;
let timerSeconds = 0;
let timerInterval = null;

// Sound Effects Engine using Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playAudioTone(freq = 440, duration = 0.1) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
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

  // Update Teacher Notes Content for active slide
  updateTeacherNotes(currentSlide);

  // Play slide switch audio
  playAudioTone(520, 0.08);
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
    document.documentElement.requestFullscreen().catch(err => console.log(err));
  } else {
    document.exitFullscreen().catch(err => console.log(err));
  }
}

// Speaker Notes Drawer Toggle
function toggleTeacherNotes() {
  const drawer = document.getElementById('teacher-notes-drawer');
  if (drawer) {
    drawer.classList.toggle('open');
    const btn = document.getElementById('btn-notes');
    if (btn) btn.classList.toggle('active', drawer.classList.contains('open'));
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

// Spoken Teacher Notes Database per Slide (From LESSON-PLAN-NI-YORT.docx)
const TeacherNotesDB = {
  1: {
    speech: "“Good afternoon, class! I am Troy Lits D. Dancel, and today we will tackle Architecture / Digital Logic Gates!”",
    student: "Students listen quietly and get ready for the lesson."
  },
  2: {
    speech: "“By the end of our 30-minute lesson, everyone should be able to identify 7 basic logic gates, evaluate truth tables, and recognize standard schematic symbols.”",
    student: "“Yes, sir!”"
  },
  3: {
    speech: "“Class, before we begin, remember our classroom rules: Be a TROY Student! Try your best, Raise others up, Open your mind, and Your actions matter. Are my rules clear?”",
    student: "“Yes, sir!”"
  },
  4: {
    speech: "“Let's recap our previous lesson. Who can tell the class what Computer Ethics means in simple words?”",
    student: "“It means using computers and the internet in a good, honest, and respectful way, sir!”"
  },
  5: {
    speech: "“To unlock our mystery word today, let's play 'Light Up the Stage'! Volunteer students will toggle switches A and B to find which combination grants Green Light access!”",
    student: "Volunteers select switch positions. Test 1: Red Light! Test 2: Green Light! Secret word revealed: LOGIC!"
  },
  6: {
    speech: "“Does anyone know what logic gates are? They are the basic building blocks of digital circuits, using transistors to make fast binary decisions with 1s and 0s. What device uses transistors?”",
    student: "“A cellphone, sir!”"
  },
  7: {
    speech: "“First is the AND Gate. The output is 1 (true) ONLY if all inputs are 1. If even one input is 0, the output is 0. Notice its flat-left, curved-right 'D' shape!”",
    student: "Students test switches A and B on the live simulator."
  },
  8: {
    speech: "“Next is the OR Gate. The OR Gate gives an output of 1 if at least one of its inputs is 1. The output will only be 0 when all inputs are 0.”",
    student: "Students observe the output bulb turning ON when either switch is active."
  },
  9: {
    speech: "“Now let's talk about the NOT Gate, also known as the Inverter. It has only one input and one output, and simply reverses the signal!”",
    student: "“If input is 1, output is 0. If input is 0, output is 1!”"
  },
  10: {
    speech: "“The NAND Gate means NOT-AND. It gives an output of 0 only when all inputs are 1. In every other case, the output is 1. How does it differ from AND gate, class?”",
    student: "“Sir, AND gives 1 only when both inputs are 1, but NAND gives 0 when both are 1!”"
  },
  11: {
    speech: "“The NOR Gate means NOT-OR. It gives an output of 1 only when all inputs are 0. If even one input becomes 1, the output turns to 0.”",
    student: "“OR gives 1 if any input is 1, while NOR gives 1 only when both are 0!”"
  },
  12: {
    speech: "“Moving on to the EXOR (Exclusive OR) Gate! Its output is 1 only when the inputs are different from each other. If inputs are identical, output is 0.”",
    student: "Students check their notes and test 0-1 and 1-0 inputs."
  },
  13: {
    speech: "“Our 7th gate is EXNOR (Exclusive NOR). It is the opposite of EXOR: output is 1 when inputs are identical (both 0 or both 1), and 0 when different!”",
    student: "“No questions, sir!”"
  },
  14: {
    speech: "“Recap time! Can anyone tell us which is the easiest logic gate structure we discussed, and which is the hardest?”",
    student: "“Easiest is NOT gate (1 input), hardest is EXNOR gate (combination of EXOR + NOT)!”"
  },
  15: {
    speech: "“Reflection Question: In one minute, how do basic logic gates impact the electronic devices you use every day?”",
    student: "“Every action on our phones relies on millions of tiny transistors making fast binary decisions using logic gate rules!”"
  },
  16: {
    speech: "“Activity Time: 'Pick the Gate Symbol!' I will flash two symbols, choose Symbol 1 or Symbol 2 within 10 seconds!”",
    student: "Students participate in the 5-round symbol challenge."
  },
  17: {
    speech: "“Please prepare for our 15-item evaluation quiz and Truth Table completion on screen!”",
    student: "Students complete the interactive quiz and submit answers."
  },
  18: {
    speech: "“For our next hands-on activity, please bring a printed picture of your chosen gate symbol, 1/8 illustration board, and a marker. Goodbye class!”",
    student: "“Goodbye and thank you, sir!”"
  }
};

function updateTeacherNotes(slideNum) {
  const noteData = TeacherNotesDB[slideNum] || { speech: "Present slide material.", student: "Students follow along." };
  const speechElem = document.getElementById('drawer-speech-text');
  const studentElem = document.getElementById('drawer-student-text');

  if (speechElem) speechElem.textContent = noteData.speech;
  if (studentElem) studentElem.textContent = noteData.student;
}

// Background Particle Circuit Canvas
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / 130)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  startLessonTimer();
  showSlide(1);

  // Keyboard navigation shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key.toLowerCase() === 'n') {
      toggleTeacherNotes();
    } else if (e.key.toLowerCase() === 'o') {
      toggleSlideOverview();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });
});
