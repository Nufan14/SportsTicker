// 1. Identify which league to show from the URL (?league=...)
const params = new URLSearchParams(window.location.search);
const leagueId = params.get('league') || 'eng.1';

// 2. Official Logo Mapping
const logos = {
    'eng.1': 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    'fra.1': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Ligue_1_McDonald%27s_logo.svg',
    'ger.1': 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
    'esp.1': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_2023_logo.svg',
    'ita.1': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg'
};

// Set the background logo immediately
document.getElementById('league-logo').src = logos[leagueId] || logos['eng.1'];

async function fetchSoccer() {
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

        if (events.length === 0) {
            sched.innerHTML = '<p class="no-games">No matches scheduled for today.</p>';
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
                    <img src="${home.team.logo}" width="30">
                    <span>${home.team.displayName}</span>
                    <span class="score">${home.score}</span>
                </div>
                <div class="team">
                    <img src="${away.team.logo}" width="30">
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
        console.error("Soccer API Error:", e); 
    }
}

fetchSoccer();
setInterval(fetchSoccer, 60000); // Update every minute
