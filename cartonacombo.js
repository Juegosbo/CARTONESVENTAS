document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const resultDiv = document.getElementById('result');
    const totalCombos = 2000;  // Número total de combos disponibles
    const totalBoards = 8000;  // Número total de cartones disponibles
    const boardsPerCombo = 4;  // Número de cartones por combo

    // Pre-generar la lista de cartones mezclados de manera determinística
    const preGeneratedBoards = shuffleArray(generateBoardSequence(totalBoards));

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const cartonNumber = parseInt(document.getElementById('cartonNumber').value.trim());

            if (isNaN(cartonNumber) || cartonNumber < 1 || cartonNumber > totalBoards) {
                alert('Por favor, ingrese un número de cartón válido.');
                return;
            }

            const comboNumber = findComboByCarton(cartonNumber);
            if (comboNumber !== null) {
                resultDiv.textContent = `El cartón Nº ${cartonNumber} pertenece al combo Nº ${comboNumber}`;
            } else {
                resultDiv.textContent = `El cartón Nº ${cartonNumber} no fue encontrado en ningún combo.`;
            }
        });
    }

    function generateBoardSequence(totalBoards) {
        const boards = [];
        for (let i = 1; i <= totalBoards; i++) {
            boards.push(i);
        }
        return boards;
    }

    function shuffleArray(array) {
        let seed = 1; // Deterministic seed
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(random(seed) * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            seed++;
        }
        return array;
    }

    function random(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function findComboByCarton(cartonNumber) {
        for (let i = 0; i < totalCombos; i++) {
            const startIndex = i * boardsPerCombo;
            const comboBoards = preGeneratedBoards.slice(startIndex, startIndex + boardsPerCombo);
            if (comboBoards.includes(cartonNumber)) {
                return i + 1; // El combo se numera desde 1, no desde 0
            }
        }
        return null;
    }
});
