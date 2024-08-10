document.addEventListener('DOMContentLoaded', () => {
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

    // Eventos para pintar o borrar sobre cualquier parte de la página
    document.addEventListener('mousedown', startPosition);
    document.addEventListener('mouseup', endPosition);
    document.addEventListener('mousemove', draw);
    document.addEventListener('touchstart', startPosition);
    document.addEventListener('touchend', endPosition);
    document.addEventListener('touchmove', draw);

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
            element.style.position = 'relative';
            const highlight = document.createElement('div');
            highlight.style.position = 'absolute';
            highlight.style.left = `${x - element.getBoundingClientRect().left}px`;
            highlight.style.top = `${y - element.getBoundingClientRect().top}px`;
            highlight.style.width = `${lineWidth}px`;
            highlight.style.height = `${lineWidth}px`;
            highlight.style.backgroundColor = strokeColor;
            highlight.style.pointerEvents = 'none'; // No interferir con otros eventos
            element.appendChild(highlight);
        } else if (currentTool === 'borrar' && element.style.backgroundColor === strokeColor) {
            element.remove(); // Eliminar solo las marcas de resaltador
        }
    }
});
