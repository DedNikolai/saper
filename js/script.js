startGame();

function startGame() {

    let size = 10;
    let bombs = 16;

    let cell = function () {
        this.isMine = false;
        this.mineAround = 0;
        this.isOpen = false;
        this.isFlag = false;

    }

    let cells = [];

    for (let i = 0; i < size; i++) {
        let temp = [];
        for (let j = 0; j < size; j++) {
            temp.push(new cell());
        }
        cells.push(temp);
    }

    for (let i = 0; i < bombs;) {
        let randomX = parseInt(Math.random() * size);
        let randomY = parseInt(Math.random() * size);
        if (!cells[randomX][randomY].isMine) {
            cells[randomX][randomY].isMine = true;
            i++;
        }
    }

    function aroundMineCount(x, y) {
        let startX = x > 0 ? x - 1 : x;
        let endX = x < size - 1 ? x + 1 : x;
        let startY = y > 0 ? y - 1 : y;
        let endY = y < size - 1 ? y + 1 : y;
        let count = 0;

        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                if (cells[i][j].isMine && !(i == x && j == y)) {
                    count++;
                }
            }
        }

        return count;
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!cells[i][j].isMine) {
                cells[i][j].mineAround = aroundMineCount(i, j);
            }
        }
    }

    let elements = document.getElementsByClassName('cell');
    let container = document.getElementsByClassName('container')[0];

    container.onclick = function (event) {
        if (!event.target.classList.contains('flag') && !event.target.classList.contains('open') && !event.target.classList.contains('clicked')) {
            event.target.classList.add('open')
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let number = i * size + j;
                    let element = elements[number];
                    if (element.classList.contains('open')) {
                        if (cells[i][j].isMine) {
                            element.classList.add('bomb')
                        } else {
                            element.innerHTML = cells[i][j].mineAround > 0 ? `${cells[i][j].mineAround}` : openNeibors(i, j);
                        }

                        cells[i][j].isOpen = true;
                    }

                }
            }

            isGameOver();
        }
    }

    container.oncontextmenu = function (event) {
        event.preventDefault();
        if (!event.target.classList.contains('open')) {
            if (event.target.classList.contains('flag')) {
                event.target.classList.remove('flag')
            } else {
                event.target.classList.add('flag')
            }
        }

        isGameOver();
    }

    function openNeibors(x, y) {
        let startX = x > 0 ? x - 1 : x;
        let endX = x < size - 1 ? x + 1 : x;
        let startY = y > 0 ? y - 1 : y;
        let endY = y < size - 1 ? y + 1 : y;

        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                if (!cells[i][j].isMine && !(i == x && j == y)) {
                    let number = i * size + j;
                    let element = elements[number];
                    element.innerHTML = cells[i][j].mineAround > 0 ? `${cells[i][j].mineAround}` : '';
                    element.classList.add('clicked');
                    cells[i][j].isOpen = true;
                }
            }
        }

        return '';
    }

    function isGameOver() {
        let count = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let number = i * size + j;
                let element = elements[number];
                if (cells[i][j].isOpen && cells[i][j].isMine) {
                    document.getElementsByClassName('result_text')[0].classList.add('red-text')
                    document.getElementsByClassName('result_text')[0].innerHTML = 'sorry you lost';
                    showMines();
                    document.getElementsByClassName('result')[0].classList.add('over-game')
                    return;
                }

                if (cells[i][j].isMine && element.classList.contains('flag')) {
                    count++
                }
            }
        }

        if (count == bombs) {
            document.getElementsByClassName('result_text')[0].classList.add('yellow-text')
            document.getElementsByClassName('result_text')[0].innerHTML = 'congratulations you won'
            document.getElementsByClassName('result')[0].classList.add('over-game')
            showMines();
            return;
        }
    }

    function showMines() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let number = i * size + j;
                if (cells[i][j].isMine) {
                    elements[number].classList.add('bomb');
                } else {
                    if (elements[number].classList.contains('open')) {
                        elements[number].innerHTML = cells[i][j].mineAround ? cells[i][j].mineAround : '';
                    }
                }
            }
        }
    }

}

let restartButton = document.getElementsByClassName('restart-btn')[0];
    restartButton.onclick = function () {
    let elements = document.getElementsByClassName('cell');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('open');
        elements[i].classList.remove('flag');
        elements[i].classList.remove('bomb');
        elements[i].classList.remove('clicked');
        elements[i].innerHTML = '';
        document.getElementsByClassName('result')[0].classList.remove('over-game')
    }

    startGame();
}

