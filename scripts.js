document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const totalBoards = 2000;  // Número de cartones

    loadBingoBoards();

    function loadBingoBoards() {
        bingoBoardsContainer.innerHTML = ''; // Limpiar cualquier contenido previo
        
        for (let i = 1; i <= totalBoards; i++) {
            const img = document.createElement('img');
            img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${i}.png`; // Ruta de la imagen
            img.alt = `Cartón Nº ${i}`;
            img.classList.add('bingoBoardImage');

            // Añadir evento de click para descargar la imagen
            img.addEventListener('click', () => downloadImage(img.src, `bingo_carton_${i}.png`));

            bingoBoardsContainer.appendChild(img);
        }
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
