const params = new URLSearchParams(window.location.search);
const leagueId = params.get('league') || 'eng.1';

// Dynamic logo mapping
const logos = {
    'eng.1': 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    'fra.1': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Ligue_1_McDonald%27s_logo.svg',
    'ger.1': 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
    'esp.1': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_2023_logo.svg',
    'ita.1': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg'
};

// Immediately set the logo so it appears even if there are no games
const logoImg = document.getElementById('league-logo');
if (logoImg) {
    logoImg.src = logos[leagueId] || logos['eng.1'];
}

async function fetchSoccer() {
    try {
        // Today's date in YYYYMMDD format to prevent empty API returns
        const today = new Date();
        const dateStr = today.getFullYear() + 
                        String(today.getMonth() + 1).padStart(2, '0') + 
                        String(today.getDate()).padStart(2, '0');

        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${dateStr}`);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

        if (events.length === 0) {
            sched.innerHTML = '<p class="no-games">No matches found for this date.</p>';
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
        console.error("Soccer Error:", e); 
    }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
