document.addEventListener('DOMContentLoaded', () => {
    const bingoComboContainer = document.getElementById('bingoComboContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const totalBoards = 5000;  // Número total de cartones disponibles

    // Asegúrate de que los elementos del DOM existen antes de añadir los event listeners
    if (searchButton && searchBox && bingoComboContainer) {
        searchButton.addEventListener('click', () => {
            const query = parseInt(searchBox.value.trim());

            if (isNaN(query) || query < 1 || query > totalBoards) {
                alert('Por favor, ingrese un número de cartón válido.');
                return;
            }

            loadBingoCombo(query);
        });
    } else {
        console.error('No se encontraron elementos del DOM necesarios');
    }

    function loadBingoCombo(boardNumber) {
        bingoComboContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        const selectedBoards = new Set();
        selectedBoards.add(boardNumber);

        while (selectedBoards.size < 4) {
            const randomBoard = Math.floor(Math.random() * totalBoards) + 1;
            selectedBoards.add(randomBoard);
        }

        selectedBoards.forEach(board => {
            const img = document.createElement('img');
            img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${board}.png`; // Ruta de la imagen
            img.alt = `Cartón Nº ${board}`;
            img.classList.add('bingoBoardImage');

            const downloadButton = document.createElement('button');
            downloadButton.textContent = `Descargar Cartón Nº ${board}`;
            downloadButton.classList.add('downloadButton');
            downloadButton.addEventListener('click', () => downloadImage(img.src, `bingo_carton_${board}.png`));

            bingoComboContainer.appendChild(img);
            bingoComboContainer.appendChild(downloadButton);
        });
    }

    function downloadImage(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
