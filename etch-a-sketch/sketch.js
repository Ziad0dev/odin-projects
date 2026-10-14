const grid = document.getElementById('grid');
const modes = ['ink', 'rainbow', 'shade'];
let mode = 0;
let size = 16;

const build = (n) => {
  grid.innerHTML = '';
  for (let i = 0; i < n * n; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.width = cell.style.height = `${100 / n}%`;
    cell.dataset.darkness = 0;
    grid.appendChild(cell);
  }
};

const paint = (cell) => {
  if (!cell.classList.contains('cell')) return;
  if (modes[mode] === 'ink') {
    cell.style.background = '#333';
  } else if (modes[mode] === 'rainbow') {
    cell.style.background = `hsl(${Math.floor(Math.random() * 360)} 80% 55%)`;
  } else {
    // Each pass darkens the cell by 10% until it is fully black
    const darkness = Math.min(10, Number(cell.dataset.darkness) + 1);
    cell.dataset.darkness = darkness;
    cell.style.background = `rgb(0 0 0 / ${darkness / 10})`;
  }
};

grid.addEventListener('mouseover', (e) => paint(e.target));
grid.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  paint(document.elementFromPoint(touch.clientX, touch.clientY));
  e.preventDefault();
}, { passive: false });

document.getElementById('size').addEventListener('click', () => {
  const answer = Number(prompt('Squares per side (1-100)?', size));
  if (Number.isInteger(answer) && answer >= 1 && answer <= 100) {
    size = answer;
    build(size);
  }
});

document.getElementById('mode').addEventListener('click', (e) => {
  mode = (mode + 1) % modes.length;
  e.target.textContent = `Mode: ${modes[mode]}`;
});

document.getElementById('clear').addEventListener('click', () => build(size));

build(size);
