const X_CLASS = 'x'
const O_CLASS = 'o'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.querySelector('.game-board')
const statusMessageElement = document.getElementById('statusMessage')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let oTurn
let againstAI = true // Change to false if you want to play against another human

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
    oTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.textContent = ''
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    setStatusMessage()
    winningMessageElement.classList.remove('show')
}

function handleClick(e) {
    const cell = e.target
    const currentClass = oTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        setBoardHoverClass()
        setStatusMessage()
        if (againstAI && !oTurn) {
            setTimeout(aiMove, 500)
        }
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
    } else {
        winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
    cell.textContent = currentClass.toUpperCase()
}

function swapTurns() {
    oTurn = !oTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if (oTurn) {
        board.classList.add(O_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function setStatusMessage() {
    statusMessageElement.innerText = `Player ${oTurn ? "O" : "X"}'s Turn`
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function aiMove() {
    const bestMove = minimax([...cellElements], O_CLASS, 0).index
    const cell = cellElements[bestMove]
    placeMark(cell, O_CLASS)
    if (checkWin(O_CLASS)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        setBoardHoverClass()
        setStatusMessage()
    }
}

function minimax(newBoard, player, depth) {
    const availableSpots = newBoard.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS))

    if (checkWinForMinimax(newBoard, X_CLASS)) {
        return { score: -10 + depth }
    } else if (checkWinForMinimax(newBoard, O_CLASS)) {
        return { score: 10 - depth }
    } else if (availableSpots.length === 0) {
        return { score: 0 }
    }

    const moves = []
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {}
        move.index = newBoard.indexOf(availableSpots[i])
        newBoard[move.index].classList.add(player)

        if (player === O_CLASS) {
            const result = minimax(newBoard, X_CLASS, depth + 1)
            move.score = result.score
        } else {
            const result = minimax(newBoard, O_CLASS, depth + 1)
            move.score = result.score
        }

        newBoard[move.index].classList.remove(player)
        moves.push(move)
    }

    let bestMove
    if (player === O_CLASS) {
        let bestScore = -10000
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score
                bestMove = i
            }
        }
    } else {
        let bestScore = 10000
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score
                bestMove = i
            }
        }
    }

    return moves[bestMove]
}

function checkWinForMinimax(board, player) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return board[index].classList.contains(player)
        })
    })
}
