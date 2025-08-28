const services = [
    {
        id: 1,
        icon: 'assets/emergency.png',
        title: 'National Emergency Number',
        subtitle: 'National Emergency',
        number: '999',
        category: 'All'
    },
    {
        id: 2,
        icon: 'assets/police.png',
        title: 'Police Helpline Number',
        subtitle: 'Police',
        number: '999',
        category: 'Police'
    },
    {
        id: 3,
        icon: 'assets/fire-service.png',
        title: 'Fire Service Number',
        subtitle: 'Fire Service',
        number: '999',
        category: 'Fire'
    },
    {
        id: 4,
        icon: 'assets/ambulance.png',
        title: 'Ambulance Service',
        subtitle: 'Ambulance',
        number: '1994-999999',
        category: 'Health'
    },
    {
        id: 5,
        icon: 'assets/emergency.png',
        title: 'Women & Child Helpline',
        subtitle: 'Women & Child Helpline',
        number: '109',
        category: 'Help'
    },
    {
        id: 6,
        icon: 'assets/emergency.png',
        title: 'Anti-Corruption Helpline',
        subtitle: 'Anti-Corruption',
        number: '106',
        category: 'Govt.'
    },
    {
        id: 7,
        icon: 'assets/emergency.png',
        title: 'Electricity Helpline',
        subtitle: 'Electricity Outage',
        number: '16216',
        category: 'Electricity'
    },
    {
        id: 8,
        icon: 'assets/brac.png',
        title: 'Brac Helpline',
        subtitle: 'Brac',
        number: '16445',
        category: 'NGO'
    },
    {
        id: 9,
        icon: 'assets/Bangladesh-Railway.png',
        title: 'Bangladesh Railway Helpline',
        subtitle: 'Bangladesh Railway',
        number: '163',
        category: 'Travel'
    }
];

const servicesGrid = document.querySelector('.services-grid');
const historyList = document.querySelector('.history-list');
const clearHistoryBtn = document.querySelector('.clear-history');
const heartCountSpan = document.querySelector('.nav-icons .nav-icon:nth-child(1) span');
const coinCountSpan = document.querySelector('.nav-icons .nav-icon:nth-child(2) span');
const copyBtnTop = document.querySelector('.copy-btn-top');

function safeParse(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch {
        return fallback;
    }
}

let heartCount = Number(localStorage.getItem('heartCount')) || 0;
let coinCount = Number(localStorage.getItem('coinCount')) || 100;
let copyCount = Number(localStorage.getItem('copyCount')) || 0;
let callHistory = safeParse('callHistory', []);
let favorites = safeParse('favorites', []);
let lastCopiedNumber = localStorage.getItem('lastCopiedNumber') || '';
let copiedNumbers = safeParse('copiedNumbers', []);

function saveState() {
    try {
        localStorage.setItem('heartCount', heartCount);
        localStorage.setItem('coinCount', coinCount);
        localStorage.setItem('copyCount', copyCount);
        localStorage.setItem('callHistory', JSON.stringify(callHistory));
        localStorage.setItem('favorites', JSON.stringify(favorites));
        localStorage.setItem('lastCopiedNumber', lastCopiedNumber);
        localStorage.setItem('copiedNumbers', JSON.stringify(copiedNumbers));
    } catch (e) {
        showToast('Unable to save data. Storage may be full or disabled.');
        announce('Unable to save data. Storage may be full or disabled.');
    }
}

function renderServices() {
    servicesGrid.innerHTML = '';
    services.forEach(service => {
        const isFav = favorites.includes(service.id);
        const callDisabled = coinCount < 20 ? 'disabled' : '';
        const favAria = isFav ? 'true' : 'false';
        const favClass = isFav ? 'fav-btn favorited' : 'fav-btn';
        const card = `
            <div class="service-card" data-id="${service.id}" tabindex="0">
                <button class="${favClass}" aria-label="Favorite" aria-pressed="${favAria}" tabindex="0">
                    <i class="fa-heart fa${isFav ? 's' : 'r'}"></i>
                </button>
                <div class="service-icon">
                    <img src="${service.icon}" alt="${service.title}" onerror="this.onerror=null;this.src='assets/emergency.png';">
                </div>
                <h3>${service.title}</h3>
                <p>${service.subtitle}</p>
                <div class="number">${service.number}</div>
                <div class="category">${service.category}</div>
                <div class="service-buttons">
                    <button class="copy-btn" aria-label="Copy number" tabindex="0"><i class="far fa-copy"></i> Copy</button>
                    <button class="call-btn" aria-label="Call number" ${callDisabled} tabindex="0"><i class="fas fa-phone"></i> Call</button>
                </div>
            </div>
        `;
        servicesGrid.insertAdjacentHTML('beforeend', card);
    });
}

