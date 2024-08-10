document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const pintarButton = document.getElementById('pintarButton');
    const borrarButton = document.getElementById('borrarButton');
    const totalBoards = 2600;  // Número total de cartones disponibles
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    let drawingCanvas, drawingCtx; // Lienzo adicional para pintar

    let currentTool = 'pintar'; // Herramienta actual, por defecto 'pintar'

    // Configurar el lápiz para pintar en rojo
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    // Eventos para cambiar entre pintar y borrar
    pintarButton.addEventListener('click', () => {
        currentTool = 'pintar';
        drawingCtx.globalCompositeOperation = "source-over"; // Pintar normalmente
        drawingCtx.strokeStyle = "red";
    });

    borrarButton.addEventListener('click', () => {
        currentTool = 'borrar';
        drawingCtx.globalCompositeOperation = "destination-out"; // Borrar solo lo que se pintó
        drawingCtx.strokeStyle = "rgba(0,0,0,1)"; // Borrar lo que se pintó
    });

    // Eventos para dibujar en el lienzo en dispositivos móviles
    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        drawingCtx.beginPath();
    }

    function draw(e) {
        if (!painting) return;

        drawingCtx.lineCap = "round";

        const touch = e.touches ? e.touches[0] : null;
        const mouseX = touch ? touch.clientX : e.clientX;
        const mouseY = touch ? touch.clientY : e.clientY;

        drawingCtx.lineTo(mouseX - drawingCanvas.offsetLeft, mouseY - drawingCanvas.offsetTop);
        drawingCtx.stroke();
        drawingCtx.beginPath();
        drawingCtx.moveTo(mouseX - drawingCanvas.offsetLeft, mouseY - drawingCanvas.offsetTop);
    }

    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);

    // Para permitir también dibujar con el mouse
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    // Cargar y mostrar el cartón o los cartones en el rango
    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim();

        if (query.includes('-')) {
            const range = query.split('-').map(Number);
            if (range.length === 2 && range[0] > 0 && range[1] <= totalBoards && range[0] <= range[1]) {
                loadBingoBoards(range[0], range[1]);
            } else {
                alert('Por favor, ingrese un rango de cartones válido.');
            }
        } else {
            const boardNumber = parseInt(query);
            if (!isNaN(boardNumber) && boardNumber > 0 && boardNumber <= totalBoards) {
                loadBingoBoards(boardNumber, boardNumber);
            } else {
                alert('Por favor, ingrese un número de cartón válido.');
            }
        }
    });

    function loadBingoBoards(startBoard, endBoard) {
        bingoBoardsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        for (let i = startBoard; i <= endBoard; i++) {
            const img = new Image();
            img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${i}.png`;
            img.alt = `Cartón Nº ${i}`;
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo antes de dibujar
                ctx.drawImage(img, 0, 0);

                // Crear un segundo lienzo para pintar encima de la imagen
                drawingCanvas = document.createElement('canvas');
                drawingCanvas.width = img.width;
                drawingCanvas.height = img.height;
                drawingCtx = drawingCanvas.getContext('2d');

                bingoBoardsContainer.appendChild(drawingCanvas);

                // Añadir eventos de dibujo al nuevo canvas
                drawingCanvas.addEventListener('touchstart', startPosition);
                drawingCanvas.addEventListener('touchend', endPosition);
                drawingCanvas.addEventListener('touchmove', draw);

                drawingCanvas.addEventListener('mousedown', startPosition);
                drawingCanvas.addEventListener('mouseup', endPosition);
                drawingCanvas.addEventListener('mousemove', draw);
            }
        }
    }
});
