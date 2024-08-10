document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const totalBoards = 2600;  // Número total de cartones disponibles

    // Asegúrate de que los elementos del DOM existen antes de añadir los event listeners
    if (searchButton && searchBox && bingoBoardsContainer) {
        searchButton.addEventListener('click', () => {
            const query = parseInt(searchBox.value.trim());

            if (isNaN(query) || query < 1 || query > totalBoards) {
                alert('Por favor, ingrese un número de cartón válido.');
                return;
            }

            loadBingoBoard(query);
        });
    } else {
        console.error('No se encontraron elementos del DOM necesarios');
    }

    function loadBingoBoard(boardNumber) {
        bingoBoardsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        // Crear la imagen del cartón
        const img = document.createElement('img');
        img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${boardNumber}.png`; // Ruta de la imagen
        img.alt = `Cartón Nº ${boardNumber}`;
        img.classList.add('bingoBoardImage');

        // Crear el botón de descarga
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Descargar Cartón';
        downloadButton.classList.add('downloadButton');
        downloadButton.addEventListener('click', () => downloadImage(img.src, `bingo_carton_${boardNumber}.png`));

        // Agregar la imagen y el botón al contenedor
        bingoBoardsContainer.appendChild(img);
        bingoBoardsContainer.appendChild(downloadButton);
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
