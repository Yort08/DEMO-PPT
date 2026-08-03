/* Interactive Games Module: Motivation Switch Game & Pick Symbol Activity */

// Motivation Mystery Boxes State
const MysteryState = {
  box1: { a: 0, b: 0, unlocked: false, letter: 'L' },
  box2: { a: 0, b: 0, unlocked: false, letter: 'O' },
  box3: { a: 0, unlocked: false, letter: 'G' }
};

function toggleMysterySwitch(boxNum, switchKey) {
  const box = MysteryState[`box${boxNum}`];
  box[switchKey] = box[switchKey] === 1 ? 0 : 1;

  // Sound effect
  if (window.playAudioTone) window.playAudioTone(500, 0.05);

  // Check unlock condition:
  // Box 1 (AND logic): both A and B must be 1 (UP)
  if (boxNum === 1) {
    box.unlocked = box.a === 1 && box.b === 1;
  }
  // Box 2 (OR logic): at least one of A or B must be 1 (UP)
  else if (boxNum === 2) {
    box.unlocked = box.a === 1 || box.b === 1;
  }
  // Box 3 (NOT logic): A must be 0 (DOWN)
  else if (boxNum === 3) {
    box.unlocked = box.a === 0;
  }

  updateMysteryUI(boxNum);
  checkAllMysteryUnlocked();
}

function updateMysteryUI(boxNum) {
  const box = MysteryState[`box${boxNum}`];

  // Update Switches UI
  const btnA = document.getElementById(`mb${boxNum}-sw-a`);
  if (btnA) {
    btnA.classList.toggle('on', box.a === 1);
    const thumbA = btnA.querySelector('.switch-thumb');
    if (thumbA) thumbA.textContent = box.a === 1 ? 'UP' : 'DN';
  }

  const btnB = document.getElementById(`mb${boxNum}-sw-b`);
  if (btnB) {
    btnB.classList.toggle('on', box.b === 1);
    const thumbB = btnB.querySelector('.switch-thumb');
    if (thumbB) thumbB.textContent = box.b === 1 ? 'UP' : 'DN';
  }

  // Update Status Light Badge
  const statusBadge = document.getElementById(`mb${boxNum}-status`);
  const slot = document.getElementById(`mb${boxNum}-slot`);
  const wordBox = document.getElementById(`word-slot-${boxNum}`);

  if (box.unlocked) {
    if (statusBadge) {
      statusBadge.textContent = "GREEN LIGHT! Access Granted";
      statusBadge.style.color = "#00ff88";
    }
    if (slot) {
      slot.classList.add('unlocked');
      slot.textContent = box.letter;
    }
    if (wordBox) {
      wordBox.classList.add('unlocked');
      wordBox.textContent = box.letter;
    }
  } else {
    if (statusBadge) {
      statusBadge.textContent = "RED LIGHT! Access Denied";
      statusBadge.style.color = "#ff3366";
    }
    if (slot) {
      slot.classList.remove('unlocked');
      slot.textContent = '?';
    }
    if (wordBox) {
      wordBox.classList.remove('unlocked');
      wordBox.textContent = '_';
    }
  }
}

function checkAllMysteryUnlocked() {
  if (MysteryState.box1.unlocked && MysteryState.box2.unlocked && MysteryState.box3.unlocked) {
    // Reveal full word LOGIC
    const slotI = document.getElementById('word-slot-4');
    const slotC = document.getElementById('word-slot-5');
    if (slotI) { slotI.classList.add('unlocked'); slotI.textContent = 'I'; }
    if (slotC) { slotC.classList.add('unlocked'); slotC.textContent = 'C'; }

    const banner = document.getElementById('motivation-complete-banner');
    if (banner) {
      banner.style.display = 'block';
    }
  }
}

// Pick Symbol Activity Game State
const SymbolGame = {
  currentRound: 0,
  score: 0,
  timer: 10,
  timerInterval: null,
  rounds: [
    { target: 'AND Gate', correct: 1, sym1: 'AND', sym2: 'OR' },
    { target: 'NOT Gate', correct: 1, sym1: 'NOT', sym2: 'NAND' },
    { target: 'OR Gate', correct: 2, sym1: 'NOR', sym2: 'OR' },
    { target: 'NAND Gate', correct: 1, sym1: 'NAND', sym2: 'AND' },
    { target: 'EXOR Gate', correct: 2, sym1: 'EXNOR', sym2: 'EXOR' }
  ]
};

function startSymbolGame() {
  SymbolGame.currentRound = 0;
  SymbolGame.score = 0;
  loadSymbolRound();
}

function loadSymbolRound() {
  clearInterval(SymbolGame.timerInterval);
  const roundData = SymbolGame.rounds[SymbolGame.currentRound];
  if (!roundData) {
    showSymbolGameResults();
    return;
  }

  // Set Round UI
  const titleElem = document.getElementById('symbol-round-title');
  if (titleElem) titleElem.textContent = `Round ${SymbolGame.currentRound + 1}: Identify the correct ${roundData.target}`;

  const feedbackElem = document.getElementById('symbol-feedback');
  if (feedbackElem) feedbackElem.textContent = 'Select Symbol 1 or Symbol 2 within 10 seconds!';

  // Timer
  SymbolGame.timer = 10;
  const timerElem = document.getElementById('symbol-timer-num');
  if (timerElem) timerElem.textContent = SymbolGame.timer;

  SymbolGame.timerInterval = setInterval(() => {
    SymbolGame.timer--;
    if (timerElem) timerElem.textContent = SymbolGame.timer;
    if (SymbolGame.timer <= 0) {
      clearInterval(SymbolGame.timerInterval);
      selectSymbolChoice(0); // Times up!
    }
  }, 1000);
}

function selectSymbolChoice(choiceNum) {
  clearInterval(SymbolGame.timerInterval);
  const roundData = SymbolGame.rounds[SymbolGame.currentRound];
  const feedbackElem = document.getElementById('symbol-feedback');

  if (choiceNum === roundData.correct) {
    SymbolGame.score++;
    if (feedbackElem) {
      feedbackElem.textContent = '✔ Correct! Great job!';
      feedbackElem.style.color = '#00ff88';
    }
    if (window.playAudioTone) window.playAudioTone(800, 0.1);
  } else {
    if (feedbackElem) {
      feedbackElem.textContent = '✖ Incorrect or Time Expired!';
      feedbackElem.style.color = '#ff3366';
    }
    if (window.playAudioTone) window.playAudioTone(250, 0.15);
  }

  // Next round after short delay
  setTimeout(() => {
    SymbolGame.currentRound++;
    loadSymbolRound();
  }, 1500);
}

function showSymbolGameResults() {
  const container = document.getElementById('symbol-game-box');
  if (container) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px;">
        <h2 style="font-family:var(--font-heading); color:var(--accent-green); font-size:2rem; margin-bottom:12px;">Activity Complete! 🎉</h2>
        <p style="font-size:1.2rem; color:var(--text-muted);">You scored <strong style="color:var(--accent-cyan);">${SymbolGame.score} / 5</strong> in the Symbol Identification Challenge!</p>
        <button class="nav-btn" onclick="startSymbolGame()" style="margin-top:20px;">Play Again</button>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Mystery Boxes
  updateMysteryUI(1);
  updateMysteryUI(2);
  updateMysteryUI(3);
});
