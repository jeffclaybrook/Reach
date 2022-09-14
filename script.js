let recordings = [];
let current = 1;
let maxItems = 5;

const copyBtn = document.querySelector('#copy');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');

async function getRecordings() {
    const res = await fetch('data.json');
    const data = await res.json();
    recordings = data;
}

async function displayRecordings(page = 1) {
    await getRecordings();

    page == 1 ?
    prevBtn.classList.add('disabled') :
    prevBtn.classList.remove('disabled');
    
    page == totalPages() ?
    nextBtn.classList.add('disabled') :
    nextBtn.classList.remove('disabled');

    let result = '';
    recordings.filter((li, index) => {
        let start = (current - 1) * maxItems;
        let end = current * maxItems;
        if (index >= start && index < end) return true;
    }).forEach(item => {
        result += `
        <li>
            <p>${item.name}</p>
            <p>${item.date}</p>
            <p>${item.time}</p>
            <p>${item.duration}</p>
        </li>
        `;
    })
    document.querySelector('.recordings').innerHTML = result;
}

function prevPage() {
    if (current > 1) {
        current--;
        displayRecordings(current);
    }
}

function nextPage() {
    if ((current * maxItems) < recordings.length) {
        current++;
        displayRecordings(current);
    }
}

function totalPages() {
    return Math.ceil(recordings.length / maxItems);
}

function getDate() {
    const currentDate = new Date();
    const formatTime = { hour: '2-digit', minute: '2-digit' };
    const formatDate = { weekday: 'short', month: 'short', day: 'numeric' };
    const time = document.querySelector('#time');
    const date = document.querySelector('#date');
    time.innerHTML = currentDate.toLocaleTimeString('en-US', formatTime);
    date.innerHTML = currentDate.toLocaleDateString('en-US', formatDate);
}

function copyURL() {
    const room = document.querySelector('#room');
    const clipboard = navigator.clipboard;
    clipboard.writeText(room.innerText)
    .then(() => showToast());
}

function showToast() {
    const toast = document.querySelector('#toast');
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active')
    }, 3000);
}

displayRecordings();
getDate();

prevBtn.addEventListener('click', prevPage);
nextBtn.addEventListener('click', nextPage);
copyBtn.addEventListener('click', copyURL);