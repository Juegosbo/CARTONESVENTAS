document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let painting = false;
    let strokeColor = "rgba(255, 0, 0, 0.3)"; // Color del resaltador (rojo con transparencia)
    let lineWidth = 5; // Ancho del resaltador

    // Eventos para pintar sobre el lienzo
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath(); // Reiniciar el camino del contexto
    }

    function draw(e) {
        if (!painting) return;

        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX - canvas.offsetLeft;
        const y = touch.clientY - canvas.offsetTop;

        ctx.lineCap = "round";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
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
        bingoBoardsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        const img = new Image();
        img.src = `2600 CARTONES DESCARGADOS/bingo_carton_${boardNumber}.png`;
        img.alt = `Cartón Nº ${boardNumber}`;

        img.onload = function () {
            const scaleFactor = 0.10; // Porcentaje de escala (0.8 = 80% del tamaño original)
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo antes de dibujar
            ctx.drawImage(img, 0, 0); // Dibujar la imagen en el lienzo

            canvas.style.position = 'relative';
            canvas.style.zIndex = '1';

            bingoBoardsContainer.appendChild(canvas);
        };

        img.onerror = function () {
            console.error(`Error al cargar el cartón Nº ${boardNumber}. Verifica que el archivo existe.`);
            alert(`Error al cargar el cartón Nº ${boardNumber}. Verifica que el archivo existe.`);
        };
    }
});
