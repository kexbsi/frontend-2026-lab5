'use strict';

/* Завдання 1. Варіант 122 → рядок 122 mod 15 = 2 таблиці 1 → поля 1, 3, 4, 5, 6 таблиці 2.
   Т — текст (літера), Ч — число (цифра). */

const UA_UPPER = 'А-ЯҐЄІЇ';
const UA_LOWER = 'а-яґєії';

const RULES = {
    // 1. ПІБ: ТТТТТТ Т.Т. — прізвище з великої літери (можна з апострофом чи дефісом), пробіл, два ініціали
    fullName: {
        label: 'ПІБ',
        pattern: new RegExp(`^[${UA_UPPER}][${UA_LOWER}'’]+(?:-[${UA_UPPER}][${UA_LOWER}'’]+)? [${UA_UPPER}]\\.[${UA_UPPER}]\\.$`, 'u'),
        error: 'Введіть прізвище й ініціали, напр. «Рудь С.С.»',
    },
    // 3. Група: ТТ-ЧЧ
    group: {
        label: 'Група',
        pattern: new RegExp(`^[${UA_UPPER}]{2}-\\d{2}$`, 'u'),
        error: 'Формат ТТ-ЧЧ, напр. «ІП-44»',
    },
    // 4. Телефон: (ЧЧЧ)-ЧЧЧ-ЧЧ-ЧЧ
    phone: {
        label: 'Телефон',
        pattern: /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/,
        error: 'Формат (ЧЧЧ)-ЧЧЧ-ЧЧ-ЧЧ, напр. «(067)-123-45-67»',
    },
    // 5. ID-card: ТТ №ЧЧЧЧЧЧ
    idCard: {
        label: 'ID-card',
        pattern: new RegExp(`^[${UA_UPPER}]{2} №\\d{6}$`, 'u'),
        error: 'Формат ТТ №ЧЧЧЧЧЧ, напр. «КВ №123456»',
    },
    // 6. Факультет: ТТТТ
    faculty: {
        label: 'Факультет',
        pattern: new RegExp(`^[${UA_UPPER}]{4}$`, 'u'),
        error: 'Чотири великі літери, напр. «ФІОТ»',
    },
};

const form = document.getElementById('student-form');
const formMessage = document.getElementById('form-message');
const dialog = document.getElementById('result-dialog');
const resultList = document.getElementById('result-list');

/* Перевіряє одне поле, підсвічує його рядок і повертає true/false */
function validateField(name) {
    const input = form.elements[name];
    const row = form.querySelector(`[data-field="${name}"]`);
    const hint = row.querySelector('.hint');
    const value = input.value.trim();
    const isValid = RULES[name].pattern.test(value);

    row.classList.toggle('invalid', !isValid);
    row.classList.toggle('valid', isValid);
    input.setAttribute('aria-invalid', String(!isValid));
    hint.textContent = isValid ? 'Правильно' : RULES[name].error;
    return isValid;
}

/* Окреме вікно з введеними даними. Вміст додаємо через textContent,
   а не innerHTML, — так введений текст не може стати HTML-кодом. */
function showInNewWindow(data) {
    const win = window.open('', 'lab5-result', 'width=460,height=380');
    if (win === null) {
        return false;                 // спливне вікно заблоковано браузером
    }
    const doc = win.document;
    doc.title = 'Введені дані — ЛР №5';
    doc.body.replaceChildren();
    doc.body.style.fontFamily = 'Arial, sans-serif';
    doc.body.style.margin = '24px';

    const heading = doc.createElement('h2');
    heading.textContent = 'Введені дані';
    doc.body.appendChild(heading);

    for (const [name, value] of Object.entries(data)) {
        const p = doc.createElement('p');
        const b = doc.createElement('b');
        b.textContent = `${RULES[name].label}: `;
        p.append(b, value);
        doc.body.appendChild(p);
    }
    win.focus();
    return true;
}

/* Запасний варіант, якщо спливні вікна заборонені: модальне вікно <dialog> */
function showInDialog(data) {
    resultList.replaceChildren();
    for (const [name, value] of Object.entries(data)) {
        const dt = document.createElement('dt');
        dt.textContent = RULES[name].label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        resultList.append(dt, dd);
    }
    dialog.showModal();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();          // сторінка не перезавантажується

    const names = Object.keys(RULES);
    const results = names.map(validateField);
    const errors = results.filter((ok) => !ok).length;

    if (errors > 0) {
        formMessage.textContent = `Помилок: ${errors}. Виправте виділені поля.`;
        formMessage.className = 'form-message error';
        const firstInvalid = names.find((name, i) => !results[i]);
        form.elements[firstInvalid].focus();
        return;
    }

    const data = {};
    for (const name of names) {
        data[name] = form.elements[name].value.trim();
    }
    formMessage.textContent = 'Усі дані введено правильно.';
    formMessage.className = 'form-message ok';

    if (!showInNewWindow(data)) {
        showInDialog(data);
    }
});

/* Після першої перевірки поле перевіряється знову під час введення */
form.addEventListener('input', (event) => {
    const row = event.target.closest('.field');
    if (row !== null && (row.classList.contains('invalid') || row.classList.contains('valid'))) {
        validateField(event.target.name);
    }
});
