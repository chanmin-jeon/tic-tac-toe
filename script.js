/* game board object */ 
const gameBoard = ( () => {

    let gameArray = [];
    const boardWebDisplay = document.querySelector('#game-board')

    const createBoard = () => {
        for (let i = 0; i < 3; i++) {
            let rowArray = []; 
            let rowDisplay = document.createElement('div'); 
            rowDisplay.classList.toggle('row'); 
            for (let j = 0; j < 3; j++) {
                let squareDisplay = document.createElement('div'); 
                squareDisplay.classList.toggle('square'); 
                squareDisplay.setAttribute('data-pressed','empty');
                squareDisplay.textContent = ''; 
                rowArray.push(squareDisplay);
                rowDisplay.append(squareDisplay); 
            }
            gameArray.push(rowArray); 
            boardWebDisplay.append(rowDisplay); 
        }
    }

    const getBoard = () => {
        return gameArray; 
    }

    const checkWin = (userMarker) => {
        gameWon = false; 
        if ((gameArray[0][0].textContent === userMarker && gameArray[0][1].textContent === userMarker && gameArray[0][2].textContent === userMarker) ||
            (gameArray[0][0].textContent === userMarker && gameArray[1][0].textContent === userMarker && gameArray[2][0].textContent === userMarker) ||
            (gameArray[2][0].textContent === userMarker && gameArray[2][1].textContent === userMarker && gameArray[2][2].textContent === userMarker) ||
            (gameArray[2][2].textContent === userMarker && gameArray[1][2].textContent === userMarker && gameArray[0][2].textContent === userMarker) ||
            (gameArray[0][0].textContent === userMarker && gameArray[1][1].textContent === userMarker && gameArray[2][2].textContent === userMarker) ||
            (gameArray[2][0].textContent === userMarker && gameArray[1][1].textContent === userMarker && gameArray[0][2].textContent === userMarker)) {
                gameWon = true; 
            }
        return gameWon; 
    }

    const checkTie = () => {
        let tieGame = true; 
        for (let i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++){
                if (gameArray[i][j].getAttribute('data-pressed') === 'empty') {
                    tieGame = false; 
                }
            }
        }
        return tieGame; 
    }
    const resetBoard = () => {
        gameArray = []; 
        boardWebDisplay.innerHTML = ''; 
        createBoard(); 
    }
    return {createBoard, getBoard, checkWin, checkTie, resetBoard}; 
})(); 

/* player object */ 
function createPlayer (name,marker) {
    return {
        name: name,
        marker: marker
    }; 
}

/* game controller object */ 
const gameController = ( () => {

    let playersArray = [];
    let currentPlayerIndex = 0; 

    const startGame = () => {
        document.querySelector('#player-modal').showModal(); 
        document.querySelector('#player-form').addEventListener('submit', (event) => {
            event.preventDefault(); 
            const player1name = document.querySelector('#player-1-name').value;
            const player2name = document.querySelector('#player-2-name').value;
            const player1 = createPlayer(player1name, 'X');
            const player2 = createPlayer(player2name, 'O');
            playersArray.push(player1); 
            playersArray.push(player2); 
            document.querySelector('#player-modal').close(); 
            document.querySelector('#player-form').reset(); 
        });
    
    }
    const playGame = () => {
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                let currentSquare = gameBoard.getBoard()[i][j];
                    currentSquare.addEventListener('click', () => {
                        let currentPlayer = playersArray[currentPlayerIndex];
                        if (currentSquare.getAttribute('data-pressed') !== 'empty') {
                            alert(`Square has already been clicked!\nPlease choose another square`); 
                        } else {
                            currentSquare.setAttribute('style','background-color:lightgrey');
                            currentSquare.textContent = `${currentPlayer.marker}`;  
                            currentSquare.setAttribute('data-pressed',`${currentPlayer.name}`); 
                        }
                        if (gameBoard.checkTie() === true || gameBoard.checkWin(currentPlayer.marker) === true) {
                            if (gameBoard.checkTie()) {
                                playersArray = []; 
                                currentPlayerIndex =  0;
                                resetGame('tie', null); 
                            } else {
                                playersArray = []; 
                                currentPlayerIndex =  0;
                                resetGame('win', currentPlayer.name); 
                            }
                        }
                        currentPlayerIndex += 1; 
                        currentPlayerIndex = currentPlayerIndex % 2; 
                })
            }
        }
    }

    const resetGame = (winCondition, winner) => {
        // show play again modal 
        const newGameModal = document.querySelector('#replay-game'); 
        const gameOverMessage = document.querySelector('#game-over-message'); 
        const newGameForm = document.querySelector('#replay-form'); 
        if (winCondition === 'tie') {
            gameOverMessage.textContent = 'Tie Game'
        }
        else if (winCondition === 'win') {
            gameOverMessage.textContent = `${winner} has won the game!`; 
        }
        newGameModal.showModal(); 
        newGameForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            newGameModal.close(); 
            newGameForm.reset(); 
            gameBoard.resetBoard(); 
            gameController.startGame(); 
            gameController.playGame(); 

        }); 
    }

    return {startGame, playGame, resetGame}; 
})(); 

gameBoard.createBoard(); 
gameController.startGame(); 
gameController.playGame(); 








