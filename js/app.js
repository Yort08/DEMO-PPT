/* Presentation Deck Controller & Application Script */

// Slide State
let currentSlide = 1;
const totalSlides = 29;
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

  // Update Teacher Notes Content for active slide
  updateTeacherNotes(currentSlide);

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
    speech: "“To unlock the first letter on the screen, we need to find the correct switch position that turns the green light ON in Mystery Box 1. I need a volunteer!”",
    student: "Volunteer tests switches. Test 1 (UP/DOWN): Red Light! Test 2 (UP/UP): Green Light! Access Granted! Unlocks Letter 1: L."
  },
  6: {
    speech: "“Let's move to Mystery Box 2 to reveal our second letter! Notice Mystery Box 2 requires a different switch condition. Who wants to try?”",
    student: "Volunteer tests switches. Test 1 (UP/DOWN): Green Light! Access Granted! Unlocks Letter 2: O."
  },
  7: {
    speech: "“Finally, let's look at Mystery Box 3 to reveal our third letter. Notice this box only has a single switch (Switch A)! Who will volunteer?”",
    student: "Volunteer tests switch. Test 1 (UP): Red Light! Test 2 (DOWN): Green Light! Access Granted! Unlocks Letter 3: G."
  },
  8: {
    speech: "“Well done class! Can anyone complete the word L O G _ _ ?”",
    student: "“LOGIC, sir!” — Teacher introduces the main topic: Digital Logic Gates!"
  },
  9: {
    speech: "“Does anyone know what logic gates are? They are the basic building blocks of digital circuits, using transistors to make fast binary decisions with 1s and 0s. What device uses transistors?”",
    student: "“A cellphone, sir!”"
  },
  10: {
    speech: "“There are 7 basic digital logic gates that form all digital computers: AND, OR, NOT, NAND, NOR, EXOR, and EXNOR. Let's explore each one!”",
    student: "Students look at the 7 gate categories on screen."
  },
  11: {
    speech: "“First is the AND Gate. The output is 1 (true) ONLY if all inputs are 1. If even one input is 0, the output is 0. Notice its flat-left, curved-right 'D' shape!”",
    student: "Students test switches A and B on the live simulator."
  },
  12: {
    speech: "“Next is the OR Gate. The OR Gate gives an output of 1 if at least one of its inputs is 1. The output will only be 0 when all inputs are 0.”",
    student: "Students observe the output bulb turning ON when either switch is active."
  },
  13: {
    speech: "“Now let's talk about the NOT Gate, also known as the Inverter. It has only one input and one output, and simply reverses the signal!”",
    student: "“If input is 1, output is 0. If input is 0, output is 1!”"
  },
  14: {
    speech: "“The NAND Gate means NOT-AND. It gives an output of 0 only when all inputs are 1. In every other case, the output is 1. How does it differ from AND gate, class?”",
    student: "“Sir, AND gives 1 only when both inputs are 1, but NAND gives 0 when both are 1!”"
  },
  15: {
    speech: "“The NOR Gate means NOT-OR. It gives an output of 1 only when all inputs are 0. If even one input becomes 1, the output turns to 0.”",
    student: "“OR gives 1 if any input is 1, while NOR gives 1 only when both are 0!”"
  },
  16: {
    speech: "“Moving on to the EXOR (Exclusive OR) Gate! Its output is 1 only when the inputs are different from each other. If inputs are identical, output is 0.”",
    student: "Students check their notes and test 0-1 and 1-0 inputs."
  },
  17: {
    speech: "“Our 7th gate is EXNOR (Exclusive NOR). It is the opposite of EXOR: output is 1 when inputs are identical (both 0 or both 1), and 0 when different!”",
    student: "“No questions, sir!”"
  },
  18: {
    speech: "“Class, let's take two minutes for a quick reflection: Write a short sentence explaining how basic logic gates impact everyday electronic devices.”",
    student: "Students write down their answers in their notebooks or on paper."
  },
  19: {
    speech: "“Activity Time: 'Pick the Gate Symbol!' I will flash two symbols, choose Symbol 1 or Symbol 2 within 10 seconds!”",
    student: "Students participate in the 5-round symbol challenge."
  },
  20: {
    speech: "“Part I Quiz (Question 1): Which logic gate produces an output of 1 only if both inputs are 1? Write your answer in UPPERCASE!”",
    student: "Students write down their answer for Question 1."
  },
  21: {
    speech: "“Question 2: The output of a NOT gate with an input of 0 is blank.”",
    student: "Students write down their answer for Question 2."
  },
  22: {
    speech: "“Question 3: Which logic gate acts as the exact opposite or inverter of an AND gate?”",
    student: "Students write down their answer for Question 3."
  },
  23: {
    speech: "“Question 4: Which logic gate gives an output of 1 only when the inputs are different from each other?”",
    student: "Students write down their answer for Question 4."
  },
  24: {
    speech: "“Question 5: Which gate returns 1 if at least one input is 1?”",
    student: "Students complete Part I and prepare for the truth tables."
  },
  25: {
    speech: "“Part II (Table 1): Complete the AND Gate Truth Table! Enter the correct binary outputs.”",
    student: "Students complete the AND Gate table."
  },
  26: {
    speech: "“Part II (Table 2): Complete the OR Gate Truth Table!”",
    student: "Students complete the OR Gate table."
  },
  27: {
    speech: "“Part II (Table 3): Complete the NOT Gate Truth Table and submit your 13-item evaluation!”",
    student: "Students complete the table and submit."
  },
  28: {
    speech: "“For our next hands-on activity, please bring a printed picture of your chosen gate symbol, 1/8 illustration board, and a marker.”",
    student: "Students write down assignment requirements."
  },
  29: {
    speech: "“That's all for today! Thank you for participating, Goodbye Class!”",
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
    } else if (e.key.toLowerCase() === 'n') {
      toggleTeacherNotes();
    } else if (e.key.toLowerCase() === 'o') {
      toggleSlideOverview();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });
});
