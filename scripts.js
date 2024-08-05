document.addEventListener('DOMContentLoaded', () => {
    const masterBoardContainer = document.getElementById('masterBoardContainer');
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const printButton = document.getElementById('printButton');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    const boardsPerPage = 9;
    const totalBoards = 2600;

    let generatedNumbers = [];
    let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    let foundCardNumber = null;

    // Calcular páginas totales
    let totalPages = Math.ceil(totalBoards / boardsPerPage);
    totalPagesSpan.textContent = totalPages;

    loadState();  // Cargar el estado guardado

    createBingoBoards(currentPage);

    // Evento para botón de búsqueda
    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim().toLowerCase();
        foundCardNumber = null;

        for (let page = 1; page <= totalPages; page++) {
            const startBoard = (page - 1) * boardsPerPage + 1;
            const endBoard = Math.min(startBoard + boardsPerPage - 1, totalBoards);

            for (let i = startBoard; i <= endBoard; i++) {
                const playerName = playerNames[i] ? playerNames[i].toLowerCase() : '';
                if (i.toString().includes(query) || playerName.includes(query)) {
                    foundCardNumber = i;
                    changePage(page);
                    return;
                }
            }
        }

        if (!foundCardNumber) {
            alert('No se encontró el cartón.');
        }
    });

    // Evento para botón de impresión
    printButton.addEventListener('click', async () => {
        if (foundCardNumber) {
            const board = document.querySelector(`.bingoBoard[data-board-number='${foundCardNumber}']`);
            if (board) {
                await downloadCanvasImage(board, foundCardNumber);
            }
        } else {
            alert('Por favor, busca un cartón antes de intentar descargar.');
        }
    });

    // Eventos para paginación
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));

    async function downloadCanvasImage(board, boardNumber) {
        const canvas = await html2canvas(board, { backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = `bingo_carton_${boardNumber}.png`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function createBingoBoards(page) {
        bingoBoardsContainer.innerHTML = '';
        const startBoard = (page - 1) * boardsPerPage + 1;
        const endBoard = Math.min(startBoard + boardsPerPage - 1, totalBoards);

        for (let i = startBoard; i <= endBoard; i++) {
            const board = document.createElement('div');
            board.classList.add('bingoBoard');
            board.dataset.boardNumber = i;

            const boardNumberContainer = document.createElement('div');
            boardNumberContainer.classList.add('boardNumberContainer');
            
            const boardNumber = document.createElement('div');
            boardNumber.classList.add('bingoBoardNumber');
            boardNumber.textContent = `Cartón Nº ${i}`;

            const playerName = document.createElement('div');
            playerName.classList.add('playerName');
            playerName.textContent = playerNames[i] || 'Sin nombre';
            
            boardNumberContainer.appendChild(boardNumber);
            boardNumberContainer.appendChild(playerName);
            board.appendChild(boardNumberContainer);

            const header = document.createElement('div');
            header.classList.add('bingoHeader');
            ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
                const cell = document.createElement('div');
                cell.textContent = letter;
                header.appendChild(cell);
            });
            board.appendChild(header);

            const columns = document.createElement('div');
            columns.classList.add('bingoColumns');
            columns.style.display = 'grid';
            columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
            columns.style.gap = '0px';

            const bColumn = createBingoColumn(1, 15, i, 0);
            const iColumn = createBingoColumn(16, 30, i, 1);
            const nColumn = createBingoColumn(31, 45, i, 2, true);
            const gColumn = createBingoColumn(46, 60, i, 3);
            const oColumn = createBingoColumn(61, 75, i, 4);

            columns.appendChild(bColumn);
            columns.appendChild(iColumn);
            columns.appendChild(nColumn);
            columns.appendChild(gColumn);
            columns.appendChild(oColumn);

            board.appendChild(columns);
            bingoBoardsContainer.appendChild(board);
        }

        generatedNumbers.forEach(number => {
            document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
                cell.classList.add('marked');
            });
        });

        currentPageSpan.textContent = currentPage; 
    }

    function createBingoColumn(min, max, boardNumber, column, hasFreeCell = false) {
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('bingoColumn');
        const numbers = getSeededRandomNumbers(min, max, 5, boardNumber * 10 + column);

        numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            const cellNumber = hasFreeCell && index === 2 ? '' : num;
            cell.textContent = cellNumber;
            cell.dataset.number = cellNumber;

            if (cellNumber === '') {
                cell.classList.add('free');
                cell.style.backgroundImage = "url('free2.png')"; // Cambia 'free.png' por la ruta de tu imagen
                cell.style.backgroundSize = 'cover';
                cell.style.backgroundPosition = 'center';
            }

            if (cellNumber === '' || generatedNumbers.includes(Number(cellNumber))) {
                cell.classList.add('marked');
            }
            columnDiv.appendChild(cell);
        });

        return columnDiv;
    }

    function getSeededRandomNumbers(min, max, count, seed) {
        const numbers = [];
        while (numbers.length < count) {
            const num = Math.floor(seedRandom(seed++) * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    function seedRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function changePage(newPage) {
        if (newPage < 1 || newPage > totalPages) return;
        currentPage = newPage;
        createBingoBoards(currentPage);
        saveState();
        currentPageSpan.textContent = currentPage;
    }

    function saveState() {
        localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        localStorage.setItem('currentPage', currentPage.toString());
    }

    function loadState() {
        generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];
        playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
        currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    }

    createBingoBoards(currentPage);
});
