
document.addEventListener("DOMContentLoaded", function() {
    const img = document.querySelector('.motivational-image');
    if(img) {
        img.style.opacity = 1;
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const monthYear = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendarBody');

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const months = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Ustalmy pierwszy dzień tygodnia (niedziela = 0, poniedziałek = 1 itd.)
    let startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Dodaj puste pola przed pierwszym dniem
    for (let i = 0; i < startDay; i++) {
        let emptyCell = document.createElement('div');
        calendarBody.appendChild(emptyCell);
    }

    // Wstaw dni miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
        let dayCell = document.createElement('div');
        dayCell.textContent = day;

        if (day === now.getDate()) {
            dayCell.classList.add('today');  // Podświetl dzisiejszy dzień
        }

        calendarBody.appendChild(dayCell);
    }
});
