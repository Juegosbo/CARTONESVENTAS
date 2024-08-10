document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const pintarButton = document.getElementById('pintarButton');
    const borrarButton = document.getElementById('borrarButton');
    const totalBoards = 2600;  // Número total de cartones disponibles

    let drawingCanvas, drawingCtx;
    let currentTool = 'pintar';
    let painting = false; // Definir la variable painting

    // Configurar el lápiz para pintar en rojo
    let strokeColor = "red";
    let lineWidth = 3;

    pintarButton.addEventListener('click', () => {
        currentTool = 'pintar';
        drawingCtx.globalCompositeOperation = "source-over"; // Pintar normalmente
        drawingCtx.strokeStyle = strokeColor;
        drawingCtx.lineWidth = lineWidth;
    });

    borrarButton.addEventListener('click', () => {
        currentTool = 'borrar';
        drawingCtx.globalCompositeOperation = "destination-out"; // Borrar solo lo que se pintó
        drawingCtx.strokeStyle = "rgba(0,0,0,1)"; // Para borrar, se utiliza color sólido
        drawingCtx.lineWidth = lineWidth;
    });

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
                const canvasWrapper = document.createElement('div');
                canvasWrapper.classList.add('canvas-wrapper');

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Crear un segundo lienzo para pintar encima de la imagen
                drawingCanvas = document.createElement('canvas');
                drawingCanvas.width = img.width;
                drawingCanvas.height = img.height;
                drawingCtx = drawingCanvas.getContext('2d');

                canvasWrapper.appendChild(canvas);
                canvasWrapper.appendChild(drawingCanvas);
                bingoBoardsContainer.appendChild(canvasWrapper);

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
