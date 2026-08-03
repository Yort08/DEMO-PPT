/* Interactive Evaluation Quiz Module - Dedicated Part I & Part II Slides */

const QuizData = {
  mcQuestions: [
    {
      q: "1. Which logic gate produces an output of 1 only if both inputs are 1?",
      options: ["a) OR Gate", "b) AND Gate", "c) NOT Gate", "d) XOR Gate"],
      correct: 1
    },
    {
      q: "2. The output of a NOT gate with an input of 0 is:",
      options: ["a) Output Y = 0", "b) Output Y = 1", "c) Both 0 and 1", "d) Undefined Signal"],
      correct: 1
    },
    {
      q: "3. Which logic gate acts as the exact opposite (inverter) of an AND gate?",
      options: ["a) NOR Gate", "b) NAND Gate", "c) XNOR Gate", "d) OR Gate"],
      correct: 1
    },
    {
      q: "4. An XOR (Exclusive OR) gate outputs a 1 when:",
      options: ["a) Both inputs are 1", "b) Both inputs are 0", "c) The inputs are DIFFERENT", "d) The inputs are IDENTICAL"],
      correct: 2
    },
    {
      q: "5. Which gate returns 1 if at least one input is 1?",
      options: ["a) OR Gate", "b) AND Gate", "c) NAND Gate", "d) NOR Gate"],
      correct: 0
    }
  ],
  truthTableQuestions: [
    // AND Gate Truth Table (4 pts)
    { id: 'tt-and-00', gate: 'AND', a: 0, b: 0, correct: 0 },
    { id: 'tt-and-01', gate: 'AND', a: 0, b: 1, correct: 0 },
    { id: 'tt-and-10', gate: 'AND', a: 1, b: 0, correct: 0 },
    { id: 'tt-and-11', gate: 'AND', a: 1, b: 1, correct: 1 },
    // OR Gate Truth Table (4 pts)
    { id: 'tt-or-00', gate: 'OR', a: 0, b: 0, correct: 0 },
    { id: 'tt-or-01', gate: 'OR', a: 0, b: 1, correct: 1 },
    { id: 'tt-or-10', gate: 'OR', a: 1, b: 0, correct: 1 },
    { id: 'tt-or-11', gate: 'OR', a: 1, b: 1, correct: 1 },
    // NOT Gate Truth Table (2 pts)
    { id: 'tt-not-0', gate: 'NOT', a: 0, b: null, correct: 1 },
    { id: 'tt-not-1', gate: 'NOT', a: 1, b: null, correct: 0 }
  ]
};

let currentQIdx = 0;
let userMCAnswers = Array(QuizData.mcQuestions.length).fill(null);

function renderQuizPart1() {
  const container = document.getElementById('quiz-questions-box');
  if (!container) return;

  const currentQ = QuizData.mcQuestions[currentQIdx];

  let html = `
    <!-- Top Question Tabs -->
    <div style="display:flex; justify-content:center; gap:20px; margin-bottom:28px;">
  `;

  QuizData.mcQuestions.forEach((_, idx) => {
    const isCurrent = idx === currentQIdx;
    const isAnswered = userMCAnswers[idx] !== null;
    let btnStyle = "background: rgba(255, 255, 255, 0.08); border: 2px solid rgba(255, 255, 255, 0.2); color: #fff;";
    if (isCurrent) {
      btnStyle = "background: var(--accent-cyan); border: 2px solid var(--accent-cyan); color: #0f172a; font-weight:900;";
    } else if (isAnswered) {
      btnStyle = "background: rgba(52, 211, 153, 0.25); border: 2px solid var(--accent-green); color: var(--accent-green);";
    }

    html += `
      <button onclick="switchQuizQ(${idx})" style="${btnStyle} font-family:var(--font-heading); font-size:1.8rem; padding:14px 36px; border-radius:16px; cursor:pointer;">
        Q${idx + 1} ${isAnswered ? '✓' : ''}
      </button>
    `;
  });

  html += `</div>

    <!-- Active Question Card (Fills 100% Screen) -->
    <div class="feature-card" style="padding:48px; border-color:var(--accent-cyan); height:100%; justify-content:space-around;">
      <h3 style="color:var(--accent-cyan); font-size:3.2rem; font-weight:900; line-height:1.2; margin-bottom:28px;">
        ${currentQ.q}
      </h3>

      <div class="grid-2" style="gap:28px;">
  `;

  currentQ.options.forEach((opt, oIdx) => {
    const isSelected = userMCAnswers[currentQIdx] === oIdx;
    html += `
      <div class="quiz-option ${isSelected ? 'selected' : ''}" onclick="selectQuizAnswer(${currentQIdx}, ${oIdx})" style="padding:32px 40px; font-size:2.6rem; font-weight:700; border-radius:24px; min-height:120px; display:flex; align-items:center;">
        <span>${opt}</span>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function switchQuizQ(qIdx) {
  currentQIdx = qIdx;
  if (window.playAudioTone) window.playAudioTone(500, 0.05);
  renderQuizPart1();
}

function selectQuizAnswer(qIdx, oIdx) {
  userMCAnswers[qIdx] = oIdx;
  if (window.playAudioTone) window.playAudioTone(600, 0.05);
  renderQuizPart1();
}

function submitPart1() {
  let score = 0;
  QuizData.mcQuestions.forEach((q, idx) => {
    if (userMCAnswers[idx] === q.correct) score++;
  });

  const banner = document.getElementById('part1-results-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.innerHTML = `
      <h2 style="color:var(--accent-green); font-family:var(--font-heading); font-size:3.2rem; font-weight:900;">Part I Completed! 🎉</h2>
      <p style="font-size:2.2rem; color:#fff; margin-top:8px;">Part I Score: <strong style="color:var(--accent-cyan); font-size:2.6rem;">${score} / 5</strong> Points</p>
    `;
  }
  if (window.playAudioTone) window.playAudioTone(880, 0.2);
}

function submitPart2() {
  let score = 0;
  QuizData.truthTableQuestions.forEach(item => {
    const inputElem = document.getElementById(item.id);
    if (inputElem && parseInt(inputElem.value) === item.correct) {
      score++;
    }
  });

  let part1Score = 0;
  QuizData.mcQuestions.forEach((q, idx) => {
    if (userMCAnswers[idx] === q.correct) part1Score++;
  });

  const totalScore = part1Score + score;

  const banner = document.getElementById('part2-results-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.innerHTML = `
      <h2 style="color:var(--accent-green); font-family:var(--font-heading); font-size:3.5rem; font-weight:900;">Evaluation Quiz Submitted! 🎉</h2>
      <p style="font-size:2.5rem; color:#fff; margin-top:10px;">
        Part I: <strong style="color:var(--accent-cyan);">${part1Score} / 5</strong> &nbsp;|&nbsp; 
        Part II: <strong style="color:var(--accent-green);">${score} / 10</strong> &nbsp;|&nbsp; 
        Total: <strong style="color:var(--accent-amber); font-size:3.2rem;">${totalScore} / 15</strong>
      </p>
    `;
  }
  if (window.playAudioTone) window.playAudioTone(880, 0.2);
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuizPart1();
});
