document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const pintarButton = document.getElementById('pintarButton');
    const borrarButton = document.getElementById('borrarButton');
    
    let painting = false;
    let currentTool = 'pintar';
    let strokeColor = "rgba(255, 0, 0, 0.3)"; // Color del resaltador (rojo con transparencia)
    let lineWidth = 15; // Ancho del resaltador

    // Configuración del resaltador y borrar
    pintarButton.addEventListener('click', () => {
        currentTool = 'pintar';
    });

    borrarButton.addEventListener('click', () => {
        currentTool = 'borrar';
    });

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
    }

    function draw(e) {
        if (!painting) return;

        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX;
        const y = touch.clientY;

        const element = document.elementFromPoint(x, y);

        if (currentTool === 'pintar') {
            const highlight = document.createElement('div');
            highlight.style.position = 'absolute';
            highlight.style.left = `${x - element.getBoundingClientRect().left}px`;
            highlight.style.top = `${y - element.getBoundingClientRect().top}px`;
            highlight.style.width = `${lineWidth}px`;
            highlight.style.height = `${lineWidth}px`;
            highlight.style.backgroundColor = strokeColor;
            highlight.style.pointerEvents = 'none'; // No interferir con otros eventos
            highlight.classList.add('highlight-mark');
            element.appendChild(highlight);
        } else if (currentTool === 'borrar') {
            if (element.classList.contains('highlight-mark')) {
                element.remove(); // Eliminar solo las marcas de resaltador
            }
        }
    }

    searchButton.addEventListener('click', () => {
        const boardNumber = parseInt(searchBox.value.trim());
        if (!isNaN(boardNumber) && boardNumber > 0 && boardNumber <= 2600) {
            loadBingoBoard(boardNumber);
        } else {
            alert('Por favor, ingrese un número de cartón válido.');
        }
    });

    function loadBingoBoard(boardNumber) {
        console.log(`Buscando cartón ${boardNumber}`); // Para depuración
        bingoBoardsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        const img = new Image();
        img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${boardNumber}.png`;
        img.alt = `Cartón Nº ${boardNumber}`;

        img.onload = function () {
            console.log(`Imagen ${img.src} cargada correctamente`); // Depuración

            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.alt;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.position = 'relative'; // Para permitir que los elementos resaltados se posicionen correctamente

            bingoBoardsContainer.appendChild(imgElement);

            console.log(`Cartón ${boardNumber} mostrado en el contenedor`); // Depuración
        };

        img.onerror = function () {
            console.error(`Error al cargar el cartón Nº ${boardNumber}. Verifica que el archivo existe.`);
            alert(`Error al cargar el cartón Nº ${boardNumber}. Verifica que el archivo existe.`);
        };
    }

    // Añadir eventos de dibujo al documento
    document.addEventListener('mousedown', startPosition);
    document.addEventListener('mouseup', endPosition);
    document.addEventListener('mousemove', draw);
    document.addEventListener('touchstart', startPosition);
    document.addEventListener('touchend', endPosition);
    document.addEventListener('touchmove', draw);
});
