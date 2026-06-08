let balance = 0, multiplier = 1, passiveIncome = 0, level = 1, boughtCount = 0;
const courses = [{ id: 1, price: 50, bonus: .01, bought: !1 }, { id: 2, price: 200, bonus: .02, bought: !1 }, { id: 3, price: 500, bonus: .03, bought: !1 }, { id: 4, price: 1000, bonus: .05, bought: !1 }, { id: 5, price: 2500, bonus: .08, bought: !1 }, { id: 6, price: 5000, bonus: .1, bought: !1 }, { id: 7, price: 10000, bonus: .12, bought: !1 }, { id: 8, price: 50000, bonus: .15, bought: !1 }];
const balanceEl = document.getElementById('balance-display'), multiplierEl = document.getElementById('current-multiplier'), incomeEl = document.getElementById('income-per-sec'), levelEl = document.getElementById('level-display'), timerCountEl = document.getElementById('timer-count'), winnerScreen = document.getElementById('winner-screen'), msgBox = document.getElementById('game-message');

document.addEventListener('DOMContentLoaded', () => { updateUI(); startPassiveIncome(); startFreeMoneyTimer(); });

function tap() { const amount = Math.floor(1 * multiplier); balance += amount; showFloatingText(amount); updateUI(); checkWinCondition(); }

function buyCourse(id) { const course = courses.find(c => c.id === id); if (!course || course.bought) return; if (balance >= course.price) { balance -= course.price; course.bought = !0; passiveIncome += course.bonus; boughtCount++; const card = document.getElementById(`card-${id}`), btn = card ? card.querySelector('.buy-btn') : null, price = card ? card.querySelector('.price-tag') : null; if (card) card.classList.add('bought'); if (btn) { btn.disabled = !0; btn.textContent = 'Куплено'; } if (price) price.style.opacity = '0.5'; updateUI(); showMessage(`Курс ${course.id} куплен! Доход +${course.bonus}/сек`) } else { showMessage('Не хватает денег!'); } }

function startPassiveIncome() { setInterval(() => { if (passiveIncome > 0) { balance += passiveIncome; updateUI(); checkWinCondition(); } }, 1000); }

function startFreeMoneyTimer() { let timeLeft = 10; const timerInterval = setInterval(() => { timeLeft--; timerCountEl.textContent = timeLeft; if (timeLeft <= 0) { clearInterval(timerInterval); const freeMoney = Math.floor(balance * .1) || 10; balance += freeMoney; showMessage(`+${freeMoney} ₽ бесплатно!`); timeLeft = 10; setTimeout(() => startFreeMoneyTimer(), 2000); } }, 1000); }

function checkWinCondition() { if (balance >= 1000000 && !winnerScreen.style.display.includes('block')) winnerScreen.style.display = 'flex'; }

function restartGame() { balance = 0; multiplier = 1; passiveIncome = 0; level = 1; boughtCount = 0; courses.forEach(course => { course.bought = !1; const card = document.getElementById(`card-${course.id}`), btn = card ? card.querySelector('.buy-btn') : null, price = card ? card.querySelector('.price-tag') : null; if (card) card.classList.remove('bought'); if (btn) { btn.disabled = !1; btn.textContent = 'Купить'; } if (price) price.style.opacity = '1'; }); winnerScreen.style.display = 'none'; updateUI(); showMessage('Игра перезапущена!'); }

function updateUI() { balanceEl.textContent = formatMoney(balance) + ' ₽'; multiplierEl.textContent = `${multiplier}x`; incomeEl.textContent = Math.floor(passiveIncome); levelEl.textContent = Math.max(1, Math.floor(Math.log10(balance)) + 1); }

function formatMoney(num) { if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'; if (num >= 1000) return (num / 1000).toFixed(1) + 'k'; return num.toString(); }

function showFloatingText(amount) { const el = document.createElement('div'); el.textContent = '+' + amount; el.style.position = 'absolute'; el.style.left = '50%'; el.style.top = '30%'; el.style.transform = 'translateX(-50%) translateY(-50%)'; el.style.color = '#ffd700'; el.style.fontWeight = 'bold'; el.style.fontSize = '24px'; el.style.pointerEvents = 'none'; el.style.textShadow = '0 0 10px rgba(255,215,0,0.8)'; document.body.appendChild(el); setTimeout(() => { el.style.transition = 'all 0.5s ease'; el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(-100px)'; setTimeout(() => el.remove(), 500); }, 50); }

function showMessage(text) { msgBox.textContent = text; msgBox.style.opacity = '1'; setTimeout(() => { msgBox.style.opacity = '0'; }, 3000); }
