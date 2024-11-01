
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset');

const choices = document.querySelectorAll('.choice');


let playerScore = 0;
let computerScore = 0;


function getComputerChoice() {
    const choices = ['Rock', 'Paper', 'Scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}


function playRound(playerChoice) {
    const computerChoice = getComputerChoice();

    if (playerChoice === computerChoice) {
        statusDisplay.textContent = `It's a tie! You both chose ${playerChoice}.`;
        statusDisplay.style.color = '#007bff';
        return;
    }

    let playerWins = false;

    if (
        (playerChoice === 'Rock' && computerChoice === 'Scissors') ||
        (playerChoice === 'Paper' && computerChoice === 'Rock') ||
        (playerChoice === 'Scissors' && computerChoice === 'Paper')
    ) {
        playerWins = true;
    }

    if (playerWins) {
        playerScore++;
        playerScoreDisplay.textContent = `Player: ${playerScore}`;
        statusDisplay.textContent = `You win! ${playerChoice} beats ${computerChoice}.`;
        statusDisplay.style.color = 'green';
    } else {
        computerScore++;
        computerScoreDisplay.textContent = `Computer: ${computerScore}`;
        statusDisplay.textContent = `You lose! ${computerChoice} beats ${playerChoice}.`;
        statusDisplay.style.color = 'red';
    }
}


choices.forEach(choice => {
    choice.addEventListener('click', (event) => {
        const playerChoice = event.target.id.charAt(0).toUpperCase() + event.target.id.slice(1);
        playRound(playerChoice);
    });
});


resetBtn.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = 'Player: 0';
    computerScoreDisplay.textContent = 'Computer: 0';
    statusDisplay.textContent = '';
});
