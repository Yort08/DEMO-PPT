/* Interactive Games Module: Mystery Boxes & Pick Symbol Activity */

// Interactive T.R.O.Y. Rules Card Reveal Handler
function revealTroyCard(card) {
  if (!card.classList.contains('revealed')) {
    card.classList.add('revealed');
    if (window.playAudioTone) window.playAudioTone(880, 0.15);
  }
}

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
  if (window.playAudioTone) window.playAudioTone(550, 0.08);

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
  updateGlobalWordTrackers();
}

function updateMysteryUI(boxNum) {
  const box = MysteryState[`box${boxNum}`];

  // Update Switch buttons UI
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

  // Update Status Light & Letter Slot
  const statusBadge = document.getElementById(`mb${boxNum}-status`);
  const slot = document.getElementById(`mb${boxNum}-slot`);
  const bulb = document.getElementById(`mb${boxNum}-bulb`);

  if (box.unlocked) {
    if (statusBadge) {
      statusBadge.textContent = "GREEN LIGHT! ACCESS GRANTED";
      statusBadge.style.color = "#34d399";
    }
    if (slot) {
      slot.classList.add('unlocked');
      slot.textContent = box.letter;
    }
    if (bulb) {
      bulb.classList.add('on');
    }
  } else {
    if (statusBadge) {
      statusBadge.textContent = "RED LIGHT! ACCESS DENIED";
      statusBadge.style.color = "#f87171";
    }
    if (slot) {
      slot.classList.remove('unlocked');
      slot.textContent = '?';
    }
    if (bulb) {
      bulb.classList.remove('on');
    }
  }
}

// Track unlocked letters LOG up to Box 3
function updateGlobalWordTrackers() {
  const letter1 = MysteryState.box1.unlocked ? 'L' : '_';
  const letter2 = MysteryState.box2.unlocked ? 'O' : '_';
  const letter3 = MysteryState.box3.unlocked ? 'G' : '_';

  document.querySelectorAll('.word-slot-1-val').forEach(el => { el.textContent = letter1; if (letter1 !== '_') el.classList.add('unlocked'); else el.classList.remove('unlocked'); });
  document.querySelectorAll('.word-slot-2-val').forEach(el => { el.textContent = letter2; if (letter2 !== '_') el.classList.add('unlocked'); else el.classList.remove('unlocked'); });
  document.querySelectorAll('.word-slot-3-val').forEach(el => { el.textContent = letter3; if (letter3 !== '_') el.classList.add('unlocked'); else el.classList.remove('unlocked'); });
}

// Interactive Button Function on Slide 8: Reveal Full Word LOGIC
function revealFullWordLogic() {
  document.querySelectorAll('.word-slot-4-val').forEach(el => { el.textContent = 'I'; el.classList.add('unlocked'); });
  document.querySelectorAll('.word-slot-5-val').forEach(el => { el.textContent = 'C'; el.classList.add('unlocked'); });

  const completeBanner = document.getElementById('final-word-complete');
  if (completeBanner) completeBanner.style.display = 'block';

  if (window.playAudioTone) window.playAudioTone(880, 0.25);
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

  const titleElem = document.getElementById('symbol-round-title');
  if (titleElem) titleElem.textContent = `Round ${SymbolGame.currentRound + 1}: Identify the correct ${roundData.target}`;

  const feedbackElem = document.getElementById('symbol-feedback');
  if (feedbackElem) feedbackElem.textContent = 'Select Symbol 1 or Symbol 2 within 10 seconds!';

  SymbolGame.timer = 10;
  const timerElem = document.getElementById('symbol-timer-num');
  if (timerElem) timerElem.textContent = SymbolGame.timer;

  SymbolGame.timerInterval = setInterval(() => {
    SymbolGame.timer--;
    if (timerElem) timerElem.textContent = SymbolGame.timer;
    if (SymbolGame.timer <= 0) {
      clearInterval(SymbolGame.timerInterval);
      selectSymbolChoice(0);
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
      feedbackElem.style.color = '#34d399';
    }
    if (window.playAudioTone) window.playAudioTone(800, 0.1);
  } else {
    if (feedbackElem) {
      feedbackElem.textContent = '✖ Incorrect or Time Expired!';
      feedbackElem.style.color = '#f87171';
    }
    if (window.playAudioTone) window.playAudioTone(250, 0.15);
  }

  setTimeout(() => {
    SymbolGame.currentRound++;
    loadSymbolRound();
  }, 1500);
}

function showSymbolGameResults() {
  const container = document.getElementById('symbol-game-box');
  if (container) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2 style="font-family:var(--font-heading); color:var(--accent-green); font-size:3.5rem; margin-bottom:16px;">Activity Complete! 🎉</h2>
        <p style="font-size:2rem; color:var(--text-muted);">You scored <strong style="color:var(--accent-cyan);">${SymbolGame.score} / 5</strong> in the Symbol Identification Challenge!</p>
        <button class="nav-btn" onclick="startSymbolGame()" style="margin-top:28px; font-size:1.4rem; padding:16px 40px;">Play Again</button>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateMysteryUI(1);
  updateMysteryUI(2);
  updateMysteryUI(3);
  updateGlobalWordTrackers();
});
