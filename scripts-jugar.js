document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const pintarButton = document.getElementById('pintarButton');
    const borrarButton = document.getElementById('borrarButton');
    const totalBoards = 2600;  // Número total de cartones disponibles
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    let currentTool = 'pintar'; // Herramienta actual, por defecto 'pintar'

    // Configurar el lápiz para pintar en rojo
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    // Eventos para cambiar entre pintar y borrar
    pintarButton.addEventListener('click', () => {
        currentTool = 'pintar';
        ctx.strokeStyle = "red";
    });

    borrarButton.addEventListener('click', () => {
        currentTool = 'borrar';
        ctx.strokeStyle = "white"; // Cambiar el color a blanco para borrar
    });

    // Eventos para dibujar en el lienzo en dispositivos móviles
    let painting = false;

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

        ctx.lineCap = "round";

        const touch = e.touches ? e.touches[0] : null;
        const mouseX = touch ? touch.clientX : e.clientX;
        const mouseY = touch ? touch.clientY : e.clientY;

        ctx.lineTo(mouseX - canvas.offsetLeft, mouseY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX - canvas.offsetLeft, mouseY - canvas.offsetTop);
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
            img.classList.add('bingoBoardImage');
            img.onload = function () {
                const canvasClone = document.createElement('canvas');
                const ctxClone = canvasClone.getContext('2d');
                canvasClone.width = img.width;
                canvasClone.height = img.height;
                ctxClone.drawImage(img, 0, 0);
                bingoBoardsContainer.appendChild(canvasClone);

                // Añadir eventos de dibujo al nuevo canvas
                let painting = false;

                canvasClone.addEventListener('touchstart', startPosition);
                canvasClone.addEventListener('touchend', endPosition);
                canvasClone.addEventListener('touchmove', (e) => drawOnCanvas(e, ctxClone));

                canvasClone.addEventListener('mousedown', startPosition);
                canvasClone.addEventListener('mouseup', endPosition);
                canvasClone.addEventListener('mousemove', (e) => drawOnCanvas(e, ctxClone));
            }
        }
    }

    function drawOnCanvas(e, context) {
        if (!painting) return;

        const touch = e.touches ? e.touches[0] : null;
        const mouseX = touch ? touch.clientX : e.clientX;
        const mouseY = touch ? touch.clientY : e.clientY;

        context.lineCap = "round";
        context.lineWidth = ctx.lineWidth;
        context.strokeStyle = ctx.strokeStyle;

        context.lineTo(mouseX - e.target.offsetLeft, mouseY - e.target.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(mouseX - e.target.offsetLeft, mouseY - e.target.offsetTop);
    }
});
