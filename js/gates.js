/* Interactive Logic Gate Simulator Engine */

// State of each gate simulator
const GateState = {
  and: { a: 0, b: 0, out: 0 },
  or: { a: 0, b: 0, out: 0 },
  not: { a: 0, out: 1 },
  nand: { a: 0, b: 0, out: 1 },
  nor: { a: 0, b: 0, out: 1 },
  exor: { a: 0, b: 0, out: 0 },
  exnor: { a: 0, b: 0, out: 1 }
};

// Evaluate gate output based on logic rules
function evaluateGate(gateType, state) {
  switch (gateType) {
    case 'and':
      return state.a === 1 && state.b === 1 ? 1 : 0;
    case 'or':
      return state.a === 1 || state.b === 1 ? 1 : 0;
    case 'not':
      return state.a === 1 ? 0 : 1;
    case 'nand':
      return state.a === 1 && state.b === 1 ? 0 : 1;
    case 'nor':
      return state.a === 0 && state.b === 0 ? 1 : 0;
    case 'exor':
      return state.a !== state.b ? 1 : 0;
    case 'exnor':
      return state.a === state.b ? 1 : 0;
    default:
      return 0;
  }
}

// Toggle switch for a gate
function toggleSwitch(gateType, inputKey) {
  const state = GateState[gateType];
  state[inputKey] = state[inputKey] === 1 ? 0 : 1;

  // Update output
  state.out = evaluateGate(gateType, state);

  // Play click sound
  if (window.playAudioTone) {
    window.playAudioTone(state[inputKey] ? 600 : 400, 0.05);
  }

  // Update UI Elements
  updateGateUI(gateType);
}

// Update UI elements (Switches, SVG Signal lines, Output bulb, Truth Table)
function updateGateUI(gateType) {
  const state = GateState[gateType];

  // Update Switch buttons visual
  if (state.a !== undefined) {
    const btnA = document.getElementById(`sw-${gateType}-a`);
    if (btnA) {
      btnA.classList.toggle('on', state.a === 1);
      const thumbA = btnA.querySelector('.switch-thumb');
      if (thumbA) thumbA.textContent = state.a;
    }
  }

  if (state.b !== undefined) {
    const btnB = document.getElementById(`sw-${gateType}-b`);
    if (btnB) {
      btnB.classList.toggle('on', state.b === 1);
      const thumbB = btnB.querySelector('.switch-thumb');
      if (thumbB) thumbB.textContent = state.b;
    }
  }

  // Update SVG Signal Wire Colors
  const lineA = document.getElementById(`line-${gateType}-a`);
  if (lineA) lineA.style.stroke = state.a === 1 ? '#00f3ff' : '#334155';

  const lineB = document.getElementById(`line-${gateType}-b`);
  if (lineB) lineB.style.stroke = state.b === 1 ? '#00f3ff' : '#334155';

  const lineOut = document.getElementById(`line-${gateType}-out`);
  if (lineOut) lineOut.style.stroke = state.out === 1 ? '#00ff88' : '#334155';

  // Update Gate Body Fill Glow
  const gateBody = document.getElementById(`gate-body-${gateType}`);
  if (gateBody) {
    gateBody.style.fill = state.out === 1 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(15, 23, 42, 0.8)';
    gateBody.style.stroke = state.out === 1 ? '#00ff88' : '#00f3ff';
  }

  // Update Output Bulb & Value Badge
  const bulb = document.getElementById(`bulb-${gateType}`);
  if (bulb) {
    bulb.classList.toggle('on', state.out === 1);
  }

  const outVal = document.getElementById(`out-val-${gateType}`);
  if (outVal) {
    outVal.textContent = state.out;
    outVal.style.color = state.out === 1 ? '#00ff88' : '#94a3b8';
  }

  // Highlight corresponding row in Truth Table
  updateTruthTableHighlight(gateType, state);
}

// Highlight matching row in the Truth Table
function updateTruthTableHighlight(gateType, state) {
  const table = document.getElementById(`table-${gateType}`);
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    row.classList.remove('active-row');
    const rowA = parseInt(row.getAttribute('data-a'));
    const rowB = parseInt(row.getAttribute('data-b'));

    if (gateType === 'not') {
      if (rowA === state.a) row.classList.add('active-row');
    } else {
      if (rowA === state.a && rowB === state.b) row.classList.add('active-row');
    }
  });
}

// Initialize all gate simulators on slide load
document.addEventListener('DOMContentLoaded', () => {
  const gates = ['and', 'or', 'not', 'nand', 'nor', 'exor', 'exnor'];
  gates.forEach(g => {
    GateState[g].out = evaluateGate(g, GateState[g]);
    updateGateUI(g);
  });
});