function renderCallHistory() {
    historyList.innerHTML = '';
    callHistory.forEach(call => {
        const historyItem = `
            <li>
                <span>${call.title} - ${call.number}</span>
                <span>${call.time}</span>
            </li>
        `;
        historyList.insertAdjacentHTML('beforeend', historyItem);
    });
}

function addToHistory(title, number) {
    const now = new Date();
    const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    callHistory.push({ title, number, time });
    if (callHistory.length > 20) callHistory.shift();
    saveState();
    renderCallHistory();
}

function updateHeartCount() {
    heartCount++;
    heartCountSpan.textContent = heartCount;
    saveState();
}

function handleCall(title, number) {
    if (coinCount < 20) {
        showToast('Not enough coins to make a call.');
        return;
    }
    coinCount -= 20;
    coinCountSpan.textContent = coinCount;
    saveState();
    showToast(`Calling ${title} at ${number}`);
    addToHistory(title, number);
    renderServices();
}

function updateCopyBtnTop() {
    const count = copiedNumbers.length;
    copyBtnTop.textContent = count > 0 ? `Copy (${count})` : 'Copy';
    copyBtnTop.disabled = false;
}

function updateCountsUI() {
    heartCountSpan.textContent = heartCount;
    coinCountSpan.textContent = coinCount;
    updateCopyBtnTop();
}

servicesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card');
    if (!card) return;
    const id = Number(card.dataset.id);
    const service = services.find(s => s.id === id);
    if (!service) return;

    if (e.target.closest('.fav-btn')) {
        if (!favorites.includes(id)) {
            favorites.push(id);
            updateHeartCount();
        } else {
            favorites = favorites.filter(favId => favId !== id);
            heartCount = Math.max(0, heartCount - 1);
            heartCountSpan.textContent = heartCount;
        }
        saveState();
        renderServices();
        return;
    }


    if (e.target.closest('.copy-btn')) {
        function afterCopy() {
            lastCopiedNumber = service.number;
            if (!copiedNumbers.includes(service.number)) {
                copiedNumbers.push(service.number);
            }
            saveState();
            updateCopyBtnTop();
            showToast('Number copied to clipboard');
            announce('Number copied to clipboard');
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(service.number).then(afterCopy).catch(() => {
                window.prompt('Copy this number:', service.number);
                afterCopy();
            });
        } else {

            window.prompt('Copy this number:', service.number);
            afterCopy();
        }
        return;
    }

    if (e.target.closest('.call-btn') && coinCount >= 20) {
        handleCall(service.title, service.number);
        return;
    }
});

servicesGrid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.service-card');
    if (!card) return;
    const id = Number(card.dataset.id);
    const service = services.find(s => s.id === id);
    if (!service) return;

    if (e.target.classList.contains('fav-btn')) {
        e.preventDefault();
        if (!favorites.includes(id)) {
            favorites.push(id);
            updateHeartCount();
        } else {
            favorites = favorites.filter(favId => favId !== id);
            heartCount = Math.max(0, heartCount - 1);
            heartCountSpan.textContent = heartCount;
        }
        saveState();
        renderServices();
        return;
    }

    if (e.target.classList.contains('copy-btn')) {
        e.preventDefault();
        navigator.clipboard.writeText(service.number).then(() => {
            lastCopiedNumber = service.number;
            if (!copiedNumbers.includes(service.number)) {
                copiedNumbers.push(service.number);
            }
            saveState();
            updateCopyBtnTop();
            showToast('Number copied to clipboard');
            announce('Number copied to clipboard');
        });
        return;
    }

    if (e.target.classList.contains('call-btn') && coinCount >= 20) {
        e.preventDefault();
        handleCall(service.title, service.number);
        return;
    }
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the call history?')) {
        callHistory = [];
        lastCopiedNumber = '';
        copiedNumbers = [];
        saveState();
        renderCallHistory();
        updateCopyBtnTop();
        announce('Call history and copied numbers cleared.');
        showToast('Call history and copied numbers cleared.');
    }
});


copyBtnTop.addEventListener('click', () => {
    if (!lastCopiedNumber) {
        showToast('No number copied yet.');
        return;
    }
    navigator.clipboard.writeText(lastCopiedNumber).then(() => {
        copyCount++;
        updateCopyBtnTop();
        saveState();
        showToast('Number copied to clipboard');
    }).catch(() => {
        showToast('Failed to copy number.');
    });
});


function showToast(msg) {
    let toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'toast-message';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
}

renderServices();
renderCallHistory();
updateCountsUI();
if (coinCount < 20) renderServices();
if (lastCopiedNumber && !copiedNumbers.includes(lastCopiedNumber)) {
    copiedNumbers.push(lastCopiedNumber);
    saveState();
    updateCopyBtnTop();
}
