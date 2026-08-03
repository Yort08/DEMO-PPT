/* Interactive Games Module: Mystery Boxes & Pick Symbol Activity */

// Interactive T.R.O.Y. Rules Card Reveal Handler
function revealTroyCard(card) {
  if (!card.classList.contains('revealed')) {
    card.classList.add('revealed');
    if (window.playAudioTone) window.playAudioTone(880, 0.15);
  }
}

// Slide 4 Interactive Topic Reveal Handler
function revealRecapTopic() {
  const btn = document.getElementById('recap-reveal-btn');
  const topic = document.getElementById('recap-topic-text');
  if (btn) btn.style.display = 'none';
  if (topic) {
    topic.style.display = 'block';
    topic.style.opacity = '1';
  }
  if (window.playAudioTone) window.playAudioTone(880, 0.2);
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

// Returns SVG inner paths for a given gate type
function gateSVG(type, color) {
  const c = color;
  const fill = `${c}33`;
  switch(type) {
    case 'AND':
      return `<path d="M 40,20 L 100,20 A 40,40 0 0,1 100,100 L 40,100 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="40" x2="40" y2="40" stroke="${c}" stroke-width="4"/>
              <line x1="10" y1="80" x2="40" y2="80" stroke="${c}" stroke-width="4"/>
              <line x1="140" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    case 'OR':
      return `<path d="M 40,20 Q 65,60 40,100 Q 100,100 150,60 Q 100,20 40,20 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="38" x2="55" y2="38" stroke="${c}" stroke-width="4"/>
              <line x1="10" y1="82" x2="55" y2="82" stroke="${c}" stroke-width="4"/>
              <line x1="150" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    case 'NOT':
      return `<path d="M 40,20 L 40,100 L 140,60 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <circle cx="150" cy="60" r="10" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="60" x2="40" y2="60" stroke="${c}" stroke-width="4"/>
              <line x1="160" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    case 'NAND':
      return `<path d="M 40,20 L 100,20 A 40,40 0 0,1 100,100 L 40,100 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <circle cx="150" cy="60" r="10" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="40" x2="40" y2="40" stroke="${c}" stroke-width="4"/>
              <line x1="10" y1="80" x2="40" y2="80" stroke="${c}" stroke-width="4"/>
              <line x1="160" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    case 'NOR':
      return `<path d="M 40,20 Q 65,60 40,100 Q 100,100 150,60 Q 100,20 40,20 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <circle cx="160" cy="60" r="10" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="38" x2="55" y2="38" stroke="${c}" stroke-width="4"/>
              <line x1="10" y1="82" x2="55" y2="82" stroke="${c}" stroke-width="4"/>
              <line x1="170" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    case 'EXOR':
      return `<path d="M 40,20 Q 65,60 40,100 Q 100,100 150,60 Q 100,20 40,20 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <path d="M 28,20 Q 53,60 28,100" fill="none" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="38" x2="50" y2="38" stroke="${c}" stroke-width="4"/>
              <line x1="10" y1="82" x2="50" y2="82" stroke="${c}" stroke-width="4"/>
              <line x1="150" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    case 'EXNOR':
      return `<path d="M 40,20 Q 65,60 40,100 Q 100,100 150,60 Q 100,20 40,20 Z" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <path d="M 28,20 Q 53,60 28,100" fill="none" stroke="${c}" stroke-width="5"/>
              <circle cx="160" cy="60" r="10" fill="${fill}" stroke="${c}" stroke-width="5"/>
              <line x1="10" y1="38" x2="50" y2="38" stroke="${c}" stroke-width="4"/>
              <line x1="10" y1="82" x2="50" y2="82" stroke="${c}" stroke-width="4"/>
              <line x1="170" y1="60" x2="190" y2="60" stroke="${c}" stroke-width="4"/>`;
    default:
      return '';
  }
}

function startSymbolGame() {
  SymbolGame.currentRound = 0;
  SymbolGame.score = 0;
  loadSymbolRound();
}

function loadSymbolRound() {
  clearInterval(SymbolGame.timerInterval);
  const roundData = SymbolGame.rounds[SymbolGame.currentRound];
  if (!roundData) { showSymbolGameResults(); return; }

  // Update title
  const titleElem = document.getElementById('symbol-round-title');
  if (titleElem) titleElem.textContent = `Round ${SymbolGame.currentRound + 1}: Identify the correct ${roundData.target}`;

  // Inject correct SVG shapes
  const svg1 = document.getElementById('sym-svg-1');
  const svg2 = document.getElementById('sym-svg-2');
  if (svg1) svg1.innerHTML = gateSVG(roundData.sym1, '#38bdf8');
  if (svg2) svg2.innerHTML = gateSVG(roundData.sym2, '#a78bfa');

  // Reset card borders
  const card1 = document.getElementById('sym-card-1');
  const card2 = document.getElementById('sym-card-2');
  if (card1) { card1.style.borderColor = 'var(--accent-cyan)'; card1.style.background = 'rgba(56,189,248,0.07)'; }
  if (card2) { card2.style.borderColor = 'var(--accent-purple)'; card2.style.background = 'rgba(167,139,250,0.07)'; }

  // Show Start button, hide others
  const startBtn = document.getElementById('sym-start-btn');
  const answerBtn = document.getElementById('sym-answer-btn');
  const nextBtn = document.getElementById('sym-next-btn');
  const timerDisplay = document.getElementById('symbol-timer-display');
  const feedback = document.getElementById('symbol-feedback');
  if (startBtn) startBtn.style.display = 'inline-block';
  if (answerBtn) answerBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (timerDisplay) timerDisplay.style.display = 'none';
  if (feedback) { feedback.style.display = 'none'; feedback.textContent = ''; }

  const timerNum = document.getElementById('symbol-timer-num');
  if (timerNum) timerNum.textContent = '10';
}

function startSymbolTimer() {
  const startBtn = document.getElementById('sym-start-btn');
  const timerDisplay = document.getElementById('symbol-timer-display');
  const timerNum = document.getElementById('symbol-timer-num');
  if (startBtn) startBtn.style.display = 'none';
  if (timerDisplay) timerDisplay.style.display = 'block';

  SymbolGame.timer = 10;
  if (timerNum) timerNum.textContent = SymbolGame.timer;

  clearInterval(SymbolGame.timerInterval);
  SymbolGame.timerInterval = setInterval(() => {
    SymbolGame.timer--;
    if (timerNum) timerNum.textContent = SymbolGame.timer;
    if (SymbolGame.timer <= 0) {
      clearInterval(SymbolGame.timerInterval);
      // Show Reveal Answer button
      const answerBtn = document.getElementById('sym-answer-btn');
      if (answerBtn) answerBtn.style.display = 'inline-block';
      if (timerDisplay) timerDisplay.style.display = 'none';
    }
  }, 1000);
}

function revealSymbolAnswer() {
  const roundData = SymbolGame.rounds[SymbolGame.currentRound];
  const answerBtn = document.getElementById('sym-answer-btn');
  const nextBtn = document.getElementById('sym-next-btn');
  const feedback = document.getElementById('symbol-feedback');
  const card1 = document.getElementById('sym-card-1');
  const card2 = document.getElementById('sym-card-2');

  if (answerBtn) answerBtn.style.display = 'none';

  // Highlight correct card green, wrong card dim
  if (roundData.correct === 1) {
    if (card1) { card1.style.borderColor = '#34d399'; card1.style.background = 'rgba(52,211,153,0.18)'; }
    if (card2) { card2.style.opacity = '0.35'; }
    if (feedback) { feedback.textContent = `✅ SYMBOL 1 is the ${roundData.target}!`; feedback.style.color = '#34d399'; feedback.style.display = 'block'; }
  } else {
    if (card2) { card2.style.borderColor = '#34d399'; card2.style.background = 'rgba(52,211,153,0.18)'; }
    if (card1) { card1.style.opacity = '0.35'; }
    if (feedback) { feedback.textContent = `✅ SYMBOL 2 is the ${roundData.target}!`; feedback.style.color = '#34d399'; feedback.style.display = 'block'; }
  }

  if (nextBtn) nextBtn.style.display = 'inline-block';
  if (window.playAudioTone) window.playAudioTone(800, 0.15);
}

function nextSymbolRound() {
  SymbolGame.currentRound++;
  loadSymbolRound();
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
