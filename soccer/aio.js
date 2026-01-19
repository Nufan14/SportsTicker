const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

const logos = {
    'eng.1': 'https://logos-world.net/wp-content/uploads/2020/06/Premier-League-Logo-700x394.png',
    'fra.1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ligue1_Logo_2024.svg/512px-Ligue1_Logo_2024.svg.png',
    'ger.1': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/512px-Bundesliga_logo_%282017%29.svg.png',
    'esp.1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_2023_logo.svg/512px-LaLiga_2023_logo.svg.png',
    'ita.1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Serie_A_logo_2022.svg/512px-Serie_A_logo_2022.svg.png'
};

window.onload = () => {
    const logoImg = document.getElementById('league-logo');
    if (logoImg) {
        logoImg.src = logos[leagueId] || logos['eng.1'];
        console.log("Loading logo for:", leagueId);
    }
    fetchSoccer();
};

async function fetchSoccer() {
    try {
        // Broadening the fetch to include more history
        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?limit=50`;
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
                    <img src="${home.team.logo}" width="30" onerror="this.src='https://www.espn.com/favicon.ico'">
                    <span>${home.team.displayName}</span>
                    <span class="score">${home.score || '0'}</span>
                </div>
                <div class="team">
                    <img src="${away.team.logo}" width="30" onerror="this.src='https://www.espn.com/favicon.ico'">
                    <span>${away.team.displayName}</span>
                    <span class="score">${away.score || '0'}</span>
                </div>
                <div class="game-status">${event.status.type.detail}</div>
            `;

            // Display Logic
            if (status === 'in') live.appendChild(card);
            else if (status === 'pre') sched.appendChild(card);
            else if (status === 'post') fin.appendChild(card);
        });

    } catch (e) {
        console.error("Soccer Fetch Error:", e);
    }
}
setInterval(fetchSoccer, 60000);
