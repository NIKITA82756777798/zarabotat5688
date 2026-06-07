let balance = 0;
let multiplier = 1;
let passiveIncome = 0;
let level = 1;
const totalCourses = 8;
let boughtCount = 0;

const courses = [
    { id: 1, price: 50, bonus: 0.01, bought: false },
    { id: 2, price: 200, bonus: 0.02, bought: false },
    { id: 3, price: 500, bonus: 0.03, bought: false },
    { id: 4, price: 1000, bonus: 0.05, bought: false },
    { id: 5, price: 2500, bonus: 0.08, bought: false },
    { id: 6, price: 5000, bonus: 0.10, bought: false },
    { id: 7, price: 10000, bonus: 0.12, bought: false },
    { id: 8, price: 50000, bonus: 0.15, bought: false }
];

let purchasedCoursesIds = [];

const msgBox = document.createElement('div');
msgBox.id = 'game-message';
msgBox.style.position = 'fixed';
msgBox.style.top = '10px';
msgBox.style.right = '10px';
msgBox.style.padding = '15px 25px';
msgBox.style.borderRadius = '50px';
msgBox.style.fontWeight = 'bold';
msgBox.style.zIndex = '3000';
msgBox.style.pointerEvents = 'none';
msgBox.style.opacity = '0';
msgBox.style.transition = 'opacity 0.5s';
document.body.appendChild(msgBox);

function showMsg(text, type) {
    msgBox.innerText = text;
    if (type === 'success') {
        msgBox.style.background = '#4caf50';
        msgBox.style.color = 'white';
    } else {
        msgBox.style.background = '#f44336';
        msgBox.style.color = 'white';
    }
    msgBox.style.opacity = '1';
    setTimeout(() => { msgBox.style.opacity = '0'; }, 3000);
}

function init() {
    try {
        const savedData = localStorage.getItem('clickerGameData');
        if (savedData) {
            const data = JSON.parse(savedData);
            balance = data.balance;
            multiplier = data.multiplier;
            passiveIncome = data.passiveIncome;
            level = data.level;
            purchasedCoursesIds = data.purchasedCoursesIds || [];
            boughtCount = purchasedCoursesIds.length;

            purchasedCoursesIds.forEach(id => {
                const course = courses.find(c => c.id === id);
                if (course) course.bought = true;
            });
        }
        updateUI();
        startPassiveTimer();
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

function tap() {
    const amount = Math.floor(10 * multiplier);
    balance += amount;
    showFloatingText(amount);
    checkLevelUp();
    updateUI();
}

function showFloatingText(amount) {
    const text = document.createElement('span');
    text.innerText = '+' + amount;
    text.style.position = 'absolute';
    const btn = document.getElementById('tap-button');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();

    text.style.top = (rect.top + rect.height / 2 - 50) + 'px';
    text.style.left = (rect.left + rect.width / 2) + 'px';
    text.style.color = '#fff';
    text.style.fontWeight = 'bold';
    text.style.fontSize = '2em';
    text.style.pointerEvents = 'none';
    text.style.userSelect = 'none';
    document.body.appendChild(text);

    let start = null;
    const duration = 1000;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percent = Math.min(progress / duration, 1);
        text.style.transform = `translateY(-${percent * 100}px) scale(${1 - percent * 0.5})`;
        text.style.opacity = 1 - percent;
        if (percent < 1) {
            requestAnimationFrame(animate);
        } else {
            text.remove();
        }
    }
    requestAnimationFrame(animate);
}

function checkLevelUp() {
    if (balance >= level * 1000 && level < 10) {
        level++;
        showMsg(`Поздравляем! Уровень ${level}!`, "success");
    }
}

function buyCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    if (course.bought) {
        showMsg("Этот курс уже куплен!", "error");
        return;
    }

    if (balance >= course.price) {
        balance -= course.price;
        course.bought = true;
        purchasedCoursesIds.push(id);
        boughtCount++;

        passiveIncome += course.bonus * 10;
        multiplier += course.bonus;

        updateUI();
        showMsg("Курс успешно куплен!", "success");

        if (boughtCount === totalCourses) {
            showWinnerScreen();
        }
    } else {
        showMsg("Недостаточно средств!", "error");
    }
}

function startPassiveTimer() {
    let timeLeft = 10;
    const timerDisplay = document.getElementById('timer-count');

    if (!timerDisplay) return;

    const interval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            const income = Math.floor(passiveIncome);
            if (income > 0) balance += income;
            timeLeft = 10;
            timerDisplay.innerText = timeLeft;
            updateUI();

            const timerEl = document.getElementById('free-money-timer');
            if (timerEl) {
                timerEl.style.animation = 'none';
                timerEl.offsetHeight;
                timerEl.style.animation = 'pulse 2s infinite';
            }
        }
    }, 1000);
}

function giveDonation() {
    balance += 100;
    updateUI();
    showMsg("Спасибо за донат! +100 ₽", "success");
}

function updateUI() {
    document.getElementById('balance-display').innerText = balance + ' ₽';
    document.getElementById('current-multiplier').innerText = multiplier.toFixed(2) + 'x';
    document.getElementById('level-display').innerText = level;
    document.getElementById('income-per-sec').innerText = passiveIncome.toFixed(1);

    courses.forEach(course => {
        const card = document.getElementById(`card-${course.id}`);
        const btn = card ? card.querySelector('.buy-btn') : null;
        const priceSpan = document.getElementById(`price-${course.id}`);

        if (!card || !btn || !priceSpan) return;

        if (course.bought) {
            card.classList.add('bought');
            btn.disabled = true;
            btn.innerText = "Куплено!";
            btn.style.cursor = 'not-allowed';
        } else {
            card.classList.remove('bought');
            if (balance >= course.price) {
                btn.style.opacity = '1';
                btn.disabled = false;
                btn.innerText = "Купить";
                btn.style.cursor = 'pointer';
            } else {
                btn.style.opacity = '0.5';
                btn.disabled = true;
                btn.innerText = "Не хватает денег";
                btn.style.cursor = 'not-allowed';
            }
        }
    });
    saveGame();
}

function saveGame() {
    const data = {
        balance: balance,
        multiplier: multiplier,
        passiveIncome: passiveIncome,
        level: level,
        purchasedCoursesIds: purchasedCoursesIds
    };
    localStorage.setItem('clickerGameData', JSON.stringify(data));
}

function showWinnerScreen() {
    document.body.style.overflow = 'hidden';
    const screen = document.getElementById('winner-screen');
    if (screen) screen.style.display = 'flex';
}

init();
