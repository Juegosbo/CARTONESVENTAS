document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const totalBoards = 2600;  // Número total de cartones disponibles
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    // Asegúrate de que los elementos del DOM existen antes de añadir los event listeners
    if (searchButton && searchBox && bingoBoardsContainer && canvas) {
        searchButton.addEventListener('click', () => {
            const query = parseInt(searchBox.value.trim());

            if (isNaN(query) || query < 1 || query > totalBoards) {
                alert('Por favor, ingrese un número de cartón válido.');
                return;
            }

            loadBingoBoard(query);
        });

        // Configurar el lápiz para pintar en rojo
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

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

            const touch = e.touches[0];
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
    } else {
        console.error('No se encontraron elementos del DOM necesarios');
    }

    function loadBingoBoard(boardNumber) {
        const img = new Image();
        img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${boardNumber}.png`;
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
    }
});
