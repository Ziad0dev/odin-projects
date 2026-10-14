const operate = (op, a, b) => {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
};

// Round away float noise like 0.1 + 0.2 = 0.30000000000000004
const format = (n) => (Number.isFinite(n) ? String(Number(n.toPrecision(12))) : 'Nope, no ÷0');

const state = { current: '0', previous: null, op: null, fresh: true };
const display = document.getElementById('display');
const render = () => { display.textContent = state.current; };

const inputDigit = (d) => {
  if (state.fresh || state.current === '0') {
    state.current = d;
    state.fresh = false;
  } else {
    state.current += d;
  }
};

const inputDot = () => {
  if (state.fresh) {
    state.current = '0.';
    state.fresh = false;
  } else if (!state.current.includes('.')) {
    state.current += '.';
  }
};

const evaluate = () => {
  if (state.op === null || state.previous === null) return;
  state.current = format(operate(state.op, state.previous, Number(state.current)));
  state.previous = null;
  state.op = null;
  state.fresh = true;
};

const chooseOp = (op) => {
  // Chained ops evaluate one pair at a time: 12 + 7 - becomes 19 -
  if (state.op !== null && !state.fresh) evaluate();
  state.previous = Number(state.current);
  state.op = op;
  state.fresh = true;
};

const actions = {
  clear: () => Object.assign(state, { current: '0', previous: null, op: null, fresh: true }),
  back: () => {
    if (state.fresh) return;
    state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
  },
  percent: () => { state.current = format(Number(state.current) / 100); },
  dot: inputDot,
  equals: evaluate,
};

document.querySelector('.keys').addEventListener('click', (e) => {
  const { digit, op, action } = e.target.dataset;
  if (digit !== undefined) inputDigit(digit);
  else if (op) chooseOp(op);
  else if (action) actions[action]();
  render();
});

const keyMap = { Enter: 'equals', '=': 'equals', Backspace: 'back', Escape: 'clear', '.': 'dot', '%': 'percent' };
document.addEventListener('keydown', (e) => {
  if (/^\d$/.test(e.key)) inputDigit(e.key);
  else if ('+-*/'.includes(e.key)) chooseOp(e.key);
  else if (keyMap[e.key]) actions[keyMap[e.key]]();
  else return;
  e.preventDefault();
  render();
});
