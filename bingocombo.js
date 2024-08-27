document.addEventListener('DOMContentLoaded', () => {
    const bingoComboContainer = document.getElementById('bingoComboContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const exportButton = document.getElementById('exportButton'); // Botón para exportar a Excel
    const totalCombos = 2000;  // Número total de combos disponibles
    const totalBoards = 8000;  // Número total de cartones disponibles

    // Pre-generar una lista de cartones mezclados de manera determinística
    const preGeneratedBoards = shuffleArray(generateBoardSequence(totalBoards));

    // Asegúrate de que los elementos del DOM existen antes de añadir los event listeners
    if (searchButton && searchBox && bingoComboContainer) {
        searchButton.addEventListener('click', () => {
            const query = parseInt(searchBox.value.trim());

            if (isNaN(query) || query < 1 || query > totalCombos) {
                alert('Por favor, ingrese un número de combo válido.');
                return;
            }

            loadBingoCombo(query);
        });
    } else {
        console.error('No se encontraron elementos del DOM necesarios');
    }

    // Event listener para el botón de exportación a Excel
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            exportCombosToExcel();
        });
    }

    function loadBingoCombo(comboNumber) {
        bingoComboContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        const startIndex = (comboNumber - 1) * 4;
        const selectedBoards = preGeneratedBoards.slice(startIndex, startIndex + 4);

        selectedBoards.forEach(board => {
            // Crear un contenedor para cada cartón y su botón
            const comboItem = document.createElement('div');
            comboItem.classList.add('bingoComboItem');

            // Crear la imagen del cartón
            const img = document.createElement('img');
            img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${board}.png`; // Ruta de la imagen
            img.alt = `Cartón Nº ${board}`;
            img.classList.add('bingoBoardImage');

            // Crear el botón de descarga
            const downloadButton = document.createElement('button');
            downloadButton.textContent = `Descargar  Nº ${board}`;
            downloadButton.classList.add('downloadButton');
            downloadButton.addEventListener('click', () => downloadImage(img.src, `bingo_carton_${board}.png`));

            // Agregar la imagen y el botón al contenedor
            comboItem.appendChild(img);
            comboItem.appendChild(downloadButton);

            // Agregar el contenedor al contenedor principal
            bingoComboContainer.appendChild(comboItem);
        });
    }

    function generateBoardSequence(totalBoards) {
        const boards = [];
        for (let i = 1; i <= totalBoards; i++) {
            boards.push(i);
        }
        return boards;
    }

    function shuffleArray(array) {
        let seed = 1; // Deterministic seed
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(random(seed) * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            seed++;
        }
        return array;
    }

    function random(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function downloadImage(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportCombosToExcel() {
        const workbook = XLSX.utils.book_new();
        const combos = [];

        for (let i = 1; i <= totalCombos; i++) {
            const startIndex = (i - 1) * 4;
            const selectedBoards = preGeneratedBoards.slice(startIndex, startIndex + 4);
            combos.push([`Combo ${i}`, ...selectedBoards]);
        }

        const worksheet = XLSX.utils.aoa_to_sheet([['Combo', 'Cartón 1', 'Cartón 2', 'Cartón 3', 'Cartón 4'], ...combos]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Combos');

        XLSX.writeFile(workbook, 'BingoCombos.xlsx');
    }
});
