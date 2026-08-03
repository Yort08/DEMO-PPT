/* Interactive Evaluation Quiz & Truth Table Completion Module - Max Font Screen-Filling Layout */

const QuizData = {
  mcQuestions: [
    {
      q: "1. Which logic gate produces an output of 1 only if both inputs are 1?",
      options: ["a) OR Gate", "b) AND Gate", "c) NOT Gate", "d) XOR Gate"],
      correct: 1,
      exp: "AND Gate requires ALL inputs to be 1 to produce 1."
    },
    {
      q: "2. The output of a NOT gate with an input of 0 is:",
      options: ["a) Output Y = 0", "b) Output Y = 1", "c) Both 0 and 1", "d) Undefined Signal"],
      correct: 1,
      exp: "NOT Gate inverts the input, so an input of 0 becomes 1."
    },
    {
      q: "3. Which logic gate acts as the exact opposite (inverter) of an AND gate?",
      options: ["a) NOR Gate", "b) NAND Gate", "c) XNOR Gate", "d) OR Gate"],
      correct: 1,
      exp: "NAND stands for NOT-AND, reversing the AND output."
    },
    {
      q: "4. An XOR (Exclusive OR) gate outputs a 1 when:",
      options: ["a) Both inputs are 1", "b) Both inputs are 0", "c) The inputs are DIFFERENT", "d) The inputs are IDENTICAL"],
      correct: 2,
      exp: "XOR produces 1 only when inputs differ (one is 1, one is 0)."
    },
    {
      q: "5. Which gate returns 1 if at least one input is 1?",
      options: ["a) OR Gate", "b) AND Gate", "c) NAND Gate", "d) NOR Gate"],
      correct: 0,
      exp: "OR Gate outputs 1 if ANY input is 1."
    }
  ],
  truthTableQuestions: [
    { gate: 'AND', a: 1, b: 1, label: 'AND Gate (A=1, B=1) ➔ Y =', correct: 1 },
    { gate: 'OR', a: 0, b: 1, label: 'OR Gate (A=0, B=1) ➔ Y =', correct: 1 },
    { gate: 'NOT', a: 1, b: null, label: 'NOT Gate (Input A=1) ➔ Y =', correct: 0 },
    { gate: 'NAND', a: 1, b: 1, label: 'NAND Gate (A=1, B=1) ➔ Y =', correct: 0 },
    { gate: 'NOR', a: 0, b: 0, label: 'NOR Gate (A=0, B=0) ➔ Y =', correct: 1 }
  ]
};

let currentQIdx = 0;
let userMCAnswers = Array(QuizData.mcQuestions.length).fill(null);

function renderQuiz() {
  const container = document.getElementById('quiz-questions-box');
  if (!container) return;

  const currentQ = QuizData.mcQuestions[currentQIdx];

  let html = `
    <!-- Top Question Tabs -->
    <div style="display:flex; justify-content:center; gap:16px; margin-bottom:24px;">
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
      <button onclick="switchQuizQ(${idx})" style="${btnStyle} font-family:var(--font-heading); font-size:1.6rem; padding:12px 32px; border-radius:14px; cursor:pointer;">
        Q${idx + 1} ${isAnswered ? '✓' : ''}
      </button>
    `;
  });

  html += `</div>

    <!-- Active Question Card -->
    <div class="feature-card" style="padding:40px; border-color:var(--accent-cyan); height:100%; justify-content:space-around;">
      <h3 style="color:var(--accent-cyan); font-size:2.8rem; font-weight:900; line-height:1.2; margin-bottom:24px;">
        ${currentQ.q}
      </h3>

      <div class="grid-2" style="gap:24px;">
  `;

  currentQ.options.forEach((opt, oIdx) => {
    const isSelected = userMCAnswers[currentQIdx] === oIdx;
    html += `
      <div class="quiz-option ${isSelected ? 'selected' : ''}" onclick="selectQuizAnswer(${currentQIdx}, ${oIdx})" style="padding:28px 36px; font-size:2.4rem; font-weight:700; border-radius:20px;">
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
  renderQuiz();
}

function selectQuizAnswer(qIdx, oIdx) {
  userMCAnswers[qIdx] = oIdx;
  if (window.playAudioTone) window.playAudioTone(600, 0.05);
  renderQuiz();
}

function submitQuiz() {
  let score = 0;
  QuizData.mcQuestions.forEach((q, idx) => {
    if (userMCAnswers[idx] === q.correct) score++;
  });

  // Check Truth table answers
  QuizData.truthTableQuestions.forEach(item => {
    const inputElem = document.getElementById(`tt-q-${item.gate}`);
    if (inputElem && parseInt(inputElem.value) === item.correct) {
      score++;
    }
  });

  const totalScore = score;
  const maxScore = QuizData.mcQuestions.length + QuizData.truthTableQuestions.length;

  const resultsBox = document.getElementById('quiz-results-banner');
  if (resultsBox) {
    resultsBox.style.display = 'block';
    resultsBox.innerHTML = `
      <h2 style="color:var(--accent-green); font-family:var(--font-heading); font-size:3.5rem; font-weight:900; margin-bottom:12px;">Evaluation Submitted! 🎉</h2>
      <p style="font-size:2.4rem; color:#fff;">Your Score: <strong style="color:var(--accent-cyan); font-size:3rem;">${totalScore} / ${maxScore}</strong> Points</p>
      <p style="color:var(--text-muted); font-size:1.8rem; margin-top:10px;">Excellent job completing the Logic Gates Evaluation Quiz!</p>
    `;
    resultsBox.scrollIntoView({ behavior: 'smooth' });
  }

  if (window.playAudioTone) window.playAudioTone(880, 0.2);
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
});
