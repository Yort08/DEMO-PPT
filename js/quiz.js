/* Interactive Evaluation Quiz & Truth Table Completion Module */

const QuizData = {
  mcQuestions: [
    {
      q: "1. Which logic gate produces an output of 1 only if both inputs are 1?",
      options: ["a) OR", "b) AND", "c) NOT", "d) XOR"],
      correct: 1,
      exp: "AND Gate requires ALL inputs to be 1 to produce 1."
    },
    {
      q: "2. The output of a NOT gate with an input of 0 is:",
      options: ["a) 0", "b) 1", "c) Both", "d) Undefined"],
      correct: 1,
      exp: "NOT Gate inverts the input, so an input of 0 becomes 1."
    },
    {
      q: "3. Which logic gate acts as the exact opposite (inverter) of an AND gate?",
      options: ["a) NOR", "b) NAND", "c) XNOR", "d) OR"],
      correct: 1,
      exp: "NAND stands for NOT-AND, reversing the AND output."
    },
    {
      q: "4. An XOR (Exclusive OR) gate outputs a 1 when:",
      options: ["a) Both inputs are 1", "b) Both inputs are 0", "c) The inputs are different from each other", "d) The inputs are identical"],
      correct: 2,
      exp: "XOR produces 1 only when inputs differ (one is 1, one is 0)."
    },
    {
      q: "5. Which gate returns 1 if at least one input is 1?",
      options: ["a) OR", "b) AND", "c) NAND", "d) NOR"],
      correct: 0,
      exp: "OR Gate outputs 1 if ANY input is 1."
    }
  ],
  truthTableQuestions: [
    { gate: 'AND', a: 1, b: 1, userAns: null, correct: 1 },
    { gate: 'OR', a: 0, b: 1, userAns: null, correct: 1 },
    { gate: 'NOT', a: 1, b: 0, userAns: null, correct: 0 },
    { gate: 'NAND', a: 1, b: 1, userAns: null, correct: 0 },
    { gate: 'NOR', a: 0, b: 0, userAns: null, correct: 1 }
  ]
};

let userMCAnswers = Array(QuizData.mcQuestions.length).fill(null);

function renderQuiz() {
  const container = document.getElementById('quiz-questions-box');
  if (!container) return;

  let html = '';
  QuizData.mcQuestions.forEach((q, idx) => {
    html += `
      <div class="feature-card" style="margin-bottom:16px;">
        <h4 style="color:#fff; font-size:1.1rem; margin-bottom:12px;">${q.q}</h4>
        <div class="grid-2" style="gap:10px;">
    `;

    q.options.forEach((opt, oIdx) => {
      const isSelected = userMCAnswers[idx] === oIdx;
      html += `
        <div class="quiz-option ${isSelected ? 'selected' : ''}" onclick="selectQuizAnswer(${idx}, ${oIdx})">
          <span>${opt}</span>
        </div>
      `;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
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
      <h3 style="color:var(--accent-green); font-family:var(--font-heading); font-size:1.6rem; margin-bottom:8px;">Evaluation Submitted! 🎉</h3>
      <p style="font-size:1.2rem; color:#fff;">Your Score: <strong style="color:var(--accent-cyan);">${totalScore} / ${maxScore}</strong> Points</p>
      <p style="color:var(--text-muted); margin-top:6px;">Excellent job completing the Logic Gates Evaluation Quiz!</p>
    `;
    resultsBox.scrollIntoView({ behavior: 'smooth' });
  }

  if (window.playAudioTone) window.playAudioTone(880, 0.2);
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
});
