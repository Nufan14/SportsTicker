const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

const logos = {
    'eng.1': 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    // Swapped to more stable PNG/SVG links for Ligue 1 and La Liga
    'fra.1': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Ligue1_Logo_2024.svg',
    'ger.1': 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
    'esp.1': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_2023_logo.svg',
    'ita.1': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg'
};

window.onload = () => {
    const logoImg = document.getElementById('league-logo');
    if (logoImg) {
        logoImg.src = logos[leagueId] || logos['eng.1'];
    }
    fetchSoccer();
};

async function fetchSoccer() {
    try {
        // We remove the specific ?dates= limit to allow the API to show the full "Recent" window
        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`;
        const res = await fetch(API_URL);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

        if (events.length === 0) {
            sched.innerHTML = `<p class="no-games">No matches found.</p>`;
            return;
        }

        events.forEach(event => {
            const status = event.status.type.state;
            const card = document.createElement('div');
            card.className = 'game-card';
            const home = event.competitions[0].competitors[0];
            const away = event.competitions[0].competitors[1];

            card.innerHTML = `
                <div class="team">
                    <img src="${home.team.logo}" width="30" onerror="this.style.opacity='0'">
                    <span>${home.team.displayName}</span>
                    <span class="score">${home.score}</span>
                </div>
                <div class="team">
                    <img src="${away.team.logo}" width="30" onerror="this.style.opacity='0'">
                    <span>${away.team.displayName}</span>
                    <span class="score">${away.score}</span>
                </div>
                <div class="game-status">${event.status.type.detail}</div>
            `;

            if (status === 'in') live.appendChild(card);
            else if (status === 'pre') sched.appendChild(card);
            else if (status === 'post') fin.appendChild(card);
        });

    } catch (e) {
        console.error("Soccer Fetch Error:", e);
    }
}
setInterval(fetchSoccer, 60000);
