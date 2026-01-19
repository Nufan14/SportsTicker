const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

// Reliable PNG Logos
const logos = {
    'eng.1': 'https://logos-world.net/wp-content/uploads/2020/06/Premier-League-Logo-700x394.png',
    'fra.1': 'https://1000logos.net/wp-content/uploads/2019/01/Ligue-1-Logo-2024.png',
    'ger.1': 'https://1000logos.net/wp-content/uploads/2018/10/Bundesliga-Logo.png',
    'esp.1': 'https://1000logos.net/wp-content/uploads/2018/10/La-Liga-Logo-2023.png',
    'ita.1': 'https://1000logos.net/wp-content/uploads/2019/01/Serie-A-Logo.png'
};

window.onload = () => {
    const logoImg = document.getElementById('league-logo');
    if (logoImg) logoImg.src = logos[leagueId] || logos['eng.1'];
    fetchSoccer();
};

async function fetchSoccer() {
    try {
        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=20260115-20260122&limit=100`;
        const res = await fetch(API_URL);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

        events.forEach(event => {
            const status = event.status.type.state;
            const home = event.competitions[0].competitors[0];
            const away = event.competitions[0].competitors[1];
            
            const row = document.createElement('div');
            row.className = 'game-row';
            
            row.innerHTML = `
                <div class="row-status">${event.status.type.shortDetail}</div>
                <div class="row-team home">
                    <span>${home.team.shortDisplayName || home.team.name}</span>
                    <img src="${home.team.logo}" width="25">
                </div>
                <div class="row-score">${home.score} - ${away.score}</div>
                <div class="row-team away">
                    <img src="${away.team.logo}" width="25">
                    <span>${away.team.shortDisplayName || away.team.name}</span>
                </div>
            `;

            if (status === 'in') live.appendChild(row);
            else if (status === 'pre') sched.appendChild(row);
            else if (status === 'post') fin.appendChild(row);
        });
    } catch (e) { console.error(e); }
}
setInterval(fetchSoccer, 60000);
