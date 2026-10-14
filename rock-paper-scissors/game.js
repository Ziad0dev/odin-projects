const CHOICES = ['rock', 'paper', 'scissors'];
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const WINNING_SCORE = 5;

let humanScore = 0;
let computerScore = 0;

const getComputerChoice = () => CHOICES[Math.floor(Math.random() * CHOICES.length)];

// Returns 'human', 'computer' or 'tie'
const playRound = (human, computer) => {
  if (human === computer) return 'tie';
  return BEATS[human] === computer ? 'human' : 'computer';
};

const roundText = document.getElementById('round');
const scoreText = document.getElementById('score');
const resetButton = document.getElementById('reset');
const buttons = document.querySelectorAll('[data-choice]');

const render = () => {
  scoreText.textContent = `You ${humanScore} – ${computerScore} Computer`;
  const over = humanScore === WINNING_SCORE || computerScore === WINNING_SCORE;
  buttons.forEach((b) => { b.disabled = over; });
  resetButton.hidden = !over;
  if (over) roundText.textContent = humanScore > computerScore ? 'You won the game! 🎉' : 'The computer won the game.';
};

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const human = button.dataset.choice;
    const computer = getComputerChoice();
    const winner = playRound(human, computer);
    if (winner === 'human') humanScore++;
    if (winner === 'computer') computerScore++;
    roundText.textContent = winner === 'tie'
      ? `Both picked ${human}. Tie!`
      : winner === 'human'
        ? `${human} beats ${computer}. You win this round!`
        : `${computer} beats ${human}. You lose this round.`;
    render();
  });
});

resetButton.addEventListener('click', () => {
  humanScore = 0;
  computerScore = 0;
  roundText.textContent = '';
  render();
});
