document.addEventListener('DOMContentLoaded', () => {
    const masterBoardContainer = document.getElementById('masterBoardContainer');
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const printButton = document.getElementById('printButton');

    const boardsPerPage = 9;
    const totalBoards = 2600;

    let generatedNumbers = [];
    let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    // Calcular páginas totales
    let totalPages = Math.ceil(totalBoards / boardsPerPage);
    totalPagesSpan.textContent = totalPages;

    loadState();  // Cargar el estado guardado

    createBingoBoards(currentPage);

    searchButton.addEventListener('click', filterBoards);
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    printButton.addEventListener('click', async () => {
        const boards = document.querySelectorAll('.bingoBoard');

        // Función para descargar una imagen del cartón
        const downloadCanvasImage = async (board, boardNumber) => {
            const canvas = await html2canvas(board, { backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imgData;
            link.download = `bingo_carton_${boardNumber}.png`;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // Evitar descargas duplicadas
        const uniqueBoards = new Set();

        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];
            const boardNumberElement = board.querySelector('.bingoBoardNumber');

            if (boardNumberElement && !board.closest('#masterBoardContainer')) {
                const boardNumber = boardNumberElement.textContent.replace(/\D/g, ''); // Extraer el número del cartón
                if (!uniqueBoards.has(boardNumber)) {
                    uniqueBoards.add(boardNumber);
                    await downloadCanvasImage(board, boardNumber);
                }
            }
        }
    });

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
            if (hasFreeCell && index === 2) {
                cell.classList.add('free'); // Añadir la clase 'free' para celdas de 'FREE'
                cell.style.backgroundImage = "url('ruta-de-tu-imagen.png')"; // Cambia 'ruta-de-tu-imagen.png' por la ruta de tu imagen
            }
            cell.textContent = cellNumber;
            cell.dataset.number = cellNumber;

            if (generatedNumbers.includes(Number(cellNumber))) {
                cell.classList.add('marked');
            }
            columnDiv.appendChild(cell);
        });

        return columnDiv;
    }

    function seedRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
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

    function filterBoards() {
        const query = searchBox.value.trim().toLowerCase();
        let found = false;

        for (let page = 1; page <= totalPages; page++) {
            const startBoard = (page - 1) * boardsPerPage + 1;
            const endBoard = Math.min(startBoard + boardsPerPage - 1, totalBoards);

            for (let i = startBoard; i <= endBoard; i++) {
                const playerName = playerNames[i] ? playerNames[i].toLowerCase() : '';
                if (i.toString().includes(query) || playerName.includes(query)) {
                    found = true;
                    changePage(page);
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        if (!found) {
            alert('No se encontró el cartón.');
        }
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
