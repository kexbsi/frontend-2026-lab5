'use strict';

/* Завдання 2. Таблиця 6×6, клітинки пронумеровані 1–36 по рядках.
   Варіант 122 → 122 mod 10 = 2: клітинка № 2,
   подвійний клік змінює колір відповідного стовпця. */

const SIZE = 6;
const TARGET_NUMBER = 2;

const table = document.getElementById('number-table');
const tbody = table.tBodies[0];
const palette = document.getElementById('palette');

/* Створюємо таблицю: 6 рядків по 6 клітинок */
for (let row = 0; row < SIZE; row += 1) {
    const tr = tbody.insertRow();
    for (let col = 0; col < SIZE; col += 1) {
        const td = tr.insertCell();
        td.textContent = String(row * SIZE + col + 1);
    }
}

function randomColor() {
    const value = Math.floor(Math.random() * 0x1000000);
    return `#${value.toString(16).padStart(6, '0')}`;
}

/* Колір тексту, що добре видно на заданому фоні (чорний або білий) */
function readableTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? '#000000' : '#ffffff';
}

function paint(cell, color) {
    cell.style.backgroundColor = color;
    cell.style.color = readableTextColor(color);
}

const targetCell = [...tbody.querySelectorAll('td')]
    .find((td) => Number(td.textContent) === TARGET_NUMBER);
targetCell.classList.add('target');
targetCell.title = 'Наведіть, клікніть або двічі клікніть';

/* Наведення — випадковий колір */
targetCell.addEventListener('mouseover', () => {
    paint(targetCell, randomColor());
});

/* Клік — колір, обраний у палітрі */
targetCell.addEventListener('click', () => {
    paint(targetCell, palette.value);
});

/* Подвійний клік — колір з палітри для всього стовпця цієї клітинки */
targetCell.addEventListener('dblclick', () => {
    const columnIndex = targetCell.cellIndex;
    for (const tr of tbody.rows) {
        paint(tr.cells[columnIndex], palette.value);
    }
});
