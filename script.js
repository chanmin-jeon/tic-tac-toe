/* game board object */ 
const gameBoard = ( () => {

    let gameArray = [];
    const boardWebDisplay = document.querySelector('#game-board')

    const createBoard = () => {
        for (let i = 0; i < 3; i++) {
            let rowArray = []; 
            let rowDisplay = document.createElement('div'); 
            rowDisplay.classList.add('row'); 
            for (let j = 0; j < 3; j++) {
                let squareDisplay = document.createElement('div'); 
                squareDisplay.classList.add('square'); 
                squareDisplay.setAttribute('data-pressed', 'empty');
                squareDisplay.textContent = ''; 
                // Base border style for internal borders
                let border = 'border: 5px solid purple;';
    
                // Remove borders for edge squares
                if (i === 0) {
                    border += ' border-top: none;';
                    if (j === 0) {
                        border += ' border-left: none;'
                    } 
                    if (j === 2) {
                        border += ' border-right: none'
                    }
                } 
                if (i === 1) {
                    if (j === 0) {
                        border += ' border-left: none;'
                    } 
                    if (j === 2) {
                        border += ' border-right: none'
                    }
                }
                if (i === 2) {
                    border += ' border-bottom: none;';
                    if (j === 0) {
                        border += ' border-left: none;'
                    } 
                    if (j === 2) {
                        border += ' border-right: none'
                    }
                }
                squareDisplay.style.cssText = border; 

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
            (gameArray[1][0].textContent === userMarker && gameArray[1][1].textContent === userMarker && gameArray[1][2].textContent === userMarker) ||
            (gameArray[0][1].textContent === userMarker && gameArray[1][1].textContent === userMarker && gameArray[2][1].textContent === userMarker) ||
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
            const player1Info = document.querySelector('.player-info-1'); 
            player1Info.textContent = `${playersArray[0].name}: ${playersArray[0].marker}`; 
            const player2Info = document.querySelector('.player-info-2'); 
            player2Info.textContent = `${playersArray[1].name}: ${playersArray[1].marker}`; 
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
                            currentSquare.textContent = `${currentPlayer.marker}`;  
                            currentSquare.setAttribute('data-pressed',`${currentPlayer.name}`); 
                        }
                        let tieGame = gameBoard.checkTie(); 
                        let gameWon = gameBoard.checkWin(currentPlayer.marker); 
                        if (tieGame) {
                            playersArray = []; 
                            currentPlayerIndex = 0; 
                            resetGame('tie', 'no winner');
                        } else if (gameWon) {
                            playersArray = []; 
                            currentPlayerIndex = 0;
                            resetGame('win',currentPlayer.name);
                        }
                        else {
                            currentPlayerIndex += 1; 
                            currentPlayerIndex = currentPlayerIndex % 2; 
                        }
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
        } else {
            gameOverMessage.textContent = `${winner} has won the game!`; 
        }
        newGameModal.showModal(); 
        newGameForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            newGameModal.close(); 
            newGameForm.reset(); 
            gameBoard.resetBoard(); 
            document.querySelector('.player-info-1').textContent = ''; 
            document.querySelector('.player-info-2').textContent = ''; 
            gameController.startGame(); 
            gameController.playGame(); 

        }); 
    }

    return {startGame, playGame, resetGame}; 
})(); 

gameBoard.createBoard(); 
gameController.startGame(); 
gameController.playGame(); 








