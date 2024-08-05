document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const printButton = document.getElementById('printButton');

    const boardsPerPage = 9;
    const totalBoards = 50000;
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    // Calcular páginas totales
    let totalPages = Math.ceil(totalBoards / boardsPerPage);
    totalPagesSpan.textContent = totalPages;

    loadState();
    createBingoBoards(currentPage);

    searchButton.addEventListener('click', filterBoards);
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    printButton.addEventListener('click', downloadBoardImages);

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

            boardNumberContainer.appendChild(boardNumber);
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
                cell.textContent = 'FREE';
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

    function filterBoards() {
        const query = searchBox.value.trim().toLowerCase();
        let found = false;

        document.querySelectorAll('.bingoBoard').forEach(board => {
            const boardNumber = board.querySelector('.bingoBoardNumber').textContent.toLowerCase();
            if (boardNumber.includes(query)) {
                board.style.display = 'block';
                found = true;
            } else {
                board.style.display = 'none';
            }
        });

        if (!found) {
            alert('No se encontró el cartón.');
        }
    }

    async function downloadBoardImages() {
        const boards = document.querySelectorAll('.bingoBoard');

        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];
            const boardNumberElement = board.querySelector('.bingoBoardNumber');
            const boardNumber = boardNumberElement.textContent.replace(/\D/g, ''); // Extraer el número del cartón

            await html2canvas(board).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = `carton_${boardNumber}.png`;
                link.click();
            });
        }
    }

    function loadState() {
        // Lógica para cargar el estado guardado si es necesario
    }

    function saveState() {
        // Lógica para guardar el estado actual si es necesario
    }
});
