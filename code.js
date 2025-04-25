// ----------- ZEGAR -----------
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// ----------- POGODA -----------
const cityCoords = {
    "Warszawa": { lat: 52.2297, lon: 21.0122 },
    "Kraków": { lat: 50.0647, lon: 19.9450 },
    "Wrocław": { lat: 51.1079, lon: 17.0385 },
    "Gdańsk": { lat: 54.3520, lon: 18.6466 },
    "Poznań": { lat: 52.4064, lon: 16.9252 }
};

const weatherIcons = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
    51: "🌦️", 61: "🌧️", 71: "❄️", 80: "🌧️", 95: "⛈️"
};

document.getElementById('citySelect').addEventListener('change', function() {
    const city = this.value;
    const coords = cityCoords[city];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const code = data.current_weather.weathercode;
            const icon = weatherIcons[code] || "❓";
            document.getElementById('weatherInfo').textContent = `${icon} W ${city} jest ${temp}°C`;
        })
        .catch(err => {
            document.getElementById('weatherInfo').textContent = "Błąd pobierania pogody";
        });
});

// ----------- FORMATOWANIE DATY -----------
function formatDateString(date) {
    const dniTygodnia = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const dayName = dniTygodnia[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}.${month}.${year}`;
}

// ----------- WYŚWIETLANIE ZADAŃ -----------
function showTasksForDate(dateKey) {
    const content = document.querySelector('.content');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    console.log("🔎 Wybrana data:", dateKey);
    console.log("📂 Zadania w LocalStorage:", tasks);
    console.log("📅 Zadania dla tej daty:", tasks[dateKey]);

    let taskListHTML = "";

    if(tasks[dateKey] && tasks[dateKey].length > 0) {
        taskListHTML = tasks[dateKey].map((task, index) => {
            return `
                <li>
                    <input type="checkbox" data-date="${dateKey}" data-index="${index}" ${task.done ? 'checked' : ''}>
                    ${task.name}
                </li>
            `;
        }).join("");
    } else {
        taskListHTML = "<li>Brak zadań na ten dzień.</li>";
    }

    const dateObj = new Date(dateKey);

    content.innerHTML = `
        <h1 id="selectedDateTitle">${formatDateString(dateObj)}</h1>
        <ul id="taskList">${taskListHTML}</ul>
    `;
}

// ----------- KALENDARZ -----------
let currentDate = new Date();

function renderCalendar(date) {
    const monthYear = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const months = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) {
        calendarBody.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayCell = document.createElement('div');
        dayCell.textContent = day;

        if (day === (new Date()).getDate() && month === (new Date()).getMonth() && year === (new Date()).getFullYear()) {
            dayCell.classList.add('today');
        }

        dayCell.style.cursor = "pointer";

        dayCell.addEventListener('click', function() {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            showTasksForDate(dateKey);
        });

        calendarBody.appendChild(dayCell);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    renderCalendar(currentDate);

    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
});

// ----------- O NAS -----------
document.getElementById('aboutLink').addEventListener('click', function(e) {
    e.preventDefault();
    const content = document.querySelector('.content');
    content.innerHTML = `
        <h1>Twórcami projektu GoodHabits są:</h1>
        <ul class="creators-list">
            <li>Krystian Jurczyński</li>
            <li>Cyprian Dominiczak</li>
            <li>Oskar Ernst</li>
        </ul>
    `;
});

// ----------- DODAJ ZADANIE (ZABEZPIECZENIE) -----------
document.getElementById('addTaskLink').addEventListener('click', function(e) {
    e.preventDefault();
    const content = document.querySelector('.content');
    const today = new Date().toISOString().split('T')[0];

    content.innerHTML = `
        <h1>Dodaj nowe zadanie</h1>
        <form id="taskForm">
            <label>Wybierz dzień:</label><br>
            <input type="date" id="taskDate" value="${today}" required><br><br>

            <label>Nazwa zadania:</label><br>
            <input type="text" id="taskName" placeholder="Wpisz nazwę zadania" required><br><br>

            <button type="submit">Dodaj zadanie</button>
        </form>
        <div id="taskMessage"></div>
    `;
    
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('taskDate').value;
        const name = document.getElementById('taskName').value.trim();
        
        if(name === "") return;

        let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        if(typeof tasks !== 'object' || Array.isArray(tasks)) {
            tasks = {};  // Reset jeśli coś poszło nie tak
        }

        if(!tasks[date]) tasks[date] = [];
        tasks[date].push({ name: name, done: false });

        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log("✅ Zadanie dodane! Aktualny LocalStorage:", tasks);

        showTasksForDate(date);
    });
});

// ----------- CHECKBOX -----------
document.addEventListener('change', function(e) {
    if(e.target.matches('#taskList input[type="checkbox"]')) {
        const date = e.target.getAttribute('data-date');
        const index = e.target.getAttribute('data-index');
        let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[date][index].done = e.target.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
