const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

// STABLE CDN LINKS (No Wikimedia blocks)
const logos = {
    'eng.1': 'https://www.pngall.com/wp-content/uploads/15/Premier-League-Logo-PNG-Pic.png',
    'fra.1': 'https://logos-world.net/wp-content/uploads/2023/09/Ligue-1-Logo.png',
    'ger.1': 'https://logos-world.net/wp-content/uploads/2023/03/Bundesliga-Logo.png',
    'esp.1': 'https://logos-world.net/wp-content/uploads/2023/03/La-Liga-Logo.png',
    'ita.1': 'https://logos-world.net/wp-content/uploads/2023/03/Serie-A-Logo.png'
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
        // We force a 5-day window to ensure all weekend results are captured
        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=20260115-20260121&limit=100`;
        const res = await fetch(API_URL);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

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
                    <span class="score">${home.score || '0'}</span>
                </div>
                <div class="team">
                    <img src="${away.team.logo}" width="30" onerror="this.style.opacity='0'">
                    <span>${away.team.displayName}</span>
                    <span class="score">${away.score || '0'}</span>
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
setInterval(fetchSoccer, 60000);
