
const services = [
    {
        icon: 'assets/emergency.png',
        title: 'National Emergency Number',
        subtitle: 'National Emergency',
        number: '999',
        category: 'All'
    },
    {
        icon: 'assets/police.png',
        title: 'Police Helpline Number',
        subtitle: 'Police',
        number: '999',
        category: 'Police'
    },
    {
        icon: 'assets/fire-service.png',
        title: 'Fire Service Number',
        subtitle: 'Fire Service',
        number: '999',
        category: 'Fire'
    },
    {
        icon: 'assets/ambulance.png',
        title: 'Ambulance Service',
        subtitle: 'Ambulance',
        number: '1994-999999',
        category: 'Health'
    },
    {
        icon: 'assets/emergency.png',
        title: 'Women & Child Helpline',
        subtitle: 'Women & Child Helpline',
        number: '109',
        category: 'Help'
    },
    {
        icon: 'assets/emergency.png',
        title: 'Anti-Corruption Helpline',
        subtitle: 'Anti-Corruption',
        number: '106',
        category: 'Govt.'
    },
    {
        icon: 'assets/emergency.png',
        title: 'Electricity Helpline',
        subtitle: 'Electricity Outage',
        number: '16216',
        category: 'Electricity'
    },
    {
        icon: 'assets/brac.png',
        title: 'Brac Helpline',
        subtitle: 'Brac',
        number: '16445',
        category: 'NGO'
    },
    {
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

let heartCount = 0;
let coinCount = 100;
let copyCount = 0; // Initial value from HTML
let callHistory = [];

function renderServices() {
    servicesGrid.innerHTML = '';
    services.forEach(service => {
        const serviceCard = `
            <div class="service-card">
                <i class="far fa-heart fav-icon"></i>
                <div class="service-icon">
                    <img src="${service.icon}" alt="${service.title}">
                </div>
                <h3>${service.title}</h3>
                <p>${service.subtitle}</p>
                <div class="number">${service.number}</div>
                <div class="category">${service.category}</div>
                <div class="service-buttons">
                    <button class="copy-btn"><i class="far fa-copy"></i> Copy</button>
                    <button class="call-btn"><i class="fas fa-phone"></i> Call</button>
                </div>
            </div>
        `;
        servicesGrid.insertAdjacentHTML('beforeend', serviceCard);
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
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    callHistory.push({ title, number, time });
    renderCallHistory();
}

function updateHeartCount() {
    heartCount++;
    heartCountSpan.textContent = heartCount;
}

function handleCall(title, number) {
    if (coinCount < 20) {
        alert('Not enough coins to make a call.');
        return;
    }

    coinCount -= 20;
    coinCountSpan.textContent = coinCount;
    alert(`Calling ${title} at ${number}`);
    addToHistory(title, number);
}

servicesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card');
    if (!card) return;

    const title = card.querySelector('h3').textContent;
    const number = card.querySelector('.number').textContent;

    if (e.target.classList.contains('fav-icon')) {
        updateHeartCount();
        e.target.classList.toggle('far');
        e.target.classList.toggle('fas');
        e.target.style.color = e.target.classList.contains('fas') ? 'red' : '#ccc';
    }

    if (e.target.classList.contains('copy-btn')) {
        navigator.clipboard.writeText(number).then(() => {
            alert('Number copied to clipboard');
            copyCount++;
            copyBtnTop.textContent = `${copyCount} Copy`;
        });
    }

    if (e.target.classList.contains('call-btn')) {
        handleCall(title, number);
    }
});

clearHistoryBtn.addEventListener('click', () => {
    callHistory = [];
    renderCallHistory();
});

// Initial Render
renderServices();
coinCountSpan.textContent = coinCount;
copyBtnTop.textContent = `${copyCount} Copy`;

