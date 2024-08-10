document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const pintarButton = document.getElementById('pintarButton');
    const borrarButton = document.getElementById('borrarButton');
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    let painting = false; // Variable para controlar si se está pintando

    // Configuración inicial del lápiz
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";

    // Eventos para cambiar entre pintar y borrar
    pintarButton.addEventListener('click', () => {
        ctx.globalCompositeOperation = "source-over"; // Pintar normalmente
        ctx.strokeStyle = "red";
    });

    borrarButton.addEventListener('click', () => {
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

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo antes de dibujar
            ctx.drawImage(img, 0, 0); // Dibujar la imagen en el lienzo

            console.log(`Cartón ${boardNumber} mostrado en el lienzo`); // Depuración
        };

        img.onerror = function () {
            console.error(`Error al cargar el cartón Nº ${boardNumber}. Verifica que el archivo existe.`);
            alert(`Error al cargar el cartón Nº ${boardNumber}. Verifica que el archivo existe.`);
        };

        bingoBoardsContainer.appendChild(canvas);
    }

    // Añadir eventos de dibujo al canvas
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
});
