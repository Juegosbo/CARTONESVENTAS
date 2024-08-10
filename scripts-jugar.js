document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const pintarButton = document.getElementById('pintarButton');
    const borrarButton = document.getElementById('borrarButton');
    const totalBoards = 2600;  // Número total de cartones disponibles
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    let painting = false; // Variable para controlar si se está pintando
    let currentTool = 'pintar'; // Herramienta actual, por defecto 'pintar'

    // Configuración inicial del lápiz
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";

    // Eventos para cambiar entre pintar y borrar
    pintarButton.addEventListener('click', () => {
        currentTool = 'pintar';
        ctx.globalCompositeOperation = "source-over"; // Pintar normalmente
        ctx.strokeStyle = "red";
    });

    borrarButton.addEventListener('click', () => {
        currentTool = 'borrar';
        ctx.globalCompositeOperation = "destination-out"; // Borrar solo las marcas de pintura
        ctx.strokeStyle = "rgba(0,0,0,1)"; // Borrar usando una línea sólida
    });

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;

        const touch = e.touches ? e.touches[0] : null;
        const mouseX = touch ? touch.clientX : e.clientX;
        const mouseY = touch ? touch.clientY : e.clientY;

        ctx.lineTo(mouseX - canvas.offsetLeft, mouseY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX - canvas.offsetLeft, mouseY - canvas.offsetTop);
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
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo antes de dibujar
                ctx.drawImage(img, 0, 0); // Dibujar la imagen en el lienzo

                // El lienzo está listo para pintar y borrar sobre la imagen
            }
        }
    }

    // Añadir eventos de dibujo al canvas
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
});
